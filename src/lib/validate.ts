/**
 * Laufzeit-Validierung der JSON-Taktikdaten.
 * Ziel: Eine kaputte Taktik darf NIEMALS die ganze Seite lahmlegen.
 * Fehler werden gesammelt, die betroffene Taktik wird verworfen und
 * im Admin-/Settings-Bereich als Fehler gemeldet.
 */
import type { BombSite, Marker, Tactic, ValidationIssue } from '../types';

const FLOORS = ['B', '1F', '2F', '3F'] as const;
const MARKER_KINDS = ['position', 'gadget', 'angle', 'plant', 'spawn', 'rotation', 'breach'];
const ROLES = [
  'Anchor', 'Flex-Anchor', 'Roamer', 'Deep-Roamer', 'Support-Roamer', 'Utility-Support',
  'Hard-Breach', 'Soft-Breach', 'Entry', 'Support', 'Intel', 'Flank-Watch', 'Vertical',
];
const OBJECTIVES = [
  'anchor', 'roam', 'support', 'antiEntry', 'plantDenial', 'hardBreach', 'softBreach', 'intel',
  'flankWatch', 'vertical', 'entry', 'retake', 'postPlant', 'breach', 'utility',
];

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

function validateMarker(m: unknown, path: string, issues: ValidationIssue[]) {
  if (!isObj(m)) { issues.push({ file: path, path, message: 'Marker ist kein Objekt', severity: 'error' }); return false; }
  if (!FLOORS.includes(m.floor as never)) issues.push({ file: path, path: `${path}.floor`, message: `Etage "${String(m.floor)}" ungültig`, severity: 'error' });
  if (!isNum(m.x) || m.x < 0 || m.x > 100) issues.push({ file: path, path: `${path}.x`, message: 'x muss 0–100 sein', severity: 'error' });
  if (!isNum(m.y) || m.y < 0 || m.y > 100) issues.push({ file: path, path: `${path}.y`, message: 'y muss 0–100 sein', severity: 'error' });
  if (!MARKER_KINDS.includes(m.kind as never)) issues.push({ file: path, path: `${path}.kind`, message: `Marker-Typ "${String(m.kind)}" unbekannt`, severity: 'error' });
  if (!isStr(m.label)) issues.push({ file: path, path: `${path}.label`, message: 'Marker ohne Label', severity: 'warning' });
  if (m.toFloor !== undefined && !FLOORS.includes(m.toFloor as never)) issues.push({ file: path, path: `${path}.toFloor`, message: 'toFloor ungültig', severity: 'error' });
  return issues.filter((i) => i.path.startsWith(path)).length === 0;
}

function validatePlayer(p: unknown, path: string, issues: ValidationIssue[]) {
  if (!isObj(p)) { issues.push({ file: path, path, message: 'Spieler kein Objekt', severity: 'error' }); return; }
  if (!isNum(p.slot) || p.slot < 1 || p.slot > 5) issues.push({ file: path, path: `${path}.slot`, message: 'slot muss 1–5 sein', severity: 'error' });
  if (!isStr(p.operator)) issues.push({ file: path, path: `${path}.operator`, message: 'Operator fehlt', severity: 'error' });
  if (!ROLES.includes(p.role as never)) issues.push({ file: path, path: `${path}.role`, message: `Rolle "${String(p.role)}" unbekannt`, severity: 'error' });
  if (!isStrArr(p.prep)) issues.push({ file: path, path: `${path}.prep`, message: 'prep muss String-Array sein', severity: 'error' });
  if (!isStrArr(p.action)) issues.push({ file: path, path: `${path}.action`, message: 'action muss String-Array sein', severity: 'error' });
  if (!Array.isArray(p.objectives) || !p.objectives.every((o) => OBJECTIVES.includes(o as never)))
    issues.push({ file: path, path: `${path}.objectives`, message: 'Ungültige Objectives', severity: 'error' });
  if (!isObj(p.loadout) || !isStr(p.loadout.primary) || !isStr(p.loadout.secondary) || !isStr(p.loadout.gadget))
    issues.push({ file: path, path: `${path}.loadout`, message: 'Loadout unvollständig', severity: 'error' });
  if (Array.isArray(p.markers)) p.markers.forEach((m, i) => validateMarker(m, `${path}.markers[${i}]`, issues));
  else issues.push({ file: path, path: `${path}.markers`, message: 'Marker-Array fehlt', severity: 'warning' });
}

/** Validiert eine Taktik; gibt bereinigte Taktik + Issues zurück. */
export function validateTactic(raw: unknown, file: string): { tactic: Tactic | null; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  if (!isObj(raw)) {
    issues.push({ file, path: '$', message: 'Datei enthält kein Objekt', severity: 'error' });
    return { tactic: null, issues };
  }
  ['id', 'map', 'site', 'name', 'summary', 'updated'].forEach((k) => {
    if (!isStr(raw[k])) issues.push({ file, path: k, message: `Pflichtfeld "${k}" fehlt`, severity: 'error' });
  });
  if (raw.side !== 'attack' && raw.side !== 'defense')
    issues.push({ file, path: 'side', message: 'side muss "attack" oder "defense" sein', severity: 'error' });
  if (!isObj(raw.ratings)) issues.push({ file, path: 'ratings', message: 'ratings fehlt', severity: 'error' });

  const players = Array.isArray(raw.players) ? raw.players : [];
  if (players.length !== 5) issues.push({ file, path: 'players', message: `Es müssen exakt 5 Spieler sein (gefunden: ${players.length})`, severity: 'error' });
  players.forEach((p, i) => validatePlayer(p, `players[${i}]`, issues));

  const ops = new Set<string>();
  players.forEach((p) => {
    if (isObj(p) && isStr(p.operator)) {
      if (ops.has(p.operator)) issues.push({ file, path: 'players', message: `Operator "${p.operator}" doppelt vergeben`, severity: 'error' });
      ops.add(p.operator);
    }
  });

  if (raw.substitutes !== undefined) {
    if (!Array.isArray(raw.substitutes)) issues.push({ file, path: 'substitutes', message: 'substitutes muss Array sein', severity: 'warning' });
    else raw.substitutes.forEach((s: unknown, i: number) => {
      if (!isObj(s) || !isStr(s.operator) || !isStr(s.for) || !isStr(s.reason))
        issues.push({ file, path: `substitutes[${i}]`, message: 'Ersatzpick unvollständig', severity: 'warning' });
    });
  }

  if (raw.side === 'attack') {
    const ap = raw.attackPlan;
    if (!isObj(ap)) issues.push({ file, path: 'attackPlan', message: 'Angriffstaktik ohne attackPlan', severity: 'error' });
    else {
      if (!isNum(ap.spawnX) || !isNum(ap.spawnY)) issues.push({ file, path: 'attackPlan.spawn', message: 'Spawn-Koordinaten fehlen', severity: 'error' });
      if (!isObj(ap.plant) || !isNum(ap.plant.x) || !isNum(ap.plant.y))
        issues.push({ file, path: 'attackPlan.plant', message: 'Plant-Position fehlt', severity: 'error' });
      ['entryRoute', 'drones', 'execute', 'postPlant', 'alt'].forEach((k) => {
        if (k === 'alt') {
        if (!isObj(ap.alt) || !isStr((ap.alt as Record<string, unknown>).spawn))
          issues.push({ file, path: 'attackPlan.alt', message: 'Alternativ-Spawn fehlt', severity: 'error' });
      } else if (!isStrArr(ap[k])) issues.push({ file, path: `attackPlan.${k}`, message: `${k} muss String-Array sein`, severity: 'error' });
      });
    }
  }

  const hasError = issues.some((i) => i.severity === 'error');
  return { tactic: hasError ? null : (raw as unknown as Tactic), issues };
}

/** Prüft, ob eine Bombsite-Angabe in der Map existiert. */
export function siteExists(map: { bombSites: BombSite[] }, siteId: string): boolean {
  return map.bombSites.some((s) => s.id === siteId);
}

/** Prüft Marker-Konsistenz: Rotationen brauchen Zielkoordinaten. */
export function sanitizeMarker(m: Marker): Marker {
  if (m.kind === 'rotation' && (m.toX === undefined || m.toY === undefined)) {
    return { ...m, toX: m.x, toY: m.y };
  }
  return m;
}

export function summarizeIssues(all: ValidationIssue[]) {
  const errors = all.filter((i) => i.severity === 'error');
  const warnings = all.filter((i) => i.severity === 'warning');
  return { errors, warnings, ok: errors.length === 0 };
}

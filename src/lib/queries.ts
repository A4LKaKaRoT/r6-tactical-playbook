/**
 * Zentrale Abfrage- und Auswahl-Logik.
 * - Lädt Taktiken, validiert sie, verwirft fehlerhafte Einträge einzeln.
 * - Berechnet bei Bans die Ersatzpicks nach taktischer Funktion
 *   (gleiche Rolle -> ähnliche Aufgabe -> Teammeta).
 */
import type { Operator, Tactic, MapInfo, PlayerSlot, Substitute } from '../types';
import tacticsJson from '../data/tactics/tactics.json';
import mapsA from '../data/maps/maps-a.json';
import mapsB from '../data/maps/maps-b.json';
import opJson from '../data/operators/operators.json';
import metaJson from '../data/metadata/meta.json';
import { validateTactic, summarizeIssues } from './validate';
import type { GameMeta, ValidationIssue } from '../types';

export const MAPS: MapInfo[] = [...(mapsA as MapInfo[]), ...(mapsB as MapInfo[])];
export const OPERATORS: Operator[] = opJson as Operator[];
export const META = metaJson as GameMeta;

const rawTactics = tacticsJson as unknown[];

/**
 * Standardpläne liegen direkt im Start-Chunk (klein, sofort da).
 * Die 360 Varianten (~3 MB JSON) kommen als eigener Chunk nachgeladen –
 * siehe `loadVariants()` und `useTacticsVersion()`.
 */
export const CORE_TACTICS: Tactic[] = [];
export const VARIANT_TACTICS: Tactic[] = [];
export const TACTIC_ISSUES: ValidationIssue[] = [];

for (const raw of rawTactics) {
  const id = (raw as { id?: string })?.id ?? 'unbenannt';
  const { tactic, issues } = validateTactic(raw, id);
  TACTIC_ISSUES.push(...issues);
  if (tactic) CORE_TACTICS.push(tactic);
}

/** Alle eingebauten Taktiken (Standard + nachgeladene Varianten). */
export const BASE_TACTICS: Tactic[] = [...CORE_TACTICS];

/* ---------- Nachladen der Varianten mit Abo für React ---------- */
let tacticsVersion = 0;
const listeners = new Set<() => void>();

export const getTacticsVersion = () => tacticsVersion;

export function subscribeTactics(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const VARIANTS_LOADED = { value: false };

/** Validiert und hängt die Varianten an. Fehlerhafte Einträge werden einzeln verworfen. */
export function addVariantTactics(rawList: unknown[]): number {
  let added = 0;
  for (const raw of rawList) {
    const id = (raw as { id?: string })?.id ?? 'unbenannt';
    const { tactic, issues } = validateTactic(raw, id);
    TACTIC_ISSUES.push(...issues);
    if (!tactic) continue;
    if (BASE_TACTICS.some((t) => t.id === tactic.id)) continue;
    VARIANT_TACTICS.push(tactic);
    BASE_TACTICS.push(tactic);
    added += 1;
  }
  VARIANTS_LOADED.value = true;
  tacticsVersion += 1;
  listeners.forEach((fn) => fn());
  return added;
}

/** Wird vom Store beim App-Start aufgerufen (eigener Chunk, blockiert nichts). */
export async function loadVariants(): Promise<number> {
  if (VARIANTS_LOADED.value) return 0;
  try {
    const mod = await import('../data/tactics/variants.json');
    const list = (mod.default ?? mod) as unknown[];
    return addVariantTactics(Array.isArray(list) ? list : []);
  } catch (err) {
    console.warn('Varianten konnten nicht geladen werden – Standardpläne bleiben verfügbar.', err);
    VARIANTS_LOADED.value = true;
    tacticsVersion += 1;
    listeners.forEach((fn) => fn());
    return 0;
  }
}

/** Nur die Standardpläne – für Abdeckungs-Aussagen („jede Site hat einen Plan“). */
export const DEFAULT_TACTICS: Tactic[] = CORE_TACTICS;

/** Anzahl der Taktiken, die wegen Fehlern nicht geladen werden konnten (Basis + Varianten). */
export const DROPPED_TACTICS = { basis: rawTactics.length - CORE_TACTICS.length, varianten: 0 };

export function issueSummary() {
  const summary = summarizeIssues(TACTIC_ISSUES);
  return { errors: summary.errors.length, warnings: summary.warnings.length, ok: summary.ok };
}

export function getMap(slug: string): MapInfo | undefined {
  return MAPS.find((m) => m.slug === slug);
}

export function getOperator(slug: string): Operator | undefined {
  return OPERATORS.find((o) => o.slug === slug);
}

/** Anzahl Standardpläne vs. Varianten für eine Site. */
export function countsFor(mapSlug: string, siteId: string, side: 'attack' | 'defense', user: Tactic[] = []) {
  const list = tacticsFor(mapSlug, siteId, side, user);
  return { total: list.length, core: list.filter((t) => !t.derivedFrom).length, variants: list.filter((t) => t.derivedFrom).length };
}

export function getSite(mapSlug: string, siteId: string) {
  return getMap(mapSlug)?.bombSites.find((s) => s.id === siteId);
}

/** Liefert für Map+Site+Seite alle Taktiken (Basis + eigene), sortiert. */
export function tacticsFor(mapSlug: string, siteId: string, side: 'attack' | 'defense', user: Tactic[] = []): Tactic[] {
  const all = [...user, ...BASE_TACTICS];
  const order = { standard: 0, aggressiv: 1, defensiv: 2, 'anti-ban': 3 } as const;
  const rank = (t: Tactic) => (t.derivedFrom ? (order[t.style] ?? 9) + 10 : order[t.style] ?? 9);
  return all
    .filter((t) => t.map === mapSlug && t.site === siteId && t.side === side)
    .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'de'));
}

/* -------------------------------------------------------------------------- */
/* Ban-Engine                                                                  */
/* -------------------------------------------------------------------------- */

const ROLE_ALIASES: Record<string, string> = {
  'Flex-Anchor': 'Anchor',
  'Deep-Roamer': 'Roamer',
  'Support-Roamer': 'Roamer',
  'Utility-Support': 'Support',
  'Hard-Breach': 'Hard-Breach',
  'Soft-Breach': 'Soft-Breach',
  'Flank-Watch': 'Flank-Watch',
};

function normalizedRole(role: string): string {
  return ROLE_ALIASES[role] || role;
}

/** Kandidaten aus dem Ersatzpick-Pool, gefiltert nach Ban und bereits vergebenen Operatoren. */
export function availableSubstitutes(tactic: Tactic, banned: string[], taken: string[]): Substitute[] {
  return tactic.substitutes.filter((s) => !banned.includes(s.operator) && !taken.includes(s.operator));
}

export interface AdjustedSlot extends PlayerSlot {
  replaced?: { banned: string; substitute: Substitute };
  warning?: string;
}

export interface AdjustmentResult {
  slots: AdjustedSlot[];
  usedSubstitutes: { slot: number; banned: string; substitute: Substitute }[];
  unresolved: { slot: number; operator: string; reason: string }[];
  overlaps: string[];
}

/**
 * Wendet Bans auf eine Taktik an und schlägt Ersatzpicks vor.
 * Regel: Ein Ersatz darf nicht selbst gebannt oder bereits vergeben sein.
 */
export function adjustTacticForBans(tactic: Tactic, banned: string[]): AdjustmentResult {
  const slots: AdjustedSlot[] = [];
  const usedSubstitutes: AdjustmentResult['usedSubstitutes'] = [];
  const unresolved: AdjustmentResult['unresolved'] = [];
  const taken = new Set<string>(tactic.players.filter((p) => !banned.includes(p.operator)).map((p) => p.operator));

  for (const player of tactic.players) {
    if (!banned.includes(player.operator)) {
      slots.push({ ...player });
      continue;
    }
    const sub = availableSubstitutes(tactic, banned, Array.from(taken))[0];
    if (!sub) {
      unresolved.push({ slot: player.slot, operator: player.operator, reason: 'Kein freier Ersatzpick in der Taktik' });
      slots.push({ ...player, warning: `${player.operator} ist gebannt und es gibt keinen freien Ersatz.` });
      continue;
    }
    taken.add(sub.operator);
    usedSubstitutes.push({ slot: player.slot, banned: player.operator, substitute: sub });
    slots.push({
      ...player,
      operator: sub.operator,
      role: sub.role,
      replaced: { banned: player.operator, substitute: sub },
    });
  }

  // Doppelte Operatoren innerhalb des Teams dürfen nie entstehen.
  const seen = new Set<string>();
  const overlaps: string[] = [];
  for (const s of slots) {
    if (seen.has(s.operator)) overlaps.push(s.operator);
    seen.add(s.operator);
  }

  return { slots, usedSubstitutes, unresolved, overlaps };
}

/** Wählt für eine Position den ersten freien Operator mit gleicher Rolle. */
export function fallbackOperators(tactic: Tactic, banned: string[]): { operator: string; role: string; reason: string }[] {
  const used = new Set(tactic.players.filter((p) => !banned.includes(p.operator)).map((p) => p.operator));
  const neededRoles = tactic.players.filter((p) => banned.includes(p.operator)).map((p) => normalizedRole(p.role));
  const result: { operator: string; role: string; reason: string }[] = [];
  for (const role of neededRoles) {
    const candidate = OPERATORS.find(
      (o) => o.role === tactic.side && !banned.includes(o.slug) && !used.has(o.slug) &&
        o.tags.some((t) => role.toLowerCase().includes(t.toLowerCase())) &&
        !result.some((r) => r.operator === o.slug),
    ) || OPERATORS.find((o) => o.role === tactic.side && !banned.includes(o.slug) && !used.has(o.slug) &&
        !result.some((r) => r.operator === o.slug));
    if (candidate) {
      result.push({ operator: candidate.slug, role, reason: `${candidate.name} übernimmt die Rolle ${role}${candidate.tags.length ? ` (${candidate.tags.join(', ')})` : ''}.` });
    }
  }
  return result;
}

#!/usr/bin/env node
/**
 * Daten-Validator für das R6 Tactical Playbook.
 *
 * Prüft ohne Browser:
 *   1. Karten-JSON (maps-a/maps-b): Pflichtfelder, Floors, BombSites, Spawns, Landmarks
 *   2. Operator-JSON: Pflichtfelder, Seiten, Icons vorhanden
 *   3. Taktiken: Schema, 5 Spieler, keine doppelten Operatoren, Operator-Seite,
 *      Marker-Bereiche, Attack-/Defense-Plan, Ersatzpicks, Datumsformat
 *   4. Metadaten: Pools, Versionen, Quellen
 *   5. Assets: für jede Karte existiert floor-<etage>.webp + keyart
 *
 * Exit-Code 1 bei Fehlern (CI bricht ab), Warnungen brechen nicht ab.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const readJson = (rel) => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));

/* ------------------------------------------------------------------ Karten */
const maps = [...readJson('src/data/maps/maps-a.json'), ...readJson('src/data/maps/maps-b.json')];
const FLOORS = new Set(['B', '1F', '2F', '3F']);
const mapBySlug = new Map();

for (const m of maps) {
  const where = `map ${m.slug}`;
  if (!m.slug || !m.name) err(`${where}: slug/name fehlt`);
  if (mapBySlug.has(m.slug)) err(`${where}: doppelter Slug`);
  mapBySlug.set(m.slug, m);
  if (!Array.isArray(m.floors) || m.floors.length === 0) err(`${where}: floors fehlen`);
  else m.floors.forEach((f) => { if (!FLOORS.has(f)) err(`${where}: ungültige Etage "${f}"`); });
  if (!Array.isArray(m.bombSites) || m.bombSites.length < 2) err(`${where}: <2 BombSites`);
  (m.bombSites ?? []).forEach((s) => {
    if (!s.id || !s.name || !s.short) err(`${where}/${s.id}: Site unvollständig`);
    (s.floors ?? []).forEach((f) => {
      if (!FLOORS.has(f)) err(`${where}/${s.id}: unbekannte Etage "${f}"`);
      if (!m.floors.includes(f)) err(`${where}/${s.id}: Etage ${f} nicht in map.floors`);
    });
  });
  if (!Array.isArray(m.spawns) || m.spawns.length === 0) err(`${where}: spawns fehlen`);
  (m.spawns ?? []).forEach((s) => {
    if (typeof s.name !== 'string' || !FLOORS.has(s.floor)) err(`${where}: Spawn objektform erwartet {name,floor,x,y}`);
    if (typeof s.x !== 'number' || typeof s.y !== 'number') err(`${where}: Spawn ${s.name} ohne Koordinaten`);
  });
  (m.landmarks ?? []).forEach((l) => {
    if (typeof l.x !== 'number' || typeof l.y !== 'number') err(`${where}: Landmark ${l.id} ohne Koordinaten`);
    if (!FLOORS.has(l.floor)) err(`${where}: Landmark ${l.id} mit Etage ${l.floor}`);
  });
  if (!m.updated || !/^\d{4}-\d{2}-\d{2}$/.test(m.updated)) err(`${where}: updated fehlt/falsch`);
  // Assets
  for (const f of m.floors) {
    const p = join(ROOT, 'public/maps', m.slug, `floor-${f}.webp`);
    if (!existsSync(p)) err(`${where}: Blueprint fehlt (${p})`);
    else if (statSync(p).size < 20_000) warn(`${where}: Blueprint floor-${f} ungewöhnlich klein`);
  }
  const keyart = join(ROOT, 'public/maps', m.slug, 'keyart.jpg');
  if (!existsSync(keyart)) warn(`${where}: keyart.jpg fehlt`);
}

/* -------------------------------------------------------------- Operatoren */
const operators = readJson('src/data/operators/operators.json');
const opBySlug = new Map();
for (const o of operators) {
  if (!o.slug || !o.name) err(`operator: slug/name fehlt (${JSON.stringify(o).slice(0, 60)})`);
  if (opBySlug.has(o.slug)) err(`operator ${o.slug}: doppelt`);
  opBySlug.set(o.slug, o);
  if (o.role !== 'attack' && o.role !== 'defense') err(`operator ${o.slug}: role ${o.role}`);
  const icon = ['public/operators', `${o.slug}.svg`];
  const iconPng = ['public/operators', `${o.slug}.png`];
  if (!existsSync(join(ROOT, ...icon)) && !existsSync(join(ROOT, ...iconPng))) {
    warn(`operator ${o.slug}: kein Icon (App zeigt Initialen)`);
  }
}

/* ---------------------------------------------------------------- Taktiken */
const coreTactics = readJson('src/data/tactics/tactics.json');
const variantTactics = existsSync(join(ROOT, 'src/data/tactics/variants.json'))
  ? readJson('src/data/tactics/variants.json')
  : [];
const tactics = [...coreTactics, ...variantTactics];
const ROLES = new Set(['Anchor', 'Flex-Anchor', 'Roamer', 'Deep-Roamer', 'Support-Roamer', 'Utility-Support',
  'Hard-Breach', 'Soft-Breach', 'Entry', 'Support', 'Intel', 'Flank-Watch', 'Vertical']);
const OBJECTIVES = new Set(['anchor', 'roam', 'support', 'antiEntry', 'plantDenial', 'hardBreach', 'softBreach',
  'intel', 'flankWatch', 'vertical', 'entry', 'retake', 'postPlant', 'breach', 'utility']);
const KINDS = new Set(['position', 'gadget', 'angle', 'plant', 'spawn', 'rotation', 'breach']);
const STYLES = new Set(['standard', 'aggressiv', 'defensiv', 'anti-ban']);
const CONFIDENCE = new Set(['verifiziert', 'community', 'eigene-analyse']);

const ids = new Set();
const perMap = new Map();
const coreIds = new Set(coreTactics.map((t) => t.id));
for (const t of tactics) {
  const w = `tactic ${t.id}`;
  if (!t.id) { err('tactic ohne ID'); continue; }
  if (ids.has(t.id)) err(`${w}: doppelte ID`);
  ids.add(t.id);
  if (t.derivedFrom && !coreIds.has(t.derivedFrom)) err(`${w}: derivedFrom "${t.derivedFrom}" existiert nicht`);
  const map = mapBySlug.get(t.map);
  if (!map) { err(`${w}: unbekannte Karte "${t.map}"`); continue; }
  const site = map.bombSites.find((s) => s.id === t.site);
  if (!site) err(`${w}: unbekannte Bombsite "${t.site}"`);
  else if (!Array.isArray(site.floors) || site.floors.length === 0) err(`${w}: Bombsite "${t.site}" ohne floors`);
  else if (!site.floors.every((f) => map.floors.includes(f))) err(`${w}: Site-Etage außerhalb map.floors`);
  if (t.side !== 'attack' && t.side !== 'defense') err(`${w}: side "${t.side}"`);
  if (!STYLES.has(t.style)) err(`${w}: style "${t.style}"`);
  if (!CONFIDENCE.has(t.confidence)) err(`${w}: confidence "${t.confidence}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.updated ?? '')) err(`${w}: updated Format`);
  if (!t.summary || t.summary.length < 20) err(`${w}: summary zu kurz`);
  if (!t.ratings || typeof t.ratings.competitive !== 'number') err(`${w}: ratings fehlen`);
  else {
    if (t.ratings.competitive < 1 || t.ratings.competitive > 5) err(`${w}: competitive außerhalb 1–5`);
    for (const k of ['difficulty', 'utilityDependency', 'coordination']) {
      if (!['niedrig', 'mittel', 'hoch'].includes(t.ratings[k])) err(`${w}: ratings.${k}="${t.ratings[k]}"`);
    }
    if (!Array.isArray(t.ratings.strengths) || !t.ratings.strengths.length) warn(`${w}: keine Stärken`);
    if (!Array.isArray(t.ratings.weaknesses) || !t.ratings.weaknesses.length) warn(`${w}: keine Schwächen`);
  }

  if (!Array.isArray(t.players) || t.players.length !== 5) {
    err(`${w}: ${t.players?.length ?? 0} Spieler (5 erwartet)`);
  } else {
    const used = new Set();
    const slots = new Set();
    t.players.forEach((p, i) => {
      const pw = `${w} players[${i}]`;
      if (!Number.isInteger(p.slot) || p.slot < 1 || p.slot > 5) err(`${pw}: slot ${p.slot}`);
      if (slots.has(p.slot)) err(`${pw}: Slot ${p.slot} doppelt`);
      slots.add(p.slot);
      const op = opBySlug.get(p.operator);
      if (!op) err(`${pw}: Operator "${p.operator}" unbekannt`);
      else if (op.role !== t.side) err(`${pw}: ${p.operator} ist ${op.role}, Taktik ist ${t.side}`);
      if (used.has(p.operator)) err(`${pw}: Operator ${p.operator} doppelt im Lineup`);
      used.add(p.operator);
      if (!ROLES.has(p.role)) err(`${pw}: Rolle "${p.role}"`);
      if (!p.loadout || !p.loadout.primary) warn(`${pw}: Loadout unvollständig`);
      if (!Array.isArray(p.objectives) || p.objectives.some((o) => !OBJECTIVES.has(o))) err(`${pw}: objectives ungültig`);
      if (!Array.isArray(p.prep) || !p.prep.length) err(`${pw}: prep leer`);
      if (!Array.isArray(p.action) || !p.action.length) err(`${pw}: action leer`);
      if (/\bG36G\b/.test(JSON.stringify(p.loadout))) err(`${pw}: Tippfehler "G36G"`);
      const siteFloors = new Set(site?.floors ?? []);
      (p.markers ?? []).forEach((mk, k) => {
        const mw = `${pw}.markers[${k}]`;
        if (!FLOORS.has(mk.floor)) err(`${mw}: Etage ${mk.floor}`);
        if (!map.floors.includes(mk.floor)) err(`${mw}: Etage ${mk.floor} existiert auf ${t.map} nicht`);
        if (!KINDS.has(mk.kind)) err(`${mw}: kind ${mk.kind}`);
        if (typeof mk.x !== 'number' || mk.x < 0 || mk.x > 100) err(`${mw}: x ${mk.x}`);
        if (typeof mk.y !== 'number' || mk.y < 0 || mk.y > 100) err(`${mw}: y ${mk.y}`);
        if (!mk.label) warn(`${mw}: ohne Label`);
      });
    });
  }

  if (!Array.isArray(t.substitutes)) err(`${w}: substitutes fehlt`);
  else {
    if (t.substitutes.length < 3) warn(`${w}: nur ${t.substitutes.length} Ersatzpicks`);
    const lineup = new Set((t.players ?? []).map((p) => p.operator));
    t.substitutes.forEach((s, i) => {
      const sw = `${w} substitutes[${i}]`;
      const op = opBySlug.get(s.operator);
      if (!op) err(`${sw}: Operator ${s.operator} unbekannt`);
      else if (op.role !== t.side) err(`${sw}: ${s.operator} gehört zu ${op.role}`);
      if (lineup.has(s.operator)) err(`${sw}: ${s.operator} ist bereits im Lineup`);
      if (!opBySlug.has(s.for)) err(`${sw}: "for" ${s.for} unbekannt`);
      if (!s.reason || !s.setupChange || !s.weakness) warn(`${sw}: Begründung/Änderung/Schwäche unvollständig`);
    });
  }

  if (t.side === 'attack') {
    const ap = t.attackPlan;
    if (!ap) err(`${w}: attackPlan fehlt`);
    else {
      if (!FLOORS.has(ap.spawnFloor)) err(`${w}: spawnFloor`);
      if (typeof ap.spawnX !== 'number' || typeof ap.spawnY !== 'number') err(`${w}: Spawn-Koordinaten`);
      for (const k of ['entryRoute', 'drones', 'execute', 'postPlant']) {
        if (!Array.isArray(ap[k]) || !ap[k].length) err(`${w}: attackPlan.${k} fehlt/leer`);
      }
      if (!ap.plant || !FLOORS.has(ap.plant.floor)) err(`${w}: Plant-Etage`);
      if (!ap.alt || !ap.alt.spawn) err(`${w}: Alternativ-Spawn fehlt`);
    }
  } else if (!t.defensePlan || !Array.isArray(t.defensePlan.retake) || !t.defensePlan.retake.length) {
    err(`${w}: defensePlan.retake fehlt`);
  }

  const key = t.map;
  perMap.set(key, (perMap.get(key) ?? 0) + 1);
}

/* ------------------------------------------------------------------ Meta */
const meta = readJson('src/data/metadata/meta.json');
for (const slug of meta.rankedPool) if (!mapBySlug.has(slug)) err(`meta.rankedPool: unbekannte Karte "${slug}"`);
for (const slug of meta.proPool) if (!mapBySlug.has(slug)) err(`meta.proPool: unbekannte Karte "${slug}"`);
for (const slug of meta.siegeCup?.maps ?? []) if (!mapBySlug.has(slug)) warn(`meta.siegeCup: Karte "${slug}" ohne Datensatz`);
if (!meta.lastUpdated || !/^\d{4}-\d{2}-\d{2}$/.test(meta.lastUpdated)) err('meta.lastUpdated fehlt');
if (!Array.isArray(meta.sources) || !meta.sources.length) err('meta.sources fehlt');
const missingMaps = [...mapBySlug.keys()].filter((s) => !perMap.has(s));
if (missingMaps.length) warn(`Karten ohne Taktik: ${missingMaps.join(', ')}`);

/* --------------------------------------------------------------- Ausgabe */
const coreCount = coreTactics.length;
const variantCount = tactics.length - coreCount;
const styles = coreTactics.reduce((acc, t) => { acc[t.side] = (acc[t.side] ?? 0) + 1; return acc; }, {});
console.log(`Karten: ${maps.length} · Operatoren: ${operators.length} · Taktiken: ${tactics.length}`);
console.log(`  davon ${coreCount} Standard (${styles.defense ?? 0} Verteidigung / ${styles.attack ?? 0} Angriff) + ${variantCount} Varianten`);
console.log(`Taktiken pro Karte: ${[...perMap.entries()].map(([k, v]) => `${k}:${v}`).join(' ')}`);
for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✖ ${e}`);
console.log(errors.length ? `\n${errors.length} Fehler, ${warnings.length} Warnungen` : `\n✓ Alle Prüfungen bestanden (${warnings.length} Warnungen)`);
process.exit(errors.length ? 1 : 0);

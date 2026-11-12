#!/usr/bin/env node
/**
 * build-tactics.mjs
 * ------------------------------------------------------------------
 * Wandelt die kompakten, handgeschriebenen Site-Pläne aus
 * scripts/plans/*.mjs in vollständige Taktik-JSONs um.
 *
 * Ausgabe: src/data/tactics/tactics.json   (wird von der App geladen)
 *
 * Wichtig: Die JSON-Datei ist die *editierbare* Datenquelle der App.
 * Wer Taktiken im Editor erstellt, speichert sie im Browser (localStorage)
 * bzw. exportiert sie als JSON. Wer die Basis-Taktiken dauerhaft ändern
 * will, kann entweder direkt tactics.json bearbeiten (dann den Generator
 * nicht mehr laufen lassen) oder die Pläne hier anpassen und neu bauen.
 *
 * Aufruf:  npm run tactics:build
 * ------------------------------------------------------------------
 */
import { writeFile, readFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLANS_DIR = join(ROOT, 'scripts/plans');
const OUT = join(ROOT, 'src/data/tactics/tactics.json');
const UPDATED = '2026-11-11';

const maps = [
  ...JSON.parse(await readFile(join(ROOT, 'src/data/maps/maps-a.json'), 'utf8')),
  ...JSON.parse(await readFile(join(ROOT, 'src/data/maps/maps-b.json'), 'utf8')),
];

function markerToObject(m) {
  if (Array.isArray(m)) {
    const [floor, x, y, kind, label, toX, toY, toFloor] = m;
    const o = { floor, x, y, kind: kind || 'position', label };
    if (toX !== undefined && toY !== undefined) {
      o.toX = toX;
      o.toY = toY;
      o.toFloor = toFloor || floor;
    }
    return o;
  }
  return m;
}

function buildPlayer(p, plan, idx) {
  const markers = (p.m || []).map(markerToObject);
  return {
    slot: idx + 1,
    playerName: `Spieler ${idx + 1}`,
    operator: p.op,
    role: p.role,
    tagline: p.task,
    pickReason: p.why,
    keyAbility: p.ab,
    loadout: p.load,
    objectives: p.obj,
    prep: p.prep,
    action: p.act,
    markers,
  };
}

function buildTactic(plan) {
  const map = maps.find((m) => m.slug === plan.map);
  if (!map) throw new Error(`Unbekannte Map: ${plan.map}`);
  const site = map.bombSites.find((s) => s.id === plan.site);
  if (!site) throw new Error(`Unbekannte Site ${plan.site} auf ${plan.map}`);

  const base = {
    id: plan.id,
    map: plan.map,
    site: plan.site,
    side: plan.side,
    name: plan.name,
    style: plan.style,
    summary: plan.summary,
    confidence: plan.confidence,
    updated: plan.updated || UPDATED,
    ratings: {
      competitive: plan.ratings.c,
      difficulty: plan.ratings.d,
      utilityDependency: plan.ratings.u,
      coordination: plan.ratings.k,
      strengths: plan.ratings.s,
      weaknesses: plan.ratings.w,
    },
    players: plan.players.map((p, i) => buildPlayer(p, plan, i)),
    substitutes: plan.subs.map((s) => ({
      operator: s.op,
      for: s.for,
      role: s.role,
      reason: s.reason,
      takesOver: s.takes,
      setupChange: s.change,
      weakness: s.weak,
    })),
  };

  if (plan.side === 'attack') {
    base.attackPlan = {
      spawn: plan.attack.spawn,
      spawnFloor: plan.attack.spawnFloor,
      spawnX: plan.attack.spawnX,
      spawnY: plan.attack.spawnY,
      entryRoute: plan.attack.entryRoute,
      drones: plan.attack.drones,
      execute: plan.attack.execute,
      plant: plan.attack.plant,
      postPlant: plan.attack.postPlant,
      alt: plan.attack.alt,
    };
  } else {
    base.defensePlan = {
      retake: plan.def.retake,
      roamPlan: plan.def.roam,
    };
  }
  if (plan.notes) base.notes = plan.notes;
  return base;
}

const files = (await readdir(PLANS_DIR)).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).sort();
const all = [];
for (const f of files) {
  const mod = await import(pathToFileURL(join(PLANS_DIR, f)).href);
  const plans = mod.default;
  if (!Array.isArray(plans)) {
    if (f.startsWith('_')) continue;
    throw new Error(`${f} exportiert kein Array als default`);
  }
  for (const p of plans) all.push(buildTactic(p));
  console.log(`✓ ${f}: ${plans.length} Pläne`);
}

// Duplikate prüfen
const ids = new Set();
for (const t of all) {
  if (ids.has(t.id)) throw new Error(`Doppelte Taktik-ID: ${t.id}`);
  ids.add(t.id);
}

// Operator-Duplikate pro Taktik prüfen
const opData = JSON.parse(await readFile(join(ROOT, 'src/data/operators/operators.json'), 'utf8'));
const known = new Set(opData.map((o) => o.slug));
for (const t of all) {
  const ops = t.players.map((p) => p.operator);
  if (new Set(ops).size !== 5) throw new Error(`${t.id}: Operator doppelt vergeben`);
  for (const o of ops) if (!known.has(o)) throw new Error(`${t.id}: unbekannter Operator "${o}"`);
  for (const o of ops) {
    const d = opData.find((x) => x.slug === o);
    if (d.role !== t.side) throw new Error(`${t.id}: ${o} ist ${d.role}, Taktik ist ${t.side}`);
  }
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(all, null, 2) + '\n');
const def = all.filter((t) => t.side === 'defense').length;
console.log(`\ntactics.json geschrieben: ${all.length} Taktiken (${def} Verteidigung / ${all.length - def} Angriff)`);
console.log(`Maps abgedeckt: ${new Set(all.map((t) => t.map)).size}/${maps.length}`);

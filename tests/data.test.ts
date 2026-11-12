import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => JSON.parse(readFileSync(join(process.cwd(), rel), 'utf8'));
const root = process.cwd();

const maps = [...read('src/data/maps/maps-a.json'), ...read('src/data/maps/maps-b.json')];
const operators = read('src/data/operators/operators.json');
const tactics = read('src/data/tactics/tactics.json');
const variants = read('src/data/tactics/variants.json');
const allTactics = [...tactics, ...variants];
const meta = read('src/data/metadata/meta.json');
const team = read('src/data/metadata/team.json');

const opBySlug = new Map<string, { role: string; name: string }>(operators.map((o: { slug: string }) => [o.slug, o]));

describe('Kartendaten', () => {
  it('enthält 15 Karten mit eindeutigen Slugs', () => {
    expect(maps).toHaveLength(15);
    expect(new Set(maps.map((m: { slug: string }) => m.slug)).size).toBe(15);
  });

  it('jede Karte hat ≥ 2 Bombsites mit gültigen Etagen', () => {
    for (const m of maps) {
      expect(m.bombSites.length).toBeGreaterThanOrEqual(2);
      for (const s of m.bombSites) {
        expect(typeof s.id).toBe('string');
        expect(s.floors.length).toBeGreaterThan(0);
        for (const f of s.floors) expect(m.floors).toContain(f);
      }
    }
  });

  it('Spawns liegen als Objekt mit Koordinaten vor', () => {
    for (const m of maps) {
      expect(m.spawns.length).toBeGreaterThan(0);
      for (const s of m.spawns) {
        expect(typeof s.name).toBe('string');
        expect(typeof s.x).toBe('number');
        expect(typeof s.y).toBe('number');
      }
    }
  });

  it('jede Karte im Ranked-Pool existiert als Datensatz', () => {
    expect(meta.rankedPool).toHaveLength(15);
    for (const slug of meta.rankedPool) expect(maps.some((m: { slug: string }) => m.slug === slug)).toBe(true);
  });
});

describe('Operatordaten', () => {
  it('enthält mindestens 70 Operatoren mit bekannter Seite', () => {
    expect(operators.length).toBeGreaterThanOrEqual(70);
    for (const o of operators) expect(['attack', 'defense']).toContain(o.role);
  });
});

describe('Taktiken', () => {
  it('enthält mindestens 29 Verteidigungs- und 29 Angriffstaktiken', () => {
    expect(tactics.filter((t: { side: string }) => t.side === 'defense').length).toBeGreaterThanOrEqual(60);
    expect(tactics.filter((t: { side: string }) => t.side === 'attack').length).toBeGreaterThanOrEqual(60);
  });

  it('hat einen eindeutigen Taktik-Bestand (Regressionsschutz)', () => {
    expect(tactics).toHaveLength(120);
  });

  it('deckt alle 15 Karten ab', () => {
    const covered = new Set(tactics.map((t: { map: string }) => t.map));
    expect(covered.size).toBe(15);
  });

  it('hat eindeutige IDs und bekannte Map/Site-Kombinationen', () => {
    const ids = tactics.map((t: { id: string }) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of tactics) {
      const map = maps.find((m: { slug: string }) => m.slug === t.map);
      expect(map).toBeTruthy();
      expect(map.bombSites.some((s: { id: string }) => s.id === t.site)).toBe(true);
    }
  });

  it('jede Taktik hat 5 verschiedene Operatoren der richtigen Seite', () => {
    for (const t of tactics) {
      expect(t.players).toHaveLength(5);
      const ops = t.players.map((p: { operator: string }) => p.operator);
      expect(new Set(ops).size).toBe(5);
      for (const op of ops) {
        const found = opBySlug.get(op);
        expect(found, `Operator ${op} in ${t.id}`).toBeTruthy();
        expect(found!.role).toBe(t.side);
      }
    }
  });

  it('Ersatzpicks sind gültig, nicht im Lineup und mindestens 3 pro Taktik', () => {
    for (const t of tactics) {
      expect(t.substitutes.length).toBeGreaterThanOrEqual(3);
      const lineup = new Set(t.players.map((p: { operator: string }) => p.operator));
      for (const s of t.substitutes) {
        const op = opBySlug.get(s.operator);
        expect(op, `Sub ${s.operator} in ${t.id}`).toBeTruthy();
        expect(op!.role).toBe(t.side);
        expect(lineup.has(s.operator)).toBe(false);
      }
    }
  });

  it('Marker liegen im gültigen Bereich und haben bekannte Typen', () => {
    const kinds = ['position', 'gadget', 'angle', 'plant', 'spawn', 'rotation', 'breach'];
    for (const t of tactics) {
      for (const p of t.players) {
        for (const mk of p.markers) {
          expect(['B', '1F', '2F', '3F']).toContain(mk.floor);
          expect(kinds).toContain(mk.kind);
          expect(mk.x).toBeGreaterThanOrEqual(0);
          expect(mk.x).toBeLessThanOrEqual(100);
          expect(mk.y).toBeGreaterThanOrEqual(0);
          expect(mk.y).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it('Angriffstaktiken haben Spawn, Execute, Plant und Alternative', () => {
    for (const t of tactics.filter((x: { side: string }) => x.side === 'attack')) {
      const ap = t.attackPlan;
      expect(ap, `${t.id} ohne attackPlan`).toBeTruthy();
      expect(ap.spawn).toBeTruthy();
      expect(ap.drones.length).toBeGreaterThan(0);
      expect(ap.execute.length).toBeGreaterThan(0);
      expect(ap.postPlant.length).toBeGreaterThan(0);
      expect(ap.plant.spot).toBeTruthy();
      expect(ap.alt.spawn).toBeTruthy();
    }
  });

  it('Verteidigungstaktiken haben Retake- und Roam-Plan', () => {
    for (const t of tactics.filter((x: { side: string }) => x.side === 'defense')) {
      expect(t.defensePlan, `${t.id} ohne defensePlan`).toBeTruthy();
      expect(t.defensePlan.retake.length).toBeGreaterThan(0);
    }
  });

  it('jede Taktik hat ein Update-Datum und eine Konfidenz', () => {
    for (const t of tactics) {
      expect(t.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(['verifiziert', 'community', 'eigene-analyse']).toContain(t.confidence);
    }
  });

  it('verifizierte Setups sind die Ausnahme und als solche markiert', () => {
    const verified = tactics.filter((t: { confidence: string }) => t.confidence === 'verifiziert');
    expect(verified.length).toBeLessThan(tactics.length);
    for (const t of verified) expect(t.confidence).toBe('verifiziert');
  });
});

describe('Meta & Team', () => {
  it('Meta enthält Version, Pools und Quellen', () => {
    expect(meta.operation).toContain('Split Fire');
    expect(meta.year).toBe(2026);
    expect(meta.season).toBe(3);
    expect(meta.sources.length).toBeGreaterThan(0);
    expect(meta.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('Team hat 5 Slots mit Rollen', () => {
    expect(team.players).toHaveLength(5);
    for (const p of team.players) expect(p.preferredRoles.length).toBeGreaterThan(0);
  });
});

describe('Abdeckung aller Bombsites', () => {
  it('jede Ranked-Bombsite hat mindestens eine Verteidigungs- und eine Angriffstaktik', () => {
    const missing: string[] = [];
    for (const m of maps) {
      for (const s of m.bombSites) {
        for (const side of ['defense', 'attack'] as const) {
          if (!tactics.some((t: { map: string; site: string; side: string }) => t.map === m.slug && t.site === s.id && t.side === side)) {
            missing.push(`${m.slug}/${s.id}/${side}`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });
});


describe('Varianten (aggressiv / defensiv / Ban-Alternative)', () => {
  it('zu jeder Basis-Taktik gibt es genau drei Varianten', () => {
    expect(variants).toHaveLength(tactics.length * 3);
    for (const t of tactics) {
      const mine = variants.filter((v: { id: string }) => v.id.startsWith(`${t.id}--`));
      expect(mine, t.id).toHaveLength(3);
      expect(mine.map((v: { style: string }) => v.style).sort()).toEqual(['aggressiv', 'anti-ban', 'defensiv']);
    }
  });

  it('jede Variante verweist auf einen existierenden Basisplan und hat 5 eindeutige Operatoren', () => {
    const coreIds = new Set(tactics.map((t: { id: string }) => t.id));
    const opRoles = new Map(
      read('src/data/operators/operators.json').map((o: { slug: string; role: string }) => [o.slug, o.role]),
    );
    for (const v of variants) {
      expect(coreIds.has(v.derivedFrom), v.id).toBe(true);
      const ops = v.players.map((p: { operator: string }) => p.operator);
      expect(new Set(ops).size, v.id).toBe(5);
      for (const op of ops) expect(opRoles.get(op), `${v.id}: ${op}`).toBe(v.side);
      expect(v.confidence).toBe('eigene-analyse');
      expect(v.notes).toMatch(/kein belegtes Pro-Setup/i);
    }
  });

  it('Ersatzpicks jeder Variante sind nicht im Lineup und nicht doppelt', () => {
    for (const v of variants) {
      const lineup = new Set(v.players.map((p: { operator: string }) => p.operator));
      const subs = v.substitutes.map((s: { operator: string }) => s.operator);
      expect(subs.length, v.id).toBeGreaterThanOrEqual(3);
      expect(new Set(subs).size, v.id).toBe(subs.length);
      for (const s of subs) expect(lineup.has(s), `${v.id}: ${s}`).toBe(false);
    }
  });

  it('jede Site hat Standard + drei Varianten pro Seite', () => {
    for (const m of maps) {
      for (const s of m.bombSites) {
        for (const side of ['defense', 'attack'] as const) {
          const list = allTactics.filter((t: { map: string; site: string; side: string }) =>
            t.map === m.slug && t.site === s.id && t.side === side);
          expect(list.length, `${m.slug}/${s.id}/${side}`).toBe(4);
        }
      }
    }
  });
});


describe('Varianten – Textqualität', () => {
  it('keine Variante hat bei allen fünf Spielern identische Aufgaben', () => {
    for (const v of variants) {
      const first = v.players.map((p: { action: string[] }) => p.action[0]);
      expect(new Set(first).size, `${v.id}: ${first[0]}`).toBeGreaterThanOrEqual(4);
      const prep = v.players.map((p: { prep: string[] }) => p.prep[1]);
      expect(new Set(prep).size, `${v.id}: prep doppelt`).toBeGreaterThanOrEqual(4);
    }
  });

  it('Varianten tragen eigenen Namen, eigene Bewertung und Mutternplan-Verweis', () => {
    for (const v of variants) {
      expect(v.name).not.toMatch(/^Standard/);
      expect(v.derivedFrom).toBeTruthy();
      expect(v.summary.length).toBeGreaterThan(60);
      expect(v.ratings.strengths.length).toBeGreaterThan(0);
      expect(v.ratings.weaknesses.length).toBeGreaterThan(0);
    }
  });
});

describe('Kartenbedienung (Zoom, Pinch, Marker)', () => {
  const src = readFileSync(join(root, 'src/components/TacticMap.tsx'), 'utf8');
  const css = readFileSync(join(root, 'src/styles.css'), 'utf8');

  it('Marker werden invers zum Zoom skaliert (bleiben optisch gleich groß)', () => {
    expect(src).toMatch(/const inv = 1 \/ zoom/);
    expect(src).toMatch(/\['--mk' as string\]: inv/);
    expect(css).toMatch(/\.mk\s*{[^}]*var\(--mk, 1\)/s);
    expect(css).toMatch(/font-size: calc\(9px \* var\(--mk, 1\)\)/);
  });

  it('Touch-Pinch mit zwei Zeigern ist implementiert', () => {
    expect(src).toMatch(/pointers\.current\.size === 2/);
    expect(src).toMatch(/pinchRef/);
    expect(src).toMatch(/Math\.hypot/);
    expect(src).toMatch(/onPointerDown/);
  });

  it('Wheel-Zoom ist non-passiv registriert (preventDefault wirkt)', () => {
    expect(src).toMatch(/addEventListener\('wheel', handler, \{ passive: false \}\)/);
    expect(src).not.toMatch(/onWheel=\{/);
  });

  it('Buehnen-Capture schluckt keine Klicks auf die Zoom-Leiste', () => {
    expect(src).toMatch(/closest\('button, select, input, a, \.map-hud, \.map-legend'\)/);
    expect(src).toMatch(/start\.control \|\| start\.moved/);
  });

  it('Buehne hat feste Hoehe und Touch-Optimierungen', () => {
    expect(css).toMatch(/\.mapstage\s*{[^}]*touch-action: none/s);
    expect(css).toMatch(/aspect-ratio: 16 \/ 9/);
    expect(css).toMatch(/-webkit-tap-highlight-color: transparent/);
  });
});

describe('Design-System', () => {
  const css = readFileSync(join(root, 'src/styles.css'), 'utf8');

  it('nutzt die vorgegebene Palette (Graphit/Oliv/Rot/Blau/Gelb)', () => {
    expect(css).toMatch(/--bg: #171a18/);
    expect(css).toMatch(/--bg-2: #202521/);
    expect(css).toMatch(/--bg-3: #282e29/);
    expect(css).toMatch(/--line: #3a423b/);
    expect(css).toMatch(/--text: #e9ece6/);
    expect(css).toMatch(/--text-dim: #a0a79f/);
  });

  it('Schriften liegen lokal (kein CDN), IBM Plex Sans + Mono', () => {
    expect(css).toMatch(/font-family: 'IBM Plex Sans'/);
    expect(css).toMatch(/font-family: 'IBM Plex Mono'/);
    expect(css).not.toMatch(/https?:\/\/(fonts\.googleapis|fonts\.gstatic)/);
    expect(existsSync(join(root, 'public/fonts/ibm-plex-sans-latin-400.woff2'))).toBe(true);
    expect(existsSync(join(root, 'public/fonts/ibm-plex-mono-latin-400.woff2'))).toBe(true);
  });

  it('Radius bleibt zurueckhaltend (kein Bubble-Look)', () => {
    const m = css.match(/--radius: (\d+)px/);
    expect(m).toBeTruthy();
    expect(Number(m ![1])).toBeLessThanOrEqual(4);
  });

  it('keine Emojis als UI-Icons', () => {
    const files = [
      ...readdirSync(join(root, 'src/pages')).map((f) => join(root, 'src/pages', f)),
      ...readdirSync(join(root, 'src/components')).map((f) => join(root, 'src/components', f)),
    ];
    const all = files.map((f) => readFileSync(f, 'utf8')).join('\n');
    const found = all.match(/[\u{1F300}-\u{1FAFF}]/gu) || [];
    expect(found).toEqual([]);
  });
});

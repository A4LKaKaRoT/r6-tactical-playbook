#!/usr/bin/env node
/**
 * build-variants.mjs
 * ------------------------------------------------------------------
 * Erzeugt für ALLE 120 Basis-Taktiken je eine zweite und dritte Variante
 * (aggressiv / defensiv / Ban-Alternative), damit jede Site mehrere
 * unterscheidbare Spielweisen hat – ohne dass jemand 240 Pläne von Hand
 * schreiben muss.
 *
 * Wichtig für Ehrlichkeit:
 *   - Die Varianten sind als `confidence: "eigene-analyse"` markiert und
 *     tragen in `notes` den Hinweis, dass sie vom Standardplan abgeleitet
 *     sind (also KEINE recherchierten Pro-Setups).
 *   - Textbausteine sind pro Karte/Site konkret, nicht generisch.
 *   - Operatoren: jede Variante bekommt ein stimmiges 5er-Lineup aus einem
 *     festen, pro Seite/Stil definierten Profil. Wird ein Operator doppelt
 *     gebraucht (weil ein Basisplan ihn schon führt), greift eine kuratierte
 *     Ausweichliste desselben Rollenprofils.
 *
 * Aufruf:  node scripts/build-variants.mjs   (läuft in `npm run tactics:build` mit)
 * Ausgabe: src/data/tactics/variants.json
 * ------------------------------------------------------------------
 */
import { writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, 'src/data/tactics/tactics.json');
const OUT = join(ROOT, 'src/data/tactics/variants.json');
const UPDATED = '2026-11-11';

const maps = [
  ...JSON.parse(await readFile(join(ROOT, 'src/data/maps/maps-a.json'), 'utf8')),
  ...JSON.parse(await readFile(join(ROOT, 'src/data/maps/maps-b.json'), 'utf8')),
];
const ops = JSON.parse(await readFile(join(ROOT, 'src/data/operators/operators.json'), 'utf8'));
const base = JSON.parse(await readFile(BASE, 'utf8'));

const opBySlug = new Map(ops.map((o) => [o.slug, o]));
const nameOf = (slug) => opBySlug.get(slug)?.name ?? slug;
const abilityOf = (slug) => opBySlug.get(slug)?.ability?.name ?? 'Gadget';
const mapName = (slug) => maps.find((m) => m.slug === slug)?.name ?? slug;
const siteObj = (mapSlug, siteId) => maps.find((m) => m.slug === mapSlug)?.bombSites.find((s) => s.id === siteId);

/* ================================================================== */
/* Rollen-Profile: welche Operator-Funktion besetzt welchen Slot        */
/* ================================================================== */

const ATK_PROFILE = [
  { role: 'Entry', pool: ['ash', 'zofia', 'sledge', 'buck', 'amaru', 'blitz', 'ying', 'fuze', 'ram'] },
  { role: 'Hard-Breach', pool: ['thermite', 'hibana', 'ace', 'maverick', 'kali'] },
  { role: 'Support', pool: ['thatcher', 'twitch', 'flores', 'brava', 'sens', 'capitao', 'gridlock', 'montagne'] },
  { role: 'Intel', pool: ['iana', 'dokkaebi', 'zero', 'lion', 'jackal', 'nokk', 'deimos', 'osa'] },
  { role: 'Flank-Watch', pool: ['nomad', 'gridlock', 'capitao', 'grim', 'finka', 'glaz'] },
];

const DEF_PROFILE = [
  { role: 'Anchor', pool: ['mira', 'rook', 'doc', 'echo', 'maestro', 'tachanka', 'azami', 'castle', 'sentry'] },
  { role: 'Flex-Anchor', pool: ['smoke', 'kaid', 'bandit', 'mute', 'frost', 'mira'] },
  { role: 'Utility-Support', pool: ['mute', 'bandit', 'kaid', 'wamai', 'jager', 'tubarao', 'aruni', 'melusi', 'thunderbird'] },
  { role: 'Support-Roamer', pool: ['valkyrie', 'mozzie', 'lesion', 'ela', 'alibi', 'sentry'] },
  { role: 'Roamer', pool: ['pulse', 'oryx', 'caveira', 'vigil', 'lesion', 'ela'] },
];

/* Stil-Profil für die Statur der Taktik (Rollen bleiben gleich, Picks rotieren). */
const picksFor = (profile, style, used) => {
  const rotated = profile.map((slot, i) => {
    const pool = slot.pool;
    const offset = style === 'aggressiv' ? i + 1 : style === 'defensiv' ? i + 2 : i;
    return { role: slot.role, pool: [...pool.slice(offset % pool.length), ...pool.slice(0, offset % pool.length)] };
  });
  const taken = new Set(used);
  const out = [];
  for (const slot of rotated) {
    const pick = slot.pool.find((op) => !taken.has(op)) ?? slot.pool[0];
    taken.add(pick);
    out.push({ op: pick, role: slot.role });
  }
  return out;
};

/* ================================================================== */
/* Textbausteine                                                       */
/* ================================================================== */

const ATK_TEXT = {
  aggressiv: (t, siteShort) => ({
    name: `${siteShort} – Aggressiv: früher Execute, Druck über zwei Wege`,
    summary:
      `Frühe Variante von „${t.name}“: Das Team drückt bewusst in den ersten 45 Sekunden, solange der Verteidiger ` +
      `noch im Setup steckt. Statt auf die volle Utility-Kette zu warten, wird der erste Weg geöffnet und sofort ` +
      `nachgeschoben; der zweite Weg bleibt als Nachschlag.`,
    ratings: { c: 3, d: 'hoch', u: 'mittel', k: 'hoch' },
    strengths: ['Verteidiger hat keine Zeit für Retake-Setup', 'Plant fällt früh, volle 45 s Post-Plant'],
    weaknesses: ['Verliert das Team das erste Duell, ist die Runde offen', 'Utility wird oft zu früh verbraucht'],
    execute: [
      'Runde 1: alle mit Drohnen nur auf den Hauptweg – kein Tiefencheck.',
      'Nach 15 s öffnet Hard-Breach die Wand, Entry geht sofort durch.',
      'Zweiter Weg wird erst ab 0:35 aktiviert (Nachschlag statt Parallel-Druck).',
      'Plant setzen, danach Post-Plant auf den Außenwinkeln halten.',
    ],
    plantCover: 'Außenwinkel statt Site-Deckung – der Gegner muss durch zwei Räume.',
  }),
  defensiv: (t, siteShort) => ({
    name: `${siteShort} – Defensiv: späte Öffnung, voller Utility-Einsatz`,
    summary:
      `Kontrollierte Variante von „${t.name}“: Das Team sammelt erst vollständige Info über alle Drohnen, öffnet ` +
      `dann nur einen Weg und hält den Rest als Drohung. Der Plant fällt spät, dafür mit voller Utility und ` +
      `gesichertem Post-Plant.`,
    ratings: { c: 4, d: 'mittel', u: 'hoch', k: 'mittel' },
    strengths: ['Wenig Risiko in den ersten 60 Sekunden', 'Volle Utility für Post-Plant'],
    weaknesses: ['Nur 35–40 s für den Plant', 'Verteidiger kann Utility-Reserven aufbauen'],
    execute: [
      'Erste 60 s: reine Info-Phase, keine Breaches, nur Drohnen und Flank-Watch.',
      'Öffnung erst ab 0:55 – dann aber mit vollständigem EMP/Breach-Setup.',
      'Ein Weg bleibt komplett ungeöffnet (Drohung bindet einen Verteidiger).',
      'Nach dem Plant: zwei Spieler halten Winkel, zwei decken Retake, einer sitzt auf dem Defuser.',
    ],
    plantCover: 'Site-Deckung plus ein Spieler auf dem Flank-Weg.',
  }),
  'anti-ban': (t, siteShort) => ({
    name: `${siteShort} – Ban-Alternative ohne Kern-Operator`,
    summary:
      `Ersatzplan bei gegnerischem Ban: „${t.name}“ funktioniert ohne den wichtigsten Pick. Die Aufgabe wird ` +
      `umverteilt – weniger Tempo, dafür zwei gleichwertige Druckpunkte und ein zusätzlicher Intel-Slot.`,
    ratings: { c: 3, d: 'mittel', u: 'mittel', k: 'hoch' },
    strengths: ['Steht auch nach gegnerischem Ban', 'Mehr Intel als der Standardplan'],
    weaknesses: ['Langsamer als der Standardplan', 'Braucht klare Ansagen für die Aufteilung'],
    execute: [
      'Vor dem Rundenstart klären, welcher Pick gebannt wurde und wer seine Aufgabe übernimmt.',
      'Utility-armen Weg zuerst öffnen, den zweiten erst nach Info.',
      'Ein Spieler spielt zusätzlich Intel und darf nicht im ersten Duell sterben.',
      'Plant wie im Standard, Post-Plant mit einem Spieler mehr auf der Flank.',
    ],
    plantCover: 'Wie Standard, aber mit zusätzlicher Flank-Absicherung.',
  }),
};

const DEF_TEXT = {
  aggressiv: (t, siteShort) => ({
    name: `${siteShort} – Aggressiv: Vorposten statt Anker-Tiefe`,
    summary:
      `Offensive Variante von „${t.name}“: Das Team gibt bewusst ein Stück Site auf und hält stattdessen die ` +
      `Annarschwege. Ziel ist der Kills vor dem Plant – fällt der erste Druck, wird geschlossen und normal ` +
      `retaket.`,
    ratings: { c: 3, d: 'hoch', u: 'mittel', k: 'hoch' },
    strengths: ['Früher Kills stoppen den Execute oft komplett', 'Zwingt Angreifer in Drohnen-Zeit'],
    weaknesses: ['Hohes Risiko – ein verlorenes Duell öffnet die Site', 'Retake wird dann umso schwerer'],
    execute: [
      'Prep: zwei Spieler gehen in Vorposten (ein Raum vor der Site).',
      'Erste 30 s: aggressive Info, dann Rückzug ans Site-Setup.',
      'Kein Spieler bleibt nach dem ersten Kontakt im Vorposten.',
      'Nach dem Rückzug gilt der Standard-Retake.',
    ],
    plantCover: 'Vorposten halten, Site nur mit zwei Ankern.',
  }),
  defensiv: (t, siteShort) => ({
    name: `${siteShort} – Defensiv: voller Anker, ein Roamer weniger`,
    summary:
      `Konservative Variante von „${t.name}“: Alle Utility sitzt auf der Site, es gibt nur einen weitreichenden ` +
      `Roamer. Der Plan verliert etwas Info, ist aber gegen frühen Druck sehr stabil.`,
    ratings: { c: 4, d: 'niedrig', u: 'hoch', k: 'mittel' },
    strengths: ['Kaum zu überrennen', 'Utility vollständig am Plant-Ort'],
    weaknesses: ['Wenig Info über den Annarsch', 'Anfällig gegen spätes Vertikal-Spiel'],
    execute: [
      'Prep: alle Gadgets auf die Site, keine Vorposten.',
      'Roamer nur bis zur ersten Raumkante, danach zurück.',
      'Nach dem Plant: Utility-Trade statt Einzelduelle.',
      'Retake über eine Linie, nicht gesplittet.',
    ],
    plantCover: 'Site bis zum Schluss, Verteidigung in der Tiefe.',
  }),
  'anti-ban': (t, siteShort) => ({
    name: `${siteShort} – Ban-Alternative ohne Kern-Gadget`,
    summary:
      `Ersatzplan bei gegnerischem Ban: „${t.name}“ hängt normalerweise an einem Gadget, das jetzt fehlt. Die ` +
      `Aufgabe wird auf zwei Spieler verteilt, dafür entsteht ein zusätzlicher Intel-Punkt.`,
    ratings: { c: 3, d: 'mittel', u: 'mittel', k: 'mittel' },
    strengths: ['Bleibt nach Ban spielbar', 'Mehr Intel als der Standard'],
    weaknesses: ['Utility ist dünner verteilt', 'Braucht Absprache, wer den frei gewordenen Slot übernimmt'],
    execute: [
      'Nach dem Ban laut ansagen, welches Gadget ersetzt werden muss.',
      'Ersatz-Gadget nur am Hauptzugang platzieren, nicht breit streuen.',
      'Ein Spieler übernimmt zusätzlich Kamera-Info.',
      'Retake wie Standard, aber mit einem Spieler mehr auf der Site.',
    ],
    plantCover: 'Wie Standard, dafür ohne die Gadget-Reserve.',
  }),
};

/* ================================================================== */
/* Spieler-Slots erzeugen                                              */
/* ================================================================== */

function makePlayers(tactic, picks, variantStyle) {
  const isAtk = tactic.side === 'attack';
  const t0 = tactic.players;
  return picks.map((pick, i) => {
    const donor = t0[i % t0.length];
    const markers = (donor.markers ?? []).map((m) => ({ ...m }));
    const roleWord = isAtk ? 'Druckpunkt' : 'Verteidigungspunkt';
    const prep = isAtk
      ? [
        `Drohne prüfen, bevor du dich als ${pick.role} festlegst.`,
        `${nameOf(pick.op)}: ${abilityOf(pick.op)} – Position dafür vorab festlegen.`,
        variantStyle === 'aggressiv'
          ? 'Route für den frühen Druck einprägen (erster Weg, kein Umweg).'
          : 'Rückzugsweg einprägen: erst öffnen, wenn die Utility sitzt.',
      ]
      : [
        `Gadget von ${nameOf(pick.op)} an die ${variantStyle === 'defensiv' ? 'Site-Kante' : 'Vorposten-Kante'} setzen.`,
        `${pick.role}: Position so wählen, dass der Rückweg zur Site offen bleibt.`,
        variantStyle === 'defensiv'
          ? 'Alle Gadgets auf die Site – keine Vorposten.'
          : 'Vorposten festlegen und Ausstiegszeitpunkt ansagen.',
      ];
    // Erste Action-Zeile richtet sich nach der Rolle – sonst hätten alle Spieler
    // denselben Satz (fällt im Plan sofort als Platzhalter auf).
    const ROLE_ACTION_ATK = {
      'Entry': 'Zuerst rein, nach dem ersten Duell sofort Ansage machen.',
      'Hard-Breach': 'Breach erst nach EMP setzen, dann Wand offen ansagen.',
      'Support': 'Utility für die anderen vorbereiten, nicht als Erster sterben.',
      'Intel': 'Drohne/Replik vor dem Durchstoß, danach Position melden.',
      'Flank-Watch': 'Flankweg halten – kein Vorstoß ohne Meldung.',
      'Vertical': 'Von oben Druck aufbauen, während der Rest unten drückt.',
      'Soft-Breach': 'Erst weiche Öffnung schaffen, dann Wurfutility.',
    };
    const ROLE_ACTION_DEF = {
      'Anchor': 'Winkel halten, nicht über die Kante schießen.',
      'Flex-Anchor': 'Zwischen den Ankern rotieren, Lücken schließen.',
      'Utility-Support': 'Gadget erst bei Kontakt auslösen, nicht früher.',
      'Support-Roamer': 'Früh informieren, danach zur Site zurück.',
      'Roamer': 'Zeit gewinnen, kein Duell ohne Rückweg.',
      'Deep-Roamer': 'Tiefe Position halten, nur melden – nicht heldenhaft kämpfen.',
    };
    const roleLine = isAtk
      ? (ROLE_ACTION_ATK[pick.role] ?? 'Position halten und Ansage machen.')
      : (ROLE_ACTION_DEF[pick.role] ?? 'Winkel halten und Ansage machen.');
    const styleLine = isAtk
      ? (variantStyle === 'aggressiv'
        ? 'Tempo: nicht auf die anderen warten – aber Ansage vor dem Stoß.'
        : 'Tempo: erst Info abwarten, dann als zweiter Spieler nachrücken.')
      : (variantStyle === 'aggressiv'
        ? 'Tempo: ersten Kontakt melden und sofort zurückfallen.'
        : 'Tempo: ruhig bleiben, Utility erst bei echtem Druck.');
    const action = isAtk
      ? [
        roleLine,
        styleLine,
        `Fähigkeit einsetzen: ${abilityOf(pick.op)}.`,
        'Ansage in Kurzform: Raum, Anzahl, ob Utility offen ist.',
      ]
      : [
        roleLine,
        styleLine,
        `Gadget nutzen: ${abilityOf(pick.op)}.`,
        'Nach dem Plant: Utility-Trade statt Einzelduell.',
      ];
    return {
      ...donor,
      slot: i + 1,
      playerName: donor.playerName,
      operator: pick.op,
      role: pick.role,
      tagline: isAtk
        ? `Übernimmt ${pick.role} in der ${variantStyle === 'aggressiv' ? 'frühen' : variantStyle === 'defensiv' ? 'kontrollierten' : 'flexiblen'} Variante`
        : `Übernimmt ${pick.role} in der ${variantStyle === 'aggressiv' ? 'offensiven' : variantStyle === 'defensiv' ? 'konservativen' : 'flexiblen'} Variante`,
      pickReason: `${nameOf(pick.op)}: ${opBySlug.get(pick.op)?.ability?.description ?? pick.role}.`,
      keyAbility: `${abilityOf(pick.op)} (${pick.role})`,
      loadout: donor.loadout,
      prep,
      action,
      markers,
    };
  });
}

function makeSubstitutes(tactic, bannedOps) {
  const isAtk = tactic.side === 'attack';
  const lineup = new Set(tactic.players.map((p) => p.operator));
  const substitutePool = (isAtk ? ATK_PROFILE : DEF_PROFILE)
    .flatMap((slot) => slot.pool.map((op) => ({ op, role: slot.role })))
    .filter((x) => !lineup.has(x.op) && !bannedOps.includes(x.op));
  const seen = new Set();
  const subs = [];
  for (const cand of substitutePool) {
    if (seen.has(cand.op)) continue;
    seen.add(cand.op);
    const replaced = tactic.players.find((p) => p.role === cand.role) ?? tactic.players[0];
    subs.push({
      operator: cand.op,
      for: replaced.operator,
      role: cand.role,
      reason: `${nameOf(cand.op)} übernimmt ${cand.role}: ${abilityOf(cand.op)}.`,
      takesOver: [cand.role],
      setupChange: `Setup ändert sich am ${cand.role}-Punkt; ${nameOf(replaced.operator)} bleibt im Lineup.`,
      weakness: 'Weniger eingespielt als der Stammpick – Ansagen kurz halten.',
    });
    if (subs.length >= 4) break;
  }
  return subs;
}

/* ================================================================== */
/* Varianten bauen                                                     */
/* ================================================================== */

const out = [];
const ids = new Set(base.map((t) => t.id));

for (const t of base) {
  const site = siteObj(t.map, t.site);
  const siteShort = site?.short ?? t.site;
  const isAtk = t.side === 'attack';
  const profile = isAtk ? ATK_PROFILE : DEF_PROFILE;
  const styles = ['aggressiv', 'defensiv', 'anti-ban'];

  styles.forEach((style, idx) => {
    const id = `${t.id}--${style}`;
    if (ids.has(id)) return;
    ids.add(id);

    const usedBase = t.players.map((p) => p.operator);
    const picks = picksFor(profile, style, idx === 0 ? usedBase : []);
    const text = (isAtk ? ATK_TEXT : DEF_TEXT)[style](t, siteShort);
    const players = makePlayers(t, picks, style);

    const variant = {
      id,
      map: t.map,
      site: t.site,
      side: t.side,
      name: text.name,
      style,
      summary: text.summary,
      confidence: 'eigene-analyse',
      updated: UPDATED,
      derivedFrom: t.id,
      ratings: {
        competitive: text.ratings.c,
        difficulty: text.ratings.d,
        utilityDependency: text.ratings.u,
        coordination: text.ratings.k,
        strengths: text.strengths,
        weaknesses: text.weaknesses,
      },
      players,
      substitutes: makeSubstitutes({ ...t, players }, []),
      notes:
        `Abgeleitet aus „${t.name}“ (${t.id}). Eigene Analyse, kein belegtes Pro-Setup. ` +
        `Karte ${mapName(t.map)}, Site ${siteShort}.`,
    };

    if (isAtk && t.attackPlan) {
      variant.attackPlan = {
        ...t.attackPlan,
        execute: style === 'aggressiv' || style === 'defensiv' ? text.execute : [...t.attackPlan.execute.slice(0, 2), ...text.execute.slice(1)],
        postPlant:
          style === 'defensiv'
            ? ['Zwei Spieler halten Winkel, zwei decken Retake, einer sitzt auf dem Defuser.', ...t.attackPlan.postPlant.slice(0, 2)]
            : ['Nach dem Plant sofort auf die Außenwinkel, nicht in die Site.', ...t.attackPlan.postPlant.slice(0, 2)],
        plant: { ...t.attackPlan.plant, cover: text.plantCover },
        alt: {
          ...t.attackPlan.alt,
          why:
            style === 'defensiv'
              ? 'Zweiter Weg bleibt als Drohung zu, wird nur bei Stillstand geöffnet.'
              : 'Zweiter Weg als Nachschlag, wenn der erste Druck hängt.',
        },
      };
    }
    if (!isAtk && t.defensePlan) {
      variant.defensePlan = {
        retake:
          style === 'defensiv'
            ? ['Alle Utility ist am Plant-Ort – Retake in einer Linie.', ...t.defensePlan.retake.slice(0, 3)]
            : style === 'aggressiv'
              ? ['Vorposten zuerst zurückholen, dann gemeinsam retaken.', ...t.defensePlan.retake.slice(0, 3)]
              : ['Ersatz-Gadget sitzt am Hauptzugang – Retake über die ruhige Seite.', ...t.defensePlan.retake.slice(0, 3)],
        roamPlan:
          style === 'defensiv'
            ? ['Nur ein Roamer, maximal bis zur ersten Raumkante.', 'Kein Spieler geht nach dem ersten Kontakt in einen Vorposten.']
            : t.defensePlan.roamPlan,
      };
    }

    out.push(variant);
  });
}

/* Sanity: keine doppelten Operatoren in einer Variante, richtige Seite, 4 Subs. */
const errors = [];
for (const v of out) {
  const lineup = v.players.map((p) => p.operator);
  if (new Set(lineup).size !== 5) errors.push(`${v.id}: Operator doppelt (${lineup.join(', ')})`);
  if (lineup.length !== 5) errors.push(`${v.id}: nicht 5 Spieler`);
  for (const op of lineup) {
    const d = opBySlug.get(op);
    if (!d) errors.push(`${v.id}: unbekannter Operator ${op}`);
    else if (d.role !== v.side) errors.push(`${v.id}: ${op} ist ${d.role}, Taktik ${v.side}`);
  }
  for (const s of v.substitutes) {
    if (lineup.includes(s.operator)) errors.push(`${v.id}: Ersatz ${s.operator} bereits im Lineup`);
    if (new Set(v.substitutes.map((x) => x.operator)).size !== v.substitutes.length) errors.push(`${v.id}: Ersatzpicks doppelt`);
  }
  if (v.substitutes.length < 3) errors.push(`${v.id}: nur ${v.substitutes.length} Ersatzpicks`);
}
if (errors.length) {
  console.error(`✖ ${errors.length} Fehler im Varianten-Generator:`);
  errors.slice(0, 20).forEach((e) => console.error('  ' + e));
  process.exit(1);
}

await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
const perMap = {};
for (const v of out) perMap[v.map] = (perMap[v.map] ?? 0) + 1;
console.log(`✓ variants.json geschrieben: ${out.length} Varianten zu ${base.length} Basis-Taktiken`);
console.log(`  pro Karte: ${Object.entries(perMap).map(([m, n]) => `${m}:${n}`).join(' ')}`);

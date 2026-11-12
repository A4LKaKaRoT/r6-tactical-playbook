/**
 * Kleiner Builder, um die restlichen Bombsites kompakt, aber vollständig
 * zu beschreiben. Jede Taktik braucht 5 Spieler mit Prep-/Action-Phase,
 * Loadout, Objectives und Markern – das würde sonst sehr viel Boilerplate.
 *
 * Aufruf:  defPlan({...})  bzw.  atkPlan({...})
 * Die Texte bleiben pro Site spezifisch; nur die Struktur ist geteilt.
 */

const ok = (v) => Array.isArray(v) && v.length > 0;

/** Ersatzpicks, deren Operator schon im Lineup steht, würden den Validator verletzen. */
function dedupeSubs(id, players, subs) {
  const lineup = new Set(players.map((p) => p.op));
  const list = (subs ?? []).filter((s) => !lineup.has(s.op));
  if (list.length < 3) throw new Error(`${id}: nur ${list.length} Ersatzpicks nach Filterung`);
  return list;
}

export function defPlan({ id, map, site, name, summary, difficulty = 'mittel', utility = 'mittel', coordination = 'mittel',
  strengths = [], weaknesses = [], players, subs, retake, roam, confidence = 'eigene-analyse', notes }) {
  if (!ok(players) || players.length !== 5) throw new Error(`${id}: 5 Spieler nötig`);
  subs = dedupeSubs(id, players, subs);
  return {
    id, map, site, side: 'defense', style: 'standard', name, summary, confidence,
    ratings: { c: 4, d: difficulty, u: utility, k: coordination, s: strengths, w: weaknesses },
    players: players.map((p, i) => ({
      op: p.op, role: p.role, task: p.task, why: p.why, ab: p.ab,
      load: { primary: p.l[0], secondary: p.l[1], gadget: p.l[2] },
      obj: p.obj, prep: p.prep, act: p.act, m: p.m,
    })),
    subs: subs.map((s) => ({ op: s.op, for: s.for, role: s.role, reason: s.reason, takes: s.takes, change: s.change, weak: s.weak })),
    def: { retake, roam },
    ...(notes ? { notes } : {}),
  };
}

export function atkPlan({ id, map, site, name, summary, difficulty = 'hoch', utility = 'hoch', coordination = 'hoch',
  strengths = [], weaknesses = [], players, subs, attack, confidence = 'eigene-analyse', notes }) {
  if (!ok(players) || players.length !== 5) throw new Error(`${id}: 5 Spieler nötig`);
  subs = dedupeSubs(id, players, subs);
  return {
    id, map, site, side: 'attack', style: 'standard', name, summary, confidence,
    ratings: { c: 4, d: difficulty, u: utility, k: coordination, s: strengths, w: weaknesses },
    players: players.map((p) => ({
      op: p.op, role: p.role, task: p.task, why: p.why, ab: p.ab,
      load: { primary: p.l[0], secondary: p.l[1], gadget: p.l[2] },
      obj: p.obj, prep: p.prep, act: p.act, m: p.m,
    })),
    subs: subs.map((s) => ({ op: s.op, for: s.for, role: s.role, reason: s.reason, takes: s.takes, change: s.change, weak: s.weak })),
    attack,
    ...(notes ? { notes } : {}),
  };
}

/** Standard-Ersatzpicks je Seite, damit nicht jede Site eigene braucht. */
export const ATK_SUBS = [
  { op: 'ace', for: 'thermite', role: 'Hard-Breach', reason: 'S.E.L.M.A. lässt sich aus der Deckung setzen.', takes: ['Hard Breach'], change: 'Breach von weiter hinten, etwas langsamer.', weak: 'Weniger Druck direkt an der Wand.' },
  { op: 'sledge', for: 'buck', role: 'Vertical', reason: 'Sledge öffnet Boden und Wände kontrolliert.', takes: ['Vertical'], change: 'Sledge startet eine Etage über der Site.', weak: 'Weniger Reichweite als der Skeleton Key.' },
  { op: 'zofia', for: 'ash', role: 'Entry', reason: 'Zofia bringt Breach + Concussion in einem Slot.', takes: ['Entry', 'Crowd-Control'], change: 'Fenster/Tür per Impact öffnen.', weak: 'Weniger mobil als Ash.' },
  { op: 'dokkaebi', for: 'iana', role: 'Intel', reason: 'Logic Bomb deckt Roamer und Kameras.', takes: ['Intel'], change: 'Kamera-Hack statt Replik.', weak: 'Weniger direkte Innen-Info.' },
  { op: 'nomad', for: 'thatcher', role: 'Flank-Watch', reason: 'Airjabs sichern den Retake-Weg.', takes: ['Flank-Watch'], change: 'Breach braucht Kali oder Maverick.', weak: 'Kein EMP-Radius.' },
];

export const DEF_SUBS = [
  { op: 'smoke', for: 'castle', role: 'Flex-Anchor', reason: 'Smoke schließt den Hauptzugang mit Gas.', takes: ['Plant-Denial'], change: 'Gas statt Panel.', weak: 'Nur in kurzen Zeitfenstern wirksam.' },
  { op: 'bandit', for: 'kaid', role: 'Utility-Support', reason: 'Bandit trickt den Breach aktiv.', takes: ['Anti-Breach'], change: 'Aktives Tricking statt Claws.', weak: 'Höheres Risiko für den Spieler.' },
  { op: 'lesion', for: 'valkyrie', role: 'Deep-Roamer', reason: 'Gu-Minen verzögern und melden den Push.', takes: ['Anti-Entry', 'Intel'], change: 'Minen statt Kameras.', weak: 'Weniger Weitsicht.' },
  { op: 'azami', for: 'mira', role: 'Anchor', reason: 'Kiba-Barrieren schließen Winkel flexibel.', takes: ['Anti-Entry'], change: 'Barrieren statt Mirror.', weak: 'Zerstörbar durch Projektile.' },
];

export const L = (p, s, g) => [p, s, g];

#!/usr/bin/env node
/**
 * build-operators.mjs
 * Erzeugt src/data/operators/operators.json aus r6operators (MIT)
 * + kuratierten deutschen Taktik-Stammdaten (Ausrüstung/Utility-Kurzfassung).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'node_modules/r6operators/dist/index.mjs');
const lib = await import(PKG);

const UPDATED = '2026-11-11';

/** Kuratierte Ergänzungen: Gadget-Auswahl & taktische Kurznotiz (deutsch). */
const CURATED = {
  ash: ['R4-C / G36C', 'Breaching Round: Soft-Breach auf Distanz, zerstört Gadgets (z. B. Shields)'],
  thermite: ['M1014 / 556xi', 'Thermite Charge: Hard Breach in Außenwänden & verstärkten Hatches'],
  thatcher: ['AR33 / L85A2 / M590A1', 'EMP-Granate: deaktiviert Elektro-Gadgets (Bandit/Kaid/Mute) im Radius'],
  hibana: ['Type-89 / SuperNova', 'X-KAIROS: 6 fernzündbare Breach-Ladungen, Hard Breach auf Distanz'],
  ace: ['AK-12 / M1014', 'S.E.L.M.A. Aqua Breacher: wasserfester Hard Breach an Wänden & Hatches'],
  maverick: ['M4 / AR-15.50', 'Suri-Brenner: schmilzt kleine Löcher in verstärkte Wände (Hard Breach ohne Ladung)'],
  sledge: ['L85A2 / M590A1', 'Breaching Hammer: zerstört Softwalls, Barrikaden, Bodenluken'],
  buck: ['C8-SFW / CAMRS', 'Skeleton Key: Unterlauf-Schrotflinte für Boden/Wände (Vertikal-Spiel)'],
  zofia: ['M762 / LMG-E', 'KS79 Lifeline: 2 Impact-Granaten + 2 Concussions'],
  capitao: ['PARA-308 / M249', 'Tactical Crossbow: Feuerbolzen (Area Denial) + Rauchbolzen'],
  nomad: ['AK-74M / ARX200', 'Airjab Launcher: sprengt Gegner zurück (Flank-Schutz, Plant-Denial)'],
  gridlock: ['F90 / M249 SAW', 'Trax Stingers: Stachelmatten blockieren Flanken & verlangsamen'],
  dokkaebi: ['Mk 14 EBR / BOSG.12.2', 'Jegeo Payload + Logic Bomb (Handy-Klingeln/Ring), Kamera-Hack (Rework Y11S2)'],
  lion: ['V308 / 417 / SG-CQB', 'EE-One-D: Bewegungs-Scan, markiert laufende Gegner'],
  finka: ['Spear .308 / 6P41 / SASG-12', 'Adrenalin Surge: HP-Buff + schnelleres Anvisieren + Wiederbeleben'],
  iq: ['AUG A2 / 552 COMMANDO / G8A1', 'Elektronik-Scanner: sieht Gadgets (und aktuell dokkaebi-Ziele) durch Wände'],
  twitch: ['F2 / 417 / SG-CQB', 'Shock Drone: zerstört Gadgets, Kameras und Gadget-Träger'],
  blitz: ['Blitzschild', 'Blitzschild: Schild-Blitze blenden; nahkampffokussierter Entry'],
  montagne: ['Le Roc-Schild', 'Le Roc: ausfahrbarer Vollschild, extrem langsam, perfekt für Plant-Blocks'],
  fuze: ['AK-12 / 6P41 / Ballistic Shield', 'Cluster Charge: 5 Ladungen für Vertikal-Spiel durch Böden'],
  glaz: ['OTs-03', 'Thermal-Scope: Wärmebild durch Rauch (Post-Plant-Hold)'],
  kali: ['CSRX 300', 'V-Lance: zerstört Gadgets durch Wände; Y11S3: ADS während V-Lance'],
  amaru: ['G8A1 / SuperNova', 'Gar Hook: schnellem Repel-/Einstieg über Fenster & Luken'],
  nokk: ['FMG-9 / SIX12 SD', 'HEL Presence Reduction: unsichtbar für Kameras, leiser'],
  sens: ['POF-9 / 417 / TCSG12', 'R.O.U. Projector: vernebelte Sichtbarriere für sichere Pushs'],
  flores: ['AR-33 / Commando 9', 'RCE-Ratero: ferngesteuerte Sprengdrohne (Gadget- & Shield-Denial)'],
  osa: ['556 COMMANDO / ARX200', 'Talon-8 Clear Shield: aufstellbares Schild, das sie durchschauen kann'],
  brava: ['CAMRS / PARA-308', 'Kludge Drone: übernimmt feindliche Gadgets'],
  deimos: ['AK-74M / M590A1', 'DeathMARK Tracker: markiert Gegner, der für Deimos sichtbar ist'],
  ram: ['R4-C / LMG-E', 'BU-GI Auto-Breacher: fährt durch Softwalls, zerstört alles auf dem Weg'],
  'solid-snake': ['Tacit .45', 'Soliton Radar Mk. III: top-down Scan, erkennt Gegner + Wände/Böden'],
  rauora: ['M249 / 417', 'D.O.M. Launcher: kugelsichere Panels in Türrahmen, öffnen schneller für Angreifer'],
  striker: ['M4 / M249', 'Breach-Rounds & Smokes – Allround-Einstiegs-Angreifer'],

  smoke: ['FMG-9 / M590A1', 'Remote-Gas-Granate: 3x toxischer Rauch – Top-Plant-Denial'],
  mute: ['MP5K / M590A1', 'Signal Disruptor: blockiert Durchbruch-Ladungen, Hard Breach & Dokkaebi-Hack'],
  castle: ['UMP45 / M1014', 'Bulletproof-Camera + Armor Panel: verstärkte Barrikade, die nur Sprengstoff öffnet'],
  pulse: ['UMP45 / M1014', 'Heartbeat-Sensor: sieht Herzschläge durch Wände, vertikale Information'],
  doc: ['MP5 / P90 / SG-CQB', 'Stim-Pistole: heilt/bufft Teammates auf 140 HP'],
  rook: ['MP5 / P90 / SG-CQB', 'Armor-Pack: Rüstung mit Down-Wiederbelebung'],
  kapkan: ['9x19VSN / SASG-12 / Jäger-Falle', 'Entry-Denial-Devices: Sprengfallen an Fenstern/Türen; Y11S3: mehr Schaden'],
  tachanka: ['DP27 / M870', 'Shumikha-Shumikha Launcher: Brand- und Sperrfeuer (Y11S3 Balancing)'],
  bandit: ['MP7 / M870', 'Bandit-Batterie: Elektro-Hard-Breach-Denial (Bandit-Trick)'],
  jager: ['416-C Carbine / M870', 'Active Defense: zerstört Projektile (Granaten, Flashs, Ash Rounds)'],
  frost: ['9mm C1 / Super 90', 'Welcome-Mat: Beinfallen unter Fenstern & Durchgängen'],
  valkyrie: ['MPX / SPAS-12', 'Black Eye: 3 werfbare Kameras, Außen- und Flank-Intel'],
  caveira: ['M12 / SPAS-15', 'Silent Step: lautloses Laufen + Interrogation (Anti-Roam-Clear)'],
  echo: ['MP5SD / SuperNova', 'Yokai: unsichtbare Schockdrohne (Y11S3 schnellerer Schock-Recharge)'],
  mira: ['Vector .45 ACP / ITA12S', 'Black-Mirror: Einweg-Spiegel in verstärkter Wand, Retake/Intel'],
  lesion: ['T-5 SMG / SIX12 SD', 'Gu-Mine: Giftmine, verlangsamt + Intel'],
  maestro: ['ALDA 5.56 / ACS12', 'Evil Eye: kugelsichere Überwachungskamera mit Laser (Crowd Control)'],
  alibi: ['Mx4 Storm / ACS12', 'Prisma: Projektion-Attrappen, Intel bei Beschuss'],
  kaid: ['AUG A3 / TCSG12', 'Electroclaw: Elektro an nicht erreichbaren Stellen (Hatches)'],
  mozzie: ['Commando 9 / P10 RONI', 'Pest Launcher: fängt Angreifer-Drohnen'],
  gridl: ['—', '—'],
  oryx: ['MP5 / SPAS-12', 'Remah Dash: schnelle Rotation durch Softwalls, Springen über Luken'],
  wamai: ['AUG A2 / MP5K', 'Mag-NET: zieht Projektile an und absorbiert sie'],
  goyo: ['Vector .45 ACP / TCSG12 + Ballistic Shield', 'Volcán Shield: brennbare Barrikade im Schild – Area Denial'],
  melusi: ['MP5 / Super 90', 'Banshee: verlangsamt Gegner im Radius, Alarm bei Berührung'],
  aruni: ['P10 RONI / Mk 14 EBR', 'Surya-Gate: verstärkte Laserbarriere an Türen/Durchgängen'],
  thunderbird: ['Spear .308 / SPAS-15', 'Kóna-Station: Heil-Station, die auch Angreifer heilt'],
  thorn: ['UZK50GI / M870', 'Razorbloom: Stachelfalle mit zeitverzögertem Gift'],
  azami: ['9x19VSN / ACS12', 'Kiba-Barriere: sofort verfestigende Barrikaden (Line-of-Sight-Control)'],
  fenrir: ['MP7 / SASG-12', 'F-NATT Dread Mine: Gasminen aktivieren nur für Gegner'],
  solis: ['P90 / ITA12S / SMG-11', 'SPEC-IO: scannt Gadgets durch Wände, markiert Elektronik'],
  tubarao: ['MPX / M590A1', 'Zoto Canister: friert Gadgets und Flächen ein, deaktiviert Elektronik'],
  skopos: ['M4 / Mx4 Storm', 'Vanguard-Roboter: tauscht zwischen zwei Körpern'],
  sentry: ['Spear .308 / M870', 'Faltbare Barrikade + Kamera – Allround-Verteidiger'],
  denari: ['SIX12 SD / 9x19VSN', 'T.R.I.P. Connector: Laser-Gittersystem (verlangsamt + Schaden)'],
  noor: ['Commando-9 / ALDA 5.56', 'Horus Lance: 5 Projektile durch Schilde/Wände, beidseitige Flammenfront – Anti-Shield'],
  rook2: ['—', '—'],
  blackbeard: ['MK17 CQB / SR-25', 'Hull Shield: montiert einen zerstörbaren Schutzschild am Gewehr (Kopfschutz beim Winkel-Halten)'],
  clash: ['SPSMG9 / CCE Shield', 'Electrified CCE Shield: verlangsamt und schädigt Gegner bei Kontakt'],
  ela: ['Scorpion EVO 3 A1 / FO-12', 'Grzmot Mine: 4x Concussion-Minen (Blendung + Störung)'],
  grim: ['552 COMMANDO / SG-CQB', 'Kawan Hive Launcher: Bienen-Schwarm markiert Gegner im Bereich'],
  iana: ['ARX200 / G36C', 'Gemini Replicator: Hologramm-Drohne als intel- und Bait-Tool'],
  jackal: ['C7E / PDW9 / ITA12L', 'Eyenox Model III: Fußspuren-Tracking, markiert Roamer'],
  vigil: ['K1A / BOSG.12.2', 'ERC-7: unsichtbar für Drohnen und Kameras (Roam-Intel-Denial)'],
  warden: ['MPX / M590A1 / P-10C', 'Glance Smart Glasses: Durchblick durch Rauch, Flash-Resistenz beim Stehen'],
  ying: ['T-95 LSW / SIX12', 'Candela: Blendgranaten, die durch Softwalls/Barrikaden wirken'],
  zero: ['SC3000K / MP7', 'Argus Launcher: Kameras mit Laser an Wänden/Decken (Intel + Gadget-Zerstörung)'],
};

function norm(slug) { return slug; }

const out = [];
for (const [key, op] of Object.entries(lib)) {
  if (key === 'default' || !op || !op.role || op.role === 'Recruit') continue;
  const curated = CURATED[key] || null;
  const speed = op.ratings?.speed ?? 2;
  const health = op.ratings?.health ?? 2;
  const difficulty = op.ratings?.difficulty ?? 2;
  out.push({
    slug: norm(key),
    name: key === 'solid-snake' ? 'Solid Snake' : op.name,
    role: op.role === 'Attacker' ? 'attack' : 'defense',
    org: op.org || 'Unbekannt',
    squad: op.squad || '—',
    speed,
    health,
    difficulty,
    ability: {
      name: curated ? curated[1].split(':')[0] : 'Gadget',
      description: curated ? curated[1] : 'Beschreibung folgt',
    },
    weapons: curated ? [{ name: curated[0], type: 'Primär' }] : [{ name: 'siehe In-Game-Loadout', type: 'Primär' }],
    gadgets: [],
    tags: [op.role === 'Attacker' ? 'Angriff' : 'Verteidigung'],
    source: 'r6operators',
    updated: UPDATED,
  });
}

// Noor & Solid Snake sind im MIT-Paket nicht enthalten → manuell ergänzt (offizielle Daten Y11S3).
out.push({
  slug: 'noor', name: 'Noor', role: 'defense', org: 'Unit 777', squad: '—',
  speed: 2, health: 2, difficulty: 2,
  ability: { name: 'Horus Lance', description: CURATED.noor[1] },
  weapons: [{ name: 'Commando-9 / ALDA 5.56', type: 'Primär' }, { name: 'TACOPS 1911 / Bailiff 410', type: 'Sekundär' }],
  gadgets: ['Stacheldraht', 'Deployable Shield'], tags: ['Anti-Entry', 'Anti-Shield', 'Crowd Control'],
  source: 'ubisoft', updated: UPDATED,
});
out.push({
  slug: 'solid-snake', name: 'Solid Snake', role: 'attack', org: 'FOXHOUND', squad: '—',
  speed: 3, health: 1, difficulty: 2,
  ability: { name: 'Soliton Radar Mk. III', description: CURATED['solid-snake'][1] },
  weapons: [{ name: 'Tacit .45', type: 'Sekundär', note: 'Integrierter Schalldämpfer' }],
  gadgets: ['Rauchgranaten', 'Breach Charge'], tags: ['Intel', 'Infiltration'],
  source: 'ubisoft', updated: UPDATED,
});

out.sort((a, b) => a.name.localeCompare(b.name, 'de'));
await mkdir(join(ROOT, 'src/data/operators'), { recursive: true });
await writeFile(join(ROOT, 'src/data/operators/operators.json'), JSON.stringify(out, null, 2));
console.log(`operators.json geschrieben: ${out.length} Operatoren`);

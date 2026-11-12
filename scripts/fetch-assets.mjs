#!/usr/bin/env node
/**
 * fetch-assets.mjs
 * ------------------------------------------------------------------
 * Lädt die Bild-Assets (Karten-Blueprints, Map-Keyarts, Operator-Icons)
 * in den Ordner `public/` und schreibt einen Manifest-Datei mit
 * Quelle + Lizenzhinweis.
 *
 * Quellen:
 *  - Blueprints: Ubisoft Blueprints (offizielle Kartenpläne),
 *    gespiegelt über siegestrats.com (kein offizielles CDN verfügbar).
 *    Rechte: Ubisoft / Tom Clancy's Rainbow Six Siege.
 *  - Map-Keyarts: staticctf.ubisoft.com (offizielles Ubisoft-CDN).
 *  - Operator-Icons: r6operators (MIT, github.com/marcopixel/r6operators)
 *    plus offizielle Ubisoft-Badges für Solid Snake & Noor.
 *
 * Aufruf:  node scripts/fetch-assets.mjs
 * ------------------------------------------------------------------
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUB = join(ROOT, 'public');

const UBISOFT_CDN = 'https://staticctf.ubisoft.com/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn';

const MAPS = [
  { slug: 'bank', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/6ilgtuzucX7hEu2MvjhRtp/c7c7e63cff53c8b2192fdec68a736619/R6S_Maps_Bank_EXT.jpg` },
  { slug: 'border', floors: ['1F', '2F'], keyart: `${UBISOFT_CDN}/4hqsrL3cokFqedkfjiEaGf/655acbe5ae4ffab54f742d17f929d2af/R6S_Maps_Border_EXT.jpg` },
  { slug: 'calypso-casino', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/3Q3GWe0iPQ15DhqgukvMkR/6ab28980dfa75673087df15ad4568489/R6S_Maps_CalypsoCasino_Background.png` },
  { slug: 'chalet', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/Km3ZJUM7ZMVbGsi6gad5Y/5656a6da468b39f5e8effe5307592f28/R6S_Maps_Chalet_EXT.jpg` },
  { slug: 'clubhouse', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/1vCw5eD2XzxZlv6Au1gtui/06a84bacaacab62937dd6d4d8ae393c7/R6S_Maps_ClubHouse_EXT.jpg` },
  { slug: 'coastline', floors: ['1F', '2F'], keyart: `${UBISOFT_CDN}/5GfAQ3pXCJnDqiqaDH3Zic/a59f16615dbe5b65bd02669353067620/r6s-maps-coastline-thumb.jpg` },
  { slug: 'consulate', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/fK2eXk5ne1HUzXkki76qb/54571ed70705051825a70beb2018c5e8/ModernizedMap_Consulate_keyart.jpg` },
  { slug: 'fortress', floors: ['1F', '2F'], keyart: `${UBISOFT_CDN}/1MrLwvq61aSSvvUj3dDiZg/58bd501d0064d7b453396bb5a2bd56be/fortress-reworked-thumbnail.jpg` },
  { slug: 'kafe', floors: ['1F', '2F', '3F'], keyart: `${UBISOFT_CDN}/2nIuPSHvbM57TK90VSwBEm/c9b6b012d961c03a930902fb14e36ea1/R6S_Maps_RussianCafe_EXT.jpg` },
  { slug: 'kanal', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/4VHR8uZRGkHqvtZxtmibtc/da988c2cab37f1cb186535fc9ba40bea/r6-maps-kanal.jpg` },
  { slug: 'lair', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/423IqxUqD6yfPEy6CissY0/8fadc01d9fe5ec8695b80be8be9850a7/ModernizedMap_Lair_keyart.jpg` },
  { slug: 'nighthaven', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/57i2PyuzpgVFzOvLUSAItO/97a571fdb6f568ae69951b75f572d361/ModernizedMap_Nighthaven_keyart.jpg` },
  { slug: 'oregon', floors: ['B', '1F', '2F', '3F'], keyart: `${UBISOFT_CDN}/Z9a0gU7iR0vfcbXtoJUOW/98c0c194937998b8c1310788bd874d57/r6s_maps_oregon_thumbnail.jpg` },
  { slug: 'outback', floors: ['1F', '2F'], keyart: `${UBISOFT_CDN}/1vqGVW6pqBZlLKp4h86NnB/08a7e337c0cfa604cde79e755fedb397/r6-maps-outback.jpg` },
  { slug: 'villa', floors: ['B', '1F', '2F'], keyart: `${UBISOFT_CDN}/Io6dxNeHbCbJoF9WLJf9s/0b9ed52de358585c47c327c46907d1cd/r6s-maps-villa-thumb.jpg` },
];

// Operatoren mit eigenen Ubisoft-Badges (nicht im MIT-Paket enthalten):
const UBISOFT_BADGES = {
  noor: `${UBISOFT_CDN}/6DHgKOCoB9bcrQJiOjvQad/8b60ed79e3ce1dd3a352a0d1018cc604/r6s-operators-badge-noor.png`,
  'solid-snake': `${UBISOFT_CDN}/7l8uzV1767cot7GpTcnK7t/9be16729f34b76e97dbcbbd0a81bd74c/r6s-operators-badge-solidsnake.png`,
};

const R6OP_BASE = 'https://cdn.jsdelivr.net/npm/r6operators@2.12.0/dist/icons';

const OPERATORS = [
  'ace','alibi','amaru','aruni','ash','azami','bandit','blackbeard','blitz','brava','buck','capitao','castle',
  'caveira','clash','deimos','denari','doc','dokkaebi','echo','ela','fenrir','finka','flores','frost','fuze',
  'glaz','goyo','gridlock','grim','hibana','iana','iq','jackal','jager','kaid','kali','kapkan','lesion','lion',
  'maestro','maverick','melusi','mira','montagne','mozzie','mute','nokk','nomad','oryx','osa','pulse','ram',
  'rauora','rook','sens','sentry','skopos','sledge','smoke','solis','striker','tachanka','thatcher','thermite','thorn','thunderbird',
  'tubarao','twitch','valkyrie','vigil','wamai','warden','ying','zero','zofia',
];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function download(url, dest) {
  if (await exists(dest)) return { dest, skipped: true };
  const res = await fetch(url, { headers: { 'User-Agent': 'r6-playbook-asset-fetcher/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} für ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return { dest, bytes: buf.length };
}

async function main() {
  const manifest = { generatedAt: new Date().toISOString(), maps: [], operators: [], sources: {} };
  let ok = 0, fail = 0;

  for (const m of MAPS) {
    const entry = { slug: m.slug, floors: {} };
    for (const f of m.floors) {
      const url = `https://siegestrats.com/blueprints/${m.slug}/${f}.webp`;
      const dest = join(PUB, 'maps', m.slug, `floor-${f}.webp`);
      try { await download(url, dest); entry.floors[f] = `maps/${m.slug}/floor-${f}.webp`; ok++; }
      catch (e) { console.warn(`! Blueprint ${m.slug}/${f}: ${e.message}`); fail++; }
    }
    try { await download(m.keyart, join(PUB, 'maps', m.slug, 'keyart.jpg')); entry.keyart = `maps/${m.slug}/keyart.jpg`; ok++; }
    catch (e) { console.warn(`! Keyart ${m.slug}: ${e.message}`); fail++; }
    manifest.maps.push(entry);
    console.log(`✓ ${m.slug} (${m.floors.length} Stockwerke)`);
  }

  for (const op of OPERATORS) {
    const dest = join(PUB, 'operators', `${op}.svg`);
    try {
      await download(`${R6OP_BASE}/${op}.svg`, dest);
      manifest.operators.push({ slug: op, file: `operators/${op}.svg`, source: 'r6operators (MIT)' });
      ok++;
    } catch (e) { console.warn(`! Icon ${op}: ${e.message}`); fail++; }
  }
  for (const [op, url] of Object.entries(UBISOFT_BADGES)) {
    try {
      await download(url, join(PUB, 'operators', `${op}.png`));
      manifest.operators.push({ slug: op, file: `operators/${op}.png`, source: 'Ubisoft Operator Badge' });
      ok++;
    } catch (e) { console.warn(`! Badge ${op}: ${e.message}`); fail++; }
  }

  manifest.sources = {
    blueprints: 'Ubisoft Blueprints (offizielle Kartenpläne), gespiegelt über siegestrats.com — © Ubisoft',
    keyarts: 'staticctf.ubisoft.com — © Ubisoft',
    operatorIcons: 'r6operators von Marco Vockner, MIT-Lizenz — github.com/marcopixel/r6operators',
    operatorBadges: 'Offizielle Ubisoft Operator-Badges für Solid Snake & Noor — © Ubisoft',
  };

  await writeFile(join(PUB, 'assets-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nFertig: ${ok} Dateien geladen, ${fail} Fehler. Manifest: public/assets-manifest.json`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });

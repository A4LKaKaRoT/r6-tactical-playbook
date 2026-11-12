#!/usr/bin/env node
/**
 * GitHub Pages kennt kein SPA-Routing: Ein direkter Aufruf von
 * /r6-tactical-playbook/map/bank/defense liefert die 404.html.
 * Lösung: index.html nach 404.html kopieren – GitHub Pages liefert diese Datei
 * bei unbekannten Pfaden aus, React-Router übernimmt danach die Route.
 *
 * WICHTIG: Die Pfade in 404.html bleiben ABSOLUT (z. B. /r6-tactical-playbook/assets/…).
 * Relative Pfade (./assets/…) würden bei /repo/tactic/xyz zu /repo/tactic/assets/…
 * aufgelöst und damit 404 liefern. Project-Sites liegen immer unter /<repo>/,
 * deshalb ist der absolute Pfad aus BASE_PATH hier korrekt.
 */
import { copyFile, readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const dist = 'dist';
const index = join(dist, 'index.html');
await stat(index);
await copyFile(index, join(dist, '404.html'));

const html = await readFile(index, 'utf8');
const relativeScripts = /src="\.\/assets\//.test(html);
const assets = await readdir(join(dist, 'assets'));

if (relativeScripts) {
  console.warn('⚠ index.html nutzt relative Asset-Pfade – für GitHub Pages bitte mit BASE_PATH bauen.');
} else {
  console.log('404.html geschrieben (SPA-Fallback, absolute Asset-Pfade).');
}
console.log(`${assets.length} Asset-Dateien in dist/assets.`);

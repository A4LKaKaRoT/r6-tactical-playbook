# Site-Pläne (Quelle für `src/data/tactics/tactics.json`)

Jede Datei exportiert ein Array von Plänen. `npm run tactics:build` erzeugt daraus die
vollständige `tactics.json`.

## Markdown-Marker-Format

```
[floor, x, y, kind, label, toX?, toY?, toFloor?]
```

- `floor`: `B` | `1F` | `2F` | `3F`
- `x`,`y`: Prozent der Bildbreite/-höhe (0–100) auf dem jeweiligen Blueprint
- `kind`: `position` | `gadget` | `angle` | `plant` | `spawn` | `rotation` | `breach`
- Rotationen: `toX`/`toY` = Zielpunkt

Koordinaten beziehen sich immer auf das Blueprint-Bild `public/maps/<map>/floor-<floor>.webp`
(1600×900). Die Werte wurden an den offiziellen Ubisoft-Blueprints kalibriert.

## Felder pro Plan

| Feld | Bedeutung |
| --- | --- |
| `id` | eindeutig, Schema `<map>-<site>-<def|atk>-<variante>` |
| `ratings.c` | Competitive-Eignung 1–5 |
| `ratings.d/u/k` | Schwierigkeit / Utility-Abhängigkeit / Koordinationsbedarf (`niedrig`/`mittel`/`hoch`) |
| `players[]` | exakt 5, eindeutige Operatoren, passend zur Seite |
| `subs[]` | Ersatzpicks mit Begründung, übernommenen Aufgaben, Setup-Änderung, Schwäche |

## Zwei Wege, einen Plan zu schreiben

**A) Voll ausgeschrieben** (wie `defense-a.mjs` … `defense-e.mjs`, `attack-a.mjs` … `attack-d.mjs`):
jedes Feld explizit. Gut, wenn Du viele Details pro Spieler brauchst.

**B) Über den Builder** (wie `defense-f.mjs`, `attack-e.mjs`):

```js
import { defPlan, L, DEF_SUBS } from './_builder.mjs';

export default [
  defPlan({
    id: 'bank-tellers-def-standard', map: 'bank', site: 'tellers',
    name: 'Tellers – Mirror-Anker',
    summary: '…mindestens 20 Zeichen…',
    players: [{ op: 'mira', role: 'Anchor', task: '…', why: '…', ab: '…',
                l: L('Vector .45 ACP', 'ITA12S', 'Nitro Cell'),
                obj: ['anchor', 'intel'], prep: ['…'], act: ['…'],
                m: [['1F', 62, 43, 'position', 'Mira – Tellers']] }, /* … 4 weitere */],
    subs: DEF_SUBS,            // Builder filtert Operatoren aus dem eigenen Lineup automatisch
    retake: ['…'], roam: ['…'],
  }),
];
```

* Dateien, die mit `_` beginnen (`_builder.mjs`), werden vom Generator **übersprungen** – dort liegen nur Helfer.
* `defPlan()` / `atkPlan()` prüfen schon beim Import: genau 5 Spieler, mindestens 3 brauchbare Ersatzpicks
  (nach Entfernen von Operatoren, die selbst im Lineup stehen).
* `L(primary, secondary, gadget)` ist nur eine Kurzschreibweise für das Loadout-Objekt.

## Prüfen vor dem Commit

```bash
npm run tactics:build   # baut tactics.json + prüft IDs/Operatoren/5er-Lineups
npm run validate        # Schema, Marker-Etagen, Ersatzpicks, Assets
npm run test            # u. a. „jede Bombsite hat Angriff UND Verteidigung“
```

Die letzte Prüfung schlägt fehl, sobald eine Karte/Site-Kombination ohne Plan bleibt – so kann keine Abdeckung
unbemerkt wegfallen.

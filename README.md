# R6 Tactical Playbook

Deutschsprachiges, statisches Playbook für ein festes 5-Stack in **Rainbow Six Siege** (Ranked + Siege Cup).
Kein Backend, keine Anmeldung, keine Kosten – läuft als reine React-App auf **GitHub Pages**.

**Stand:** Y11S3 „Operation Split Fire" (Saisonstart 01.09.2026, Mid-Season-Patch 15.10.2026) – Datenstand 11.11.2026.
**Umfang:** **480 Taktiken** – 120 Standardpläne (60 Verteidigung / 60 Angriff) plus **360 Varianten**
(aggressiv / defensiv / Ban-Alternative), also 4 Pläne pro Site und Seite. 15 Ranked-Karten, 78 Operatoren
(77 Icons + Striker mit Initialen). Läuft nach dem ersten Aufruf **offline** und lässt sich auf dem Handy installieren.

---

## Was die App kann

| Bereich | Inhalt |
|---|---|
| **Start** | Karten-Kacheln mit echten Vorschauen, Schnellzugriff auf Angriff / Verteidigung / Favoriten / zuletzt genutzt, Saison-Änderungen |
| **Karten** | 15 Ranked-Karten + Siege-Cup-Rotation + Archivliste, Filter nach Ranked/Cup/Pro, Suche |
| **Verteidigung** | Karte → Bombsite → komplettes 5er-Lineup: Anker, Roamer, Utility, Prep-Phase, Action-Phase, Retake-Plan |
| **Angriff** | Karte → Spawn → Bombsite → 5 Angreifer mit Spawn-Split, Entry/Support/Hard-Breach/Soft-Breach/Intel/Flank-Watch/Vertikal, Drohnenplan, Execute, Plant, Post-Plant, Alternativ-Push |
| **Taktik-Detail** | Bewertungen (Wettkampf-Eignung, Schwierigkeit, Utility-Abhängigkeit, Koordination, Stärken/Schwächen), Ersatzpicks (≥ 3 pro Taktik), Ban-Engine |
| **Varianten** | Jede Site hat Standard + Aggressiv + Defensiv + Ban-Alternative; umschaltbar in der Site-Ansicht, klar als eigene Analyse markiert |
| **Offline / PWA** | Nach dem ersten Laden ohne Netz nutzbar, installierbar auf Handy und Desktop, Update-Hinweis bei neuer Version |
| **Karte (interaktiv)** | Echte Blueprint-Übersichten je Etage · Zwei-Finger-Pinch, Doppeltipp-Stufe, Mausrad (ohne Seiten-Scroll), +/- und „Fokus" (rahmt die Marker) · Marker bleiben bei jedem Zoom gleich groß · Ebenen-, Spieler- und Typfilter · eigene Marker zeichnen · 5-%-Raster |
| **Taktiken** | Volltextsuche über alle Taktiken, Favoriten, Filter |
| **Editor** | Taktiken anlegen, bearbeiten, kopieren, löschen, als JSON exportieren/importieren, Marker per Tabelle justieren |
| **Schnellmodus** | Mid-Match: Karte → Seite → Site → Lineup + Aufgaben + Key-Setup + Karte |
| **Einstellungen** | Roster-Namen, Bans, Anzeige, Datenprüfung, Changelog, Quellen, Lizenzhinweise |

**Ehrlichkeit bei den Daten:** Jede Taktik trägt `confidence` (`verifiziert` = öffentlich dokumentiertes Pro-Setup,
`community` = Community-Quelle, `eigene-analyse` = eigene Analyse) **und** ein `updated`-Datum. Datenlücken sind in
`notes` sichtbar markiert. Es werden keine Meta-Aussagen erfunden.

---

## Schnellstart (Linux Mint)

```bash
# 1. Node.js LTS installieren (falls nicht vorhanden)
node -v          # sollte v20.x oder v22.x zeigen
# sonst:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Abhängigkeiten installieren
cd r6-tactical-playbook
npm install

# 3. Entwicklungsserver starten
npm run dev
# -> http://localhost:5173

# 4. Alles prüfen (Typecheck, Daten, Tests, Build)
npm run check:all
```

---

## Daten pflegen (ohne Code anzufassen)

Alle Inhalte liegen als JSON bzw. als kompakte JS-Plan-Dateien vor:

```
src/data/
  maps/maps-a.json, maps-b.json     # Karten, Bombsites, Etagen, Spawns, Callouts
  operators/operators.json          # Operator-Liste mit Rolle, Gadget, Loadout-Hinweisen
  metadata/meta.json                # Version, Pools, Balance-Änderungen, Quellen, Changelog
  metadata/team.json                # Roster-Slots und bevorzugte Rollen
  tactics/tactics.json              # GENERIERT aus scripts/plans/*.mjs
scripts/plans/
  defense-a…f.mjs, attack-a…e.mjs   # Quelle für die Standardpläne (lesbar, kompakt)
  _builder.mjs                      # gemeinsamer Builder für die kompakten Pläne (defPlan/atkPlan)
scripts/build-variants.mjs          # erzeugt die 360 Varianten aus den Standardplänen
```

**Ablauf für eine neue/geänderte Taktik:**

```bash
# Plan-Datei bearbeiten, z. B. scripts/plans/defense-b.mjs
npm run tactics:build     # schreibt src/data/tactics/tactics.json neu + prüft IDs/Operatoren
                          # Dateien mit _ am Anfang werden übersprungen (Helfer, keine Taktik-Listen)
npm run validate          # prüft Schema, 5 Spieler, Duplikate, Assets
npm run test
npm run dev               # visuell prüfen
```

Der Generator bricht ab bei: unbekannter Karte/Site, doppelter Taktik-ID, ≠ 5 Spielern, doppelten Operatoren,
Operatoren der falschen Seite. Eine einzelne kaputte Taktik im JSON legt die App **nicht** lahm – sie wird beim Laden
verworfen und in **Einstellungen → Datenprüfung** gelistet.

### Marker-Koordinaten

Marker nutzen Prozent-Koordinaten der Blueprint-Datei (1600×900):

```js
['2F', 46, 47, 'breach', 'Thermite – Balkonwand']   // [Etage, x%, y%, Typ, Label]
```

Typen: `position` (weiß), `gadget` (gelb), `angle` (weiß), `rotation` (grün), `plant` (orange), `breach` (rot), `spawn` (blau).
Feinjustierung am einfachsten im Editor (Tabelle mit x/y-Feldern) oder direkt auf der Karte über „Marker zeichnen".

> Die ausgelieferten Positionen sind auf ±3 % geschätzt (Blueprints ohne Callout-Koordinaten) und im Editor justierbar.

---

## Assets (Bilder) austauschen

```
public/maps/<slug>/floor-<etage>.webp   # Blueprint je Etage, empfohlen 1600×900
public/maps/<slug>/keyart.jpg           # Kachel auf der Startseite
public/operators/<slug>.svg|.png        # Operator-Icons
```

* Fehlt ein Blueprint, zeigt die Karte eine klare Fehlermeldung mit erwartetem Pfad – die App stürzt nicht ab.
* Fehlt ein Operator-Icon, werden Initialen angezeigt.
* `npm run assets:fetch` lädt die Assets erneut (Blueprint-Übersichten, Keyarts, Icons) und schreibt `public/ASSETS.md`.

**Rechte:** Blueprint-Übersichten und Karten-Keyarts sind Ubisoft-Material (Fan-Nutzung, nicht kommerziell).
Operator-Icons stammen aus dem MIT-lizenzierten Paket [`r6operators`](https://github.com/marcopixel/r6operators).
Für neue Operatoren ohne Icon: SVG selbst ablegen oder Initialen-Fallback nutzen (dokumentiert in `Einstellungen → Rechtliches`).

---

## Deployment auf GitHub Pages (komplette Anleitung)

```bash
# 1. Git-Repo initialisieren (einmalig)
cd r6-tactical-playbook
git init
git branch -M main
git add .
git commit -m "R6 Tactical Playbook – initial"

# 2. Repo auf GitHub anlegen (leer, ohne README), dann per SSH verbinden:
git remote add origin git@github.com:<DEIN-USER>/r6-tactical-playbook.git
git push -u origin main
```

> **SSH statt Passwort:** GitHub akzeptiert im Terminal kein Kontopasswort.
> Im Projekt liegt `ssh-setup.sh` – es erzeugt den Key **ohne Passphrase-Rückfrage**
> (`ssh-keygen -t ed25519 -N ""`), zeigt die Zeile für <https://github.com/settings/keys>
> und stellt ein HTTPS-Remote automatisch auf SSH um:
>
> ```bash
> bash ssh-setup.sh
> ```
>
> Ausführlich (Passphrase, mehrere Konten, Port 443 hinter Firewall): `ANLEITUNG.md` → Abschnitt 13.

3. Auf GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Der Workflow `.github/workflows/deploy.yml` läuft bei jedem Push auf `main`:
   `npm ci` → `tactics:build` → `validate` → `test` → `build` (mit `BASE_PATH=/<repo>/`) → Deploy.
5. Nach ~1–2 Minuten ist die Seite erreichbar unter
   `https://<DEIN-USER>.github.io/r6-tactical-playbook/`.

**Warum Deep-Links funktionieren:** Der Build kopiert `dist/index.html` nach `dist/404.html`.
GitHub Pages liefert diese Datei bei direkten Aufrufen von Unterseiten aus, React Router übernimmt danach.
Alle Assets werden über `import.meta.env.BASE_URL` aufgelöst (`src/lib/paths.ts`) – funktioniert im Unterpfad und lokal.

**Eigene Domain?** `public/CNAME` mit der Domain anlegen und in den Repo-Settings eintragen.

---

## Update auf eine neue Season

1. `src/data/metadata/meta.json` anpassen: `game`, `seasonLabel` (z. B. `Y12S1`), `operation`, `operationLaunch`,
   `lastUpdated`, `metaVersion`, `rankedPool` / `proPool` / `siegeCup`, `balanceHighlights`, `sources`.
2. Karten, die aus dem Pool fallen: `ranked: false` setzen und in `archivePool` aufnehmen (Blueprint/Taktiken können bleiben).
3. Neue Karte: Eintrag in `maps-a/b.json` + Ordner `public/maps/<slug>/` + Taktikplan-Datei.
4. Neue Operatoren: `npm install r6operators@latest && npm run assets:fetch && node scripts/build-operators.mjs`.
5. `npm run tactics:build && npm run check:all`, committen, pushen.

---

## Projektstruktur

```
src/
  main.tsx, App.tsx          # Bootstrap + Routing (BrowserRouter mit BASE_URL)
  styles.css                 # komplettes Design (Anthrazit, Rot=Angriff, Blau=Verteidigung, Grün=Intel)
  types.ts                   # alle Datentypen
  lib/
    queries.ts               # Datenzugriff + Ban-Engine (adjustTacticForBans)
    validate.ts              # Laufzeit-Validierung (isolierte Fehler pro Taktik)
    storage.ts               # localStorage: Favoriten, eigene Taktiken, Bans, Roster, Marker
    store.tsx                # React-Context
    paths.ts                 # BASE_URL-sichere Asset-Pfade
    colors.ts                # Spielerfarben + Marker-Legende
  components/                # OperatorIcon, TacticMap, TacticView, BanPanel, MapTile
  pages/                     # Home, Maps, SideList, SideSelect, SiteFlow, TacticDetail,
                             # Tactics, Favorites, EditorIndex, TacticEditor, Settings, QuickMode
tests/                       # Vitest: Datenschema, Ban-Engine, Validierung
scripts/                     # fetch-assets, build-operators, build-tactics, validate-data, make-spa-fallback
```

---

## Design-System

Die Oberfläche folgt einer eigenen Richtung: **Military Operations × Professional Esports × Tactical Intelligence**.
Kein Dashboard-Look, keine Verläufe, keine Glow-Effekte, keine Emoji-Icons.

| Ebene | Entscheidung |
|---|---|
| **Flächen** | Graphit-Palette (`#171a18` / `#202521` / `#282e29`), 1-px-Kanten `#3a423b`, Radius max. 3 px |
| **Trennung** | Linien statt Schatten; Schatten nur für echte Overlays (Modal, mobile Navigation) |
| **Farbe als Signal** | Oliv `#8fa06a` = Intel/bestätigt · Rot `#c4534b` = Angriff · Blau `#5b88b3` = Verteidigung · Gelb `#c8a05a` = Warnung/Utility · Grün `#6f9c7a` = OK |
| **Typografie** | IBM Plex Sans (UI) + IBM Plex Mono (IDs, Werte, Zeitstempel, Labels). Dateien liegen in `public/fonts/`, kein CDN |
| **Abstände** | 4-px-Skala (`--s1` … `--s7`), keine Einzelwerte |
| **Chips** | mono, Versalien, 10,5 px – Statusinformation, kein Dekor |
| **Navigation** | eine Zeile, Aktivzustand als Unterkante; mobil ein ausklappbares Panel |
| **Taktikseite** | Aufbau wie ein Einsatzbriefing: Kopf + Datenleiste → Karte → Lineup (5 Slots als Einheit) → Phasen → Ersatzpicks → Seitenspalte |

**Ohne CDN:** Schriften, Icons und Blueprints liegen im Repo. Der Service Worker cached sie
(`/fonts/` cache-first wie die Build-Assets), damit die App auch offline in der richtigen Schrift läuft.

---

## Tests & Qualitätssicherung

```bash
npm run typecheck    # tsc --noEmit (strict)
npm run validate     # Daten-Validator (Schema, Operatoren, Marker, Assets)
npm run test         # 33 Vitest-Tests
npm run build        # Production-Build + 404.html-Fallback
npm run check:all    # alles zusammen
```

Getestet wird u. a.: Karten-/Operator-/Taktik-Schema, 5 verschiedene Operatoren je Seite, Ersatzpicks
(nie doppelt, nie im Lineup, richtige Seite), Marker-Grenzen, Pflichtfelder von Angriffs-/Verteidigungsplänen,
Ban-Engine (Ersatz, Duplikatverbot, offene Fälle) sowie die Laufzeit-Validierung inkl. Fehlerisolation.

---

## Bedienung der Karte

| Aktion | Desktop | Touch |
|---|---|---|
| Zoomen | Mausrad über der Karte, `+` / `−` | **Zwei Finger auseinanderziehen** (Pinch) |
| Stufe hinein | Doppelklick | Doppeltipp |
| Verschieben | Ziehen mit der Maus | Ziehen mit einem Finger |
| Auf das Setup springen | Button **Fokus** | Button **Fokus** |
| Ganze Karte | Button **Ganz** | Button **Ganz** |

Beim Öffnen einer Taktik zoomt die Karte automatisch auf die Marker, wenn das Setup sonst
nur ein kleiner Klumpen in der Bildmitte wäre (Blueprint 1600 × 900, bebaute Fläche oft kleiner).
Marker und Labels werden **invers zum Zoom skaliert**: gleiche Größe bei 100 % und bei 600 %.

---

## Bekannte Einschränkungen

* Ranked-Pool, Pro-Pool und Siege-Cup-Rotation ändern sich saisonal – immer gegen die aktuelle In-Game-Ankündigung prüfen
  (`meta.json` → `sources`).
* Blueprint-Positionen der Marker sind geschätzt (±3 %), nicht offiziell kalibriert.
* Abdeckung: alle 60 Kombinationen aus 15 Karten × 4 Bombsites haben je **eine** Verteidigungs- und eine Angriffstaktik.
  Weitere Varianten pro Site (z. B. Standard + Aggressiv + Ban-Alternative, wie im Editor möglich) sind vorgesehen,
  aber noch nicht ausgeschrieben.
* Die Karte **Calypso Casino** und die Villa-Site **Art Storage** sind neu (2026) – Taktiken dort sind bewusst als
  `eigene-analyse` mit Datenlücken-Hinweis markiert.
* Kein Mehrspieler-Sync: eigene Taktiken liegen im Browser (Export/Import als JSON als Backup).
* Bilder unterliegen Ubisofts Rechten; das Projekt ist ein inoffizielles Fan-Projekt.

## Lizenz

Code: MIT. Bild-Assets: siehe `public/ASSETS.md` bzw. Einstellungen → Rechtliches. Nicht mit Ubisoft verbunden.


---

## Offline, Installation und Tastatur

**Offline:** Der Service Worker (`public/sw.js`) legt nach dem ersten Besuch HTML, Assets, Karten und Taktiken in
einen versionierten Cache. Danach startet die App auch ohne Netz. Bei einem neuen Deploy zeigt sie oben einen
Hinweis „Neue Version verfügbar“.

**Installieren:**
* Android/Chrome: Menü → „App installieren“
* iPhone/Safari: Teilen → „Zum Home-Bildschirm“
* Desktop: Installations-Symbol in der Adressleiste

**Tastatur-Kürzel** (überall außer in Eingabefeldern): `s`/`/` Schnellmodus, `m` Karten, `a` Angriff,
`v` Verteidigung, `t` Taktiken, `f` Favoriten, `e` Editor, `?` Hilfe.

---

## SSH-Key (kein Passwort, kein Token)

```bash
cd ~/r6-tactical-playbook
bash ssh-setup.sh          # Key ohne Passphrase, Anleitung, Verbindungstest, Remote-Umstellung
```

Von Hand:

```bash
ssh-keygen -t ed25519 -N "" -C "deine@mail.de"
cat ~/.ssh/id_ed25519.pub
# -> https://github.com/settings/keys -> New SSH key -> Authentication Key -> einfuegen
ssh -T git@github.com
git remote set-url origin git@github.com:<DEIN-NAME>/r6-tactical-playbook.git
```

Vollständig mit Fehlertabelle: `ANLEITUNG.md` → Abschnitt 13.

---

## GitHub Pages – Einrichtung und Befehle (Kurzfassung)

```bash
# 1. Repository anlegen (auf github.com) und per SSH verbinden
git init
git add .
git commit -m "R6 Tactical Playbook"
git branch -M main
git remote add origin git@github.com:<DEIN-NAME>/r6-tactical-playbook.git
git push -u origin main

# SSH noch nicht eingerichtet? Einmalig, ohne Passwort-Rückfrage:
bash ssh-setup.sh
# oder von Hand:
ssh-keygen -t ed25519 -N "" -C "deine@mail.de"
cat ~/.ssh/id_ed25519.pub                  # -> github.com/settings/keys -> New SSH key
ssh -T git@github.com                      # muss "successfully authenticated" melden
```

> Details, Passphrase, mehrere Konten und Fehlermeldungen: `ANLEITUNG.md` → **Abschnitt 13 (SSH-Key)**.

2. Im Repo: **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
   (Es gibt dort **keine** Dateiauswahl – GitHub findet `.github/workflows/*.yml` selbst.
   Erscheint der Workflow nicht im Actions-Tab: `bash check-deploy.sh` sagt Dir warum.)
3. Ab jetzt deployt jeder Push auf `main` automatisch (`.github/workflows/deploy.yml`).
4. Adresse: `https://<DEIN-NAME>.github.io/r6-tactical-playbook/`

Der Workflow prüft vor dem Upload, dass `404.html`, `sw.js`, `manifest.webmanifest`, `maps/`, `operators/`
und die Asset-Pfade stimmen – ein kaputter Build wird nicht veröffentlicht.

# So bringst Du das Playbook auf Deinen Rechner und ins Netz

**Gilt für: Linux Mint 21/22 (Cinnamon), Ubuntu 22.04/24.04, Debian 12/13.**
Alle Befehle werden im Terminal eingegeben. Kopiere sie Zeile für Zeile, Enter am Ende jeder Zeile.

Ergebnis am Ende: Das Playbook läuft lokal unter `http://localhost:5173` und ist als
`https://<dein-github-name>.github.io/r6-tactical-playbook/` kostenlos online.

**Was in der App steckt (Stand 12.11.2026, Design v1.4):** 15 Ranked-Karten, 480 Taktiken
(120 Standardpläne + 360 Varianten: aggressiv / defensiv / Ban-Alternative),
78 Operatoren, Schnellmodus, Editor, Ban-System, Favoriten, Offline-Modus.
Alles ohne Konto und ohne Server.

**Inhalt:** 0 Kurzfassung · 1 Voraussetzungen · 2 Git & Node installieren · 3 Projekt holen ·
4 `npm install` · 5 Lokal starten · 6 Git-Repo & Push · 7 GitHub Pages · 8 Updates ·
9 VS Code · 10 Fehlersuche · 11 Backups · 12 Deploy-Befehle (Kurzliste) ·
**13 SSH-Key einrichten** · 14 Spickzettel

---

## 0. Kurzfassung (wenn schon alles installiert ist)

```bash
cd ~/r6-tactical-playbook
npm install
npm run dev
```

Weiter bei **Schritt 6** (Deployment), wenn Du nur deployen willst.

**Nur kurz zum SSH-Key?** → **[Abschnitt 13](#13-ssh-key-einrichten-wenn-git-nach-passwort-fragt)**.
Dann reicht dieser eine Befehl:

```bash
cd ~/r6-tactical-playbook && bash ssh-setup.sh
```

Das Skript macht alles: Key ohne Passphrase erzeugen, Rechte setzen, Zeile zum Kopieren zeigen,
Verbindung testen, HTTPS-Remote automatisch auf SSH umstellen. Von Hand geht es auch:

```bash
ssh-keygen -t ed25519 -N "" -C "deine@mail.de"   # -N "" = keine Passphrase, keine Rueckfrage
cat ~/.ssh/id_ed25519.pub                        # Zeile kopieren
# -> https://github.com/settings/keys -> New SSH key -> einfuegen -> Add SSH key
ssh -T git@github.com                            # "Hi USERNAME! ... successfully authenticated"
```

---

## 1. Voraussetzungen prüfen

Terminal öffnen: `Strg` + `Alt` + `T` (Linux Mint).

```bash
# Versionen anzeigen
git --version
node --version
npm --version
```

Erwartet:

```
git version 2.x
v20.x.x   (oder v22.x.x)
10.x.x
```

Wenn bei `node` „command not found" steht, weiter mit Schritt 2. Sonst weiter mit Schritt 3.

---

## 2. Git und Node.js LTS installieren

```bash
# Paketlisten aktualisieren
sudo apt update

# Git nachinstallieren, falls es fehlt
sudo apt install -y git curl

# Node.js 20 LTS (empfohlen) über das NodeSource-Repo installieren
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Prüfen
node --version    # v20.x.x
npm --version     # 10.x.x
```

> **Alternative:** Über nvm (wenn Du mehrere Node-Versionen brauchst)
> ```bash
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
> source ~/.bashrc
> nvm install --lts
> nvm use --lts
> ```

---

## 3. Projekt auf den Rechner holen

### Variante A: Du hast das Projekt als Ordner/ZIP von mir bekommen

```bash
# ZIP entpacken (Pfad anpassen)
cd ~/Downloads
unzip r6-tactical-playbook.zip -d ~
ls ~/r6-tactical-playbook       # index.html, package.json, src … müssen erscheinen
```

### Variante B: Du klonst später aus Deinem eigenen GitHub-Repo

```bash
cd ~
git clone git@github.com:<DEIN-USER>/r6-tactical-playbook.git
```

---

## 4. Abhängigkeiten installieren

```bash
cd ~/r6-tactical-playbook
npm install
```

Dauer: 30–90 Sekunden. Danach liegt der Ordner `node_modules/` im Projekt (nicht committen, steht in `.gitignore`).

---

## 5. Lokal starten und prüfen

```bash
# Entwicklungsserver (mit Live-Reload)
npm run dev
```

Ausgabe:

```
  VITE v5.4.x  ready in 300 ms
  ➜  Local:   http://localhost:5173/
```

Browser öffnen, `http://localhost:5173/` eintippen. Mit `Strg` + `C` im Terminal beendest Du den Server.

**Vor dem ersten Push einmal alles prüfen:**

```bash
npm run check:all
```

Das führt aus: TypeScript-Check → Datenvalidierung → 33 Tests → Production-Build.
Am Ende muss stehen: `✓ Alle Prüfungen bestanden` und `✓ built in …`.

**Production-Build lokal ansehen:**

```bash
npm run build
npm run preview
# -> http://localhost:4173/
```

---

## 6. Git-Repo anlegen und zu GitHub pushen

### 6.1 Git einmalig konfigurieren

```bash
git config --global user.name "Dein Name"
git config --global user.email "deine@mail.de"
```

### 6.2 Repo auf GitHub erstellen

1. https://github.com/new öffnen.
2. **Repository name:** `r6-tactical-playbook`
3. **Public** wählen (Pages ist bei privaten Repos nur in bezahlten Plänen).
4. **Kein** README, **keine** .gitignore, **keine** Lizenz hinzufügen (das Projekt bringt alles mit).
5. **Create repository**.

### 6.3 Lokales Repo verbinden und pushen

```bash
cd ~/r6-tactical-playbook

# Repo initialisieren
git init
git branch -M main

# Alles hinzufügen und committen
git add .
git commit -m "R6 Tactical Playbook – initialer Stand"

# Mit GitHub verbinden – per SSH (USERNAME ersetzen!)
git remote add origin git@github.com:USERNAME/r6-tactical-playbook.git

# Pushen – danach läuft der Deploy-Workflow automatisch
git push -u origin main
```

> **Warum SSH?** GitHub akzeptiert seit 2021 bei HTTPS keine Passwörter mehr – und Dein
> GitHub-Konto-Passwort funktioniert im Terminal grundsätzlich nie. Deshalb: einmal einen
> SSH-Key anlegen, danach fragt Git nie wieder nach Login.
> Die Schritt-für-Schritt-Einrichtung steht in **Abschnitt 13** weiter unten.

Prüfen, ob der Key schon funktioniert (kommt nur `successfully authenticated`, bist Du fertig):

```bash
ssh -T git@github.com
```

### 6.4 Spätere Änderungen

```bash
cd ~/r6-tactical-playbook
git status
git add -A
git commit -m "Kafe: neue B-Taktik und Marker korrigiert"
git push
```

---

## 7. GitHub Pages aktivieren

1. Repo öffnen → **Settings** (oben rechts).
2. Linke Spalte → **Pages**.
3. Unter *Build and deployment* → **Source: GitHub Actions** auswählen.
4. **Actions**-Tab öffnen: Der Workflow „Deploy to GitHub Pages" läuft jetzt automatisch
   (`npm ci` → `tactics:build` → `validate` → `test` → `build` → Deploy).
5. Nach 1–3 Minuten erscheint im Pages-Menü die URL:
   `https://USERNAME.github.io/r6-tactical-playbook/`

### 7.1 „Ich sehe nirgends deploy.yml" – das ist normal

Bei **Source: GitHub Actions** gibt es **kein** Auswahlfeld für eine Workflow-Datei.
GitHub sucht selbst nach `.github/workflows/*.yml` und zeigt **jeden** gefundenen Workflow
im Reiter **Actions** an. Du wählst dort nichts aus, Du startest höchstens.

Der Workflow erscheint im Actions-Tab **nicht**, wenn eine dieser drei Sachen zutrifft:

| Ursache | Erkennen | Lösung |
|---|---|---|
| Datei nie committet | `git ls-files .github/workflows` ist leer | `git add .github/workflows/deploy.yml && git commit -m "ci" && git push` |
| Datei liegt auf anderem Branch | Default-Branch ist `master`, Datei nur auf `main` | `git branch -M main && git push -u origin main`, dann Settings → Branches → Default branch → `main` |
| Ordner/Tippfehler | Ordner ist `.github/workflow` (ohne s) oder Datei `.yaml` | exakt `.github/workflows/deploy.yml` |

Prüf-Skript (läuft lokal, sagt Dir welche Ursache es ist):

```bash
cd ~/r6-tactical-playbook
bash check-deploy.sh
```

Es testet: Repo vorhanden, Datei getrackt, Remote, Default-Branch auf GitHub,
und ob `deploy.yml` auf dem Default-Branch liegt – inklusive der passenden Befehle.

**Workflow von Hand starten:** Actions → links **„Deploy to GitHub Pages"** →
rechts **„Run workflow"** → `main` → grün. Fehlt der Button, ist der Default-Branch
nicht `main` (GitHub zeigt „Run workflow" nur auf dem Default-Branch).

**Direktlink:** `https://github.com/USERNAME/r6-tactical-playbook/actions/workflows/deploy.yml`
– ein **404** dort heißt: Datei liegt nicht auf dem Default-Branch.

---

**Begründung für die Base-Path-Magie:** Der Workflow setzt `BASE_PATH=/r6-tactical-playbook/`,
damit alle JS/CSS/Bilder im Unterpfad gefunden werden. Unterseiten wie
`…/r6-tactical-playbook/map/bank/attack` funktionieren nach einem Reload, weil der Build
`dist/404.html` als Kopie der `index.html` erzeugt.

**Testen:**

```bash
# Prüfen, ob die Seite antwortet
curl -I https://USERNAME.github.io/r6-tactical-playbook/
```

Danach direkt im Browser auf der Seite: Favorit setzen, Seite neu laden → Favorit bleibt (localStorage).

---

## 8. Alles wieder auffrischen (nach Updates)

```bash
cd ~/r6-tactical-playbook
git pull                      # falls Du auf mehreren Rechnern arbeitest
npm install                   # neue Abhängigkeiten
npm run tactics:build         # Taktikpläne -> JSON
npm run check:all             # alle Checks
git add -A && git commit -m "Update" && git push
```

---

## 9. VS Code (optional)

```bash
# Installation über die Anwendungsverwaltung oder:
sudo snap install code --classic

cd ~/r6-tactical-playbook
code .
```

Empfohlene Erweiterungen (Strg+Shift+X, Namen suchen):

* **ESLint**
* **Prettier – Code formatter**
* **German Language Pack**
* **Vitest** (Test-Explorer)

Nützlich: `Strg` + `ö` öffnet das integrierte Terminal direkt im Projektordner.

---

## 10. Fehlersuche

| Problem | Ursache | Lösung |
|---|---|---|
| `npm: command not found` | Node fehlt | Schritt 2 |
| `EACCES: permission denied` bei `npm install` | Projekt liegt in `/usr/...` | Projekt nach `~/` verschieben |
| `Port 5173 is in use` | alter Dev-Server läuft noch | `npx kill-port 5173` oder `sudo lsof -i :5173` und PID beenden |
| Seite bleibt weiß | JS-Fehler | `F12` → Console; meist fehlt `npm install` nach einem Pull |
| Bilder 404 auf GitHub Pages, lokal aber ok | falscher `base` | Workflow prüfen: `BASE_PATH=/<repo>/` muss gesetzt sein |
| Reload auf Unterseite → 404 | `404.html` fehlt | `npm run build` erneut ausführen (Script kopiert `index.html` → `404.html`) |
| Workflow rot, „npm ci" scheitert | `package-lock.json` nicht committet | `git add package-lock.json && git commit && git push` |
| Workflow rot, „validate" scheitert | Datenfehler | lokal `npm run validate` ausführen – es steht die Datei und das Feld in der Meldung |
| Push abgelehnt („rejected") | Remote hat Commits | `git pull --rebase origin main` dann erneut pushen |
| Login schlägt fehl / fragt nach Passwort | GitHub nimmt kein Passwort an | SSH-Key einrichten → **Abschnitt 13** |
| `Permission denied (publickey)` | Key nicht bei GitHub hinterlegt | `ssh -T git@github.com` testen, Key in GitHub eintragen (Abschnitt 13) |
| `Host key verification failed` | neuer/wechselnder Host-Key | `ssh-keygen -R github.com`, dann Verbindung neu bestätigen |
| Karte ohne Blueprint | Bilddatei fehlt | `npm run assets:fetch` oder Datei unter `public/maps/<map>/floor-<etage>.webp` ablegen |
| Operator ohne Icon | neuer Operator | Icon als SVG in `public/operators/<slug>.svg` – sonst zeigt die App Initialen |

Logs ansehen:

```bash
# letzte Build-/Testausgabe
npm run check:all 2>&1 | tee check.log

# Git-Historie kompakt
git log --oneline --graph -10
```

---

## 11. Eigene Taktiken sichern

Eigene Taktiken, Favoriten und Bans liegen **im Browser** (localStorage), nicht im Repo.

* **Backup:** Einstellungen → „Backup exportieren (inkl. Taktiken)" → JSON-Datei speichern.
* **Wiederherstellen:** Einstellungen → „Roster importieren" bzw. Editor → „JSON importieren".
* **Dauerhaft im Repo:** eine Taktik aus dem Editor als JSON exportieren, in `scripts/plans/` als `.mjs`
  einpflegen (Format siehe `scripts/plans/README.md`), dann `npm run tactics:build`.


---

## 12. GitHub Pages: die genauen Befehle

Diese Befehle brauchst Du nur einmal, danach reicht `git add` / `git commit` / `git push`.

```bash
# Im Projektordner
cd ~/r6-tactical-playbook

# 1. Git einrichten (nur beim ersten Mal)
git init
git add .
git commit -m "R6 Tactical Playbook: Karten, Taktiken, Varianten, Offline-Modus"

# 2. Hauptbranch auf main umbenennen
git branch -M main

# 3. Eigenes GitHub-Repo verbinden – per SSH (Namen ersetzen!)
git remote add origin git@github.com:DEIN-NAME/r6-tactical-playbook.git
git push -u origin main
```

> Beim ersten Push fragt Git nicht nach Passwort, sondern nutzt Deinen SSH-Key.
> Noch kein Key eingerichtet? Dann zuerst **Abschnitt 13** abarbeiten (5 Minuten).

**Pages aktivieren (Klick-Weg, kein Befehl):**

1. GitHub → Dein Repo → **Settings**
2. Linke Spalte → **Pages**
3. Unter „Build and deployment“ → **Source: GitHub Actions**
4. Warten, bis unter **Actions** der grüne Haken bei „Deploy to GitHub Pages“ erscheint
5. Adresse öffnen: `https://DEIN-NAME.github.io/r6-tactical-playbook/`

**Optional per GitHub-CLI** (wenn `gh` installiert ist):

```bash
gh auth login
gh repo create r6-tactical-playbook --public --source=. --remote=origin --push
gh api -X POST repos/:owner/r6-tactical-playbook/pages -f build_type=workflow
```

### Spätere Änderungen veröffentlichen

```bash
cd ~/r6-tactical-playbook
npm run check:all          # Typen, Daten, Tests, Build – muss grün sein
git add .
git commit -m "Kurze Beschreibung der Änderung"
git push                   # löst automatisch den Deploy-Workflow aus
```

### Wenn der Deploy fehlschlägt

| Meldung im Actions-Log | Ursache | Lösung |
|---|---|---|
| `dist/404.html fehlt` | Build ohne Fallback-Schritt | `npm run build` lokal testen, `scripts/make-spa-fallback.mjs` prüfen |
| `Asset-Pfade fehlen` | `BASE_PATH` nicht gesetzt | Workflow nutzt automatisch `/<repo-name>/` – Repo umbenannt? Workflow erneut laufen lassen |
| `Pages ... not enabled` | Source nicht auf Actions | Settings → Pages → Source: **GitHub Actions** |
| Seite leer, Konsole zeigt 404 auf `./assets/...` | Build mit relativer base | immer über den Workflow deployen, nicht `dist/` manuell hochladen |
| `git push` fragt nach Passwort | Remote ist HTTPS | auf SSH umstellen: Abschnitt 13.6 |
| Alter Stand sichtbar | Service-Worker-Cache | Einstellungen → „App aktualisieren & neu laden“, oder Strg+F5 |

### Offline-Funktion prüfen

1. Seite einmal komplett laden (alle Karten/Taktiken durchklicken hilft dem Cache).
2. In den Entwicklertools (`F12`) → **Network** → Häkchen bei **Offline**.
3. Seite neu laden – das Playbook muss weiter funktionieren.
4. Auf dem Handy: Menü → „Zum Startbildschirm hinzufügen“ → App startet ohne Browser-Leiste.

---

## 13. SSH-Key einrichten (wenn Git nach Passwort fragt)

Ziel: `git push` funktioniert ohne jede Eingabe. Einmal machen, hält jahrelang.
Das ist der offizielle GitHub-Weg und braucht **kein** Passwort und **kein** Token.

### 13.0 Der Ein-Befehl-Weg (empfohlen)

Im Projektordner liegt das fertige Skript. Es erzeugt den Key **ohne jede Passphrase-Frage**
(`ssh-keygen ... -N ""`), setzt die richtigen Rechte, zeigt die Zeile zum Kopieren,
wartet auf Enter und testet die Verbindung:

```bash
cd ~/r6-tactical-playbook
bash ssh-setup.sh
```

Ablauf: Zeile kopieren → <https://github.com/settings/keys> → *New SSH key* → einfügen →
*Add SSH key* → im Terminal Enter drücken. Das Skript meldet am Ende entweder
`successfully authenticated` (fertig) oder die konkrete Ursache.

### 13.1 Prüfen, ob schon ein Key existiert

```bash
ls -la ~/.ssh
# Zeigt es Dateien id_ed25519 und id_ed25519.pub? -> Key existiert, weiter mit 13.3
```

### 13.2 Neuen Key erzeugen (nur wenn keiner da ist)

**Variante ohne jede Rückfrage** – das ist die, die Du willst:

```bash
ssh-keygen -t ed25519 -N "" -C "deine@mail.de" -f ~/.ssh/id_ed25519
```

`-N ""` bedeutet „Passphrase ist leer“ und `-f` gibt den Pfad vor. Damit stellt
`ssh-keygen` **keine einzige Frage** und schreibt den Key direkt weg.
Es erscheint nur noch eine Grafik (`+---[RSA 3072]----+` …) – die ist Dekoration, kein Prompt.

**Variante interaktiv** (falls Du die Fragen magst): `ssh-keygen -t ed25519 -C "deine@mail.de"`
→ bei *„Enter file in which to save the key“* **Enter** → bei *„Enter passphrase“* **Enter**
→ bei *„Enter same passphrase again“* **Enter**.

Wichtig: Die Passphrase ist **nicht** Dein GitHub-Passwort, sondern nur ein Schutz für die
Key-Datei. Mit leerer Passphrase wirst Du nie wieder etwas eingeben müssen.
Wer eine Passphrase setzt, braucht `ssh-agent` (siehe 13.5).

### 13.3 Schlüssel bei GitHub hinterlegen

```bash
# öffentlichen Schlüssel anzeigen und in die Zwischenablage kopieren
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard     # Linux Mint / X11
# ohne xclip: cat ~/.ssh/id_ed25519.pub   -> Zeile von Hand markieren und kopieren
```

1. https://github.com/settings/keys öffnen
2. **New SSH key** anklicken
3. **Title:** z. B. `Linux Mint Laptop`
4. **Key type:** `Authentication Key`
5. **Key:** die kopierte Zeile einfügen (sie beginnt mit `ssh-ed25519 …` und endet mit Deiner E-Mail)
6. **Add SSH key**

> Nur die Datei mit `.pub` (öffentlicher Schlüssel) wird hochgeladen.
> Die Datei **ohne** `.pub` ist der private Schlüssel und bleibt ausschließlich auf Deinem Rechner.

### 13.4 Verbindung testen

```bash
ssh -T git@github.com
```

Erwartete Ausgabe:

```
Hi USERNAME! You've successfully authenticated, but GitHub does not provide shell access.
```

Beim allerersten Mal kommt vorher die Frage
`Are you sure you want to continue connecting (yes/no/[fingerprint])?` → **yes** eintippen.

### 13.5 Falls Du eine Passphrase gesetzt hast

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519        # Passphrase einmal eingeben, fertig für diese Sitzung
```

Dauerhaft: In Linux Mint unter *Einstellungen → Anmeldung* bzw. im Autostart
`ssh-add` eintragen, oder in `~/.profile` ans Ende:

```bash
eval "$(ssh-agent -s)" >/dev/null
ssh-add -l >/dev/null 2>&1 || ssh-add ~/.ssh/id_ed25519 </dev/null
```

### 13.6 Remote auf SSH umstellen

Falls das Repo schon mit `https://…` verbunden ist (also nach Passwort fragt), reicht ein Befehl:

```bash
cd ~/r6-tactical-playbook

# aktuelle Adresse ansehen
git remote -v

# auf SSH umstellen (USERNAME ersetzen)
git remote set-url origin git@github.com:USERNAME/r6-tactical-playbook.git

# nochmal prüfen
git remote -v
# origin  git@github.com:USERNAME/r6-tactical-playbook.git (fetch/push)
```

Danach normal weiterarbeiten:

```bash
git push -u origin main
```

### 13.7 Mehrere GitHub-Konten auf einem Rechner (optional)

Wenn Du privat und geschäftlich mit verschiedenen Konten arbeitest, lege einen zweiten Key an
und trage ihn in `~/.ssh/config` ein:

```bash
nano ~/.ssh/config
```

```sshconfig
Host github-privat
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519

Host github-firma
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_firma
```

Die Remote-Adresse nutzt dann den Alias:

```bash
git remote set-url origin git@github-privat:USERNAME/r6-tactical-playbook.git
```

### 13.8 Häufige SSH-Fehler

| Meldung | Bedeutung | Lösung |
|---|---|---|
| `Permission denied (publickey)` | GitHub kennt Deinen Key nicht | 13.3 wiederholen, `ssh -T git@github.com` testen |
| `Could not open a connection to your authentication agent` | `ssh-agent` läuft nicht | `eval "$(ssh-agent -s)"`, dann `ssh-add` |
| `Bad permissions` / `UNPROTECTED PRIVATE KEY FILE` | Rechte zu offen | `chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_ed25519` |
| `Host key verification failed` | Host-Key geändert | `ssh-keygen -R github.com`, Verbindung neu bestätigen |
| `remote: Repository not found` | falscher Nutzername/Repo-Name | `git remote -v` und GitHub-URL vergleichen |
| Push landet unter falschem Konto | `user.email` falsch | `git config --global user.email "deine@mail.de"` |

**Sicherheitshinweis:** den privaten Schlüssel (`id_ed25519`, **ohne** `.pub`) niemals verschicken,
niemals ins Repo legen und niemals in eine Website eintragen. Er bleibt in `~/.ssh/`.

---

## 14. Spickzettel: die 10 Befehle, die Du wirklich brauchst

```bash
# Projekt holen
cd ~/r6-tactical-playbook

# Einmalig: Git-Identität
git config --global user.name "Dein Name"
git config --global user.email "deine@mail.de"

# Einmalig: SSH-Key
ssh-keygen -t ed25519 -C "deine@mail.de"
cat ~/.ssh/id_ed25519.pub                 # -> github.com/settings/keys
ssh -T git@github.com

# Einmalig: Repo verbinden
git init && git branch -M main && git add . && git commit -m "Initial"
git remote add origin git@github.com:USERNAME/r6-tactical-playbook.git
git push -u origin main

# Lokal starten / prüfen
npm install && npm run dev                # http://localhost:5173
npm run check:all                         # Typen, Daten, Tests, Build

# Änderung veröffentlichen
git add -A && git commit -m "Was sich geändert hat" && git push

# Nach dem Push: GitHub -> Actions grün? -> https://USERNAME.github.io/r6-tactical-playbook/
```

# Pushen — Kurzanleitung für den Ordner-Austausch

Du hast den alten Projektordner durch den neuen ersetzt. Es gibt zwei Fälle.
**Prüfe zuerst, ob der Ordner noch ein `.git` hat:**

```bash
cd ~/r6-tactical-playbook
ls -a | grep -x .git
```

* **Ausgabe `.git`** → **Fall A** (Historie vorhanden, ganz normaler Push)
* **keine Ausgabe** → **Fall B** (Ordner ist frisch, Repo muss neu verbunden werden)

---

## Fall A — `.git` ist noch da (alter Ordner überschrieben, nicht gelöscht)

```bash
cd ~/r6-tactical-playbook

# Abhängigkeiten des neuen Ordners installieren
npm install

# Alles prüfen (Typen, Daten, 63 Tests, Build) – muss grün sein
npm run check:all

# Was hat sich geändert?
git status --short

# Committen und pushen
git add -A
git commit -m "Redesign v1.4: Field-Manual-Design, Pinch-Zoom, inverse Marker-Skalierung"
git push
```

---

## Fall B — kein `.git` (Ordner komplett neu)

```bash
cd ~/r6-tactical-playbook

npm install
npm run check:all

# Repo neu aufsetzen (SSH, kein Passwort)
git init
git branch -M main
git remote add origin git@github.com/DEIN-NAME/r6-tactical-playbook.git

# Prüfen, ob der Key sitzt
ssh -T git@github.com

git add .
git commit -m "Redesign v1.4: Field-Manual-Design, Pinch-Zoom, inverse Marker-Skalierung"

# WICHTIG: Der neue Ordner hat keine Historie. Der alte Stand liegt noch auf GitHub,
# deshalb wird der erste Push einmalig überschrieben:
git push -u origin main --force
```

> `--force` ist hier unkritisch: Es ist Dein eigenes Repo, und der neue Stand ist
> vollständig. Es wird nichts gelöscht, was Du brauchst – nur die alte Historie ersetzt.
> Ohne `--force` bekommst Du `! [rejected] ... (fetch first)`.

**Alternative ohne `--force`** (Historie bleibt erhalten, ist aber fummeliger):

```bash
git pull --rebase origin main --allow-unrelated-histories
git push -u origin main
```

Das erzeugt beim Rebase Konflikte in fast allen Dateien, weil beide Seiten dieselben
Dateien angefasst haben. Nimm `--force`.

---

## Nach dem Push prüfen

1. **Actions-Tab:** <https://github.com/DEIN-NAME/r6-tactical-playbook/actions>
   Der Workflow „Deploy to GitHub Pages" muss grün werden (Dauer: 1–3 Minuten).
   Er läuft `npm ci` → `tactics:build` → `validate` → `test` → `build` → Deploy.

2. **Seite öffnen und hart neu laden:**
   <https://DEIN-NAME.github.io/r6-tactical-playbook/>
   `Strg` + `Shift` + `R` — oder in der App: **Einstellungen → App aktualisieren & neu laden**.
   Grund: Der alte Service Worker hält sonst das alte CSS/JS im Cache. Der neue Cache
   heißt `r6pb-v1.4.0` und räumt den alten beim ersten Laden selbst weg.

3. **Kurz gegenprüfen:**
   * Schriften: Entwicklertools (`F12`) → **Network** → nach `woff2` filtern → 7 Dateien, alle 200
   * Karte: Handy → zwei Finger auseinanderziehen → Zoom läuft
   * Marker: bei 600 % immer noch gleich groß
   * Taktikseite: Kopf heißt „EINSATZBRIEFING", Lineup ist eine geschlossene Liste

---

## Wenn etwas hakt

| Meldung | Ursache | Lösung |
|---|---|---|
| `! [rejected] ... (fetch first)` | Remote hat Commits, die lokal fehlen | `git push -u origin main --force` |
| `Permission denied (publickey)` | Key nicht bei GitHub | `bash ssh-setup.sh` |
| Actions rot: `npm ci` scheitert | `package-lock.json` nicht mitgepusht | `git add package-lock.json && git commit -m "lock" && git push` |
| Actions rot: `validate` scheitert | Datenfehler | lokal `npm run validate`, Meldung nennt Datei und Feld |
| Seite zeigt alten Stand | Service-Worker-Cache | `Strg+Shift+R` oder Einstellungen → „App aktualisieren" |
| Schriften sehen falsch aus (nur auf Pages) | Build ohne `BASE_PATH` | nicht lokal hochladen — immer über den Workflow deployen |
| Seite leer, 404 auf `/assets/...` | `dist/` manuell hochgeladen | `git rm -r --cached dist` und Workflow nutzen |

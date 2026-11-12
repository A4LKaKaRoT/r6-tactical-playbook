# Pushen — ohne Ordner-Austausch

Das Redesign ändert viele Dateien, aber es gibt keinen Grund, den ganzen Ordner zu ersetzen.
Der `.git`-Ordner ist deine Historie und dein Remote — der bleibt einfach liegen.

## Der einfache Weg: Update einspielen, dann ganz normal committen

```bash
cd ~/r6-tactical-playbook          # dein bestehendes Repo
git pull                            # erst auf Stand bringen
bash ~/Downloads/update-redesign-v2/update.sh .    # neue Dateien einspielen
git diff --cached --stat            # was hat sich geändert? (nur anschauen)
git commit -m "Redesign 2.0: AAA-Optik, 16:9-Kacheln, Mobile-Fixes"
git push
```

Das Skript macht genau vier Dinge:

1. prüft, dass ein `.git` da ist und **nichts Ungespeichertes** herumliegt,
2. setzt ein Sicherheitsnetz (Tag `vor-redesign-JJJJMMTT-HHMM`),
3. kopiert die neuen Dateien über die alten und löscht nur die Dateien,
   die es im neuen Stand nicht mehr gibt,
4. zeigt dir die Änderungsliste. Committet wird **nicht** automatisch
   (außer du hängst `--commit` an).

## Rollback, falls etwas komisch aussieht

```bash
git tag | grep vor-redesign        # Namen des Sicherheitsnetzes
git reset --hard vor-redesign-20261112-2011
```

## Warum kein Patch?

Ein `.patch` wäre noch schlanker, setzt aber die exakte alte Dateiversion voraus.
Wenn dein Repo-Stand auch nur leicht abweicht (eine Zeile, eine andere Formatierung),
scheitert der Patch bei jeder betroffenen Datei. Das Kopieren ist da robuster:
es ist egal, wie viele Dateien sich geändert haben.

## Wenn kein `.git` mehr da ist

Dann hilft nur einmalig: Repo neu klonen, `files/`-Inhalt hineinkopieren, committen, pushen.

```bash
git clone git@github.com:A4LKaKaRoT/r6-tactical-playbook.git
cp -R ~/Downloads/update-redesign-v2/files/. r6-tactical-playbook/
cd r6-tactical-playbook && npm ci && npm run check:all
git add -A && git commit -m "Redesign 2.0" && git push
```

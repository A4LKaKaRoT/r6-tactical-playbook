#!/usr/bin/env bash
# Findet heraus, warum der GitHub-Pages-Workflow nicht erscheint/laeuft.
# Aufruf:  bash check-deploy.sh
set -u
export GIT_TERMINAL_PROMPT=0

say() { printf '%s\n' "$*"; }
hr()  { printf '%s\n' "------------------------------------------------------------"; }
ok()  { printf '  [OK]   %s\n' "$*"; }
bad() { printf '  [FEHLT] %s\n' "$*"; }

hr
say "1) Wo bin ich?"
hr
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  say "  Hier ist kein Git-Repo. Bitte zuerst:"
  say "     cd ~/r6-tactical-playbook"
  exit 1
fi
say "  Ordner: $(pwd)"
BRANCH="$(git branch --show-current 2>/dev/null)"
say "  Aktueller Branch: ${BRANCH:-<keiner>}"
say "  Letzte Commits:"
git log --oneline -3 2>/dev/null | sed 's/^/    /'

hr
say "2) Ist die Workflow-Datei im Repo?"
hr
FILE=".github/workflows/deploy.yml"
if [ -f "$FILE" ]; then ok "Datei existiert lokal: $FILE"; else bad "Datei fehlt lokal: $FILE"; fi
if git ls-files --error-unmatch "$FILE" >/dev/null 2>&1; then
  ok "Datei ist von Git versioniert (getrackt)"
else
  bad "Datei ist NICHT getrackt -> sie wurde nie committet"
fi
if git status --porcelain -- .github 2>/dev/null | grep -q .; then
  bad "Es gibt ungestagte Aenderungen unter .github/:"
  git status --porcelain -- .github | sed 's/^/    /'
else
  ok "Keine offenen Aenderungen unter .github/"
fi
say "  Dateien, die Git unter .github/workflows kennt:"
git ls-files .github/workflows 2>/dev/null | sed 's/^/    /' || true
say "  (Wichtig: der Ordner muss genau .github/workflows heissen, Datei auf .yml enden)"

hr
say "3) Gibt es ein Remote (GitHub) und welche Branches hat es?"
hr
REMOTE="$(git remote get-url origin 2>/dev/null || true)"
if [ -z "$REMOTE" ]; then
  bad "Kein Remote 'origin' gesetzt"
  say "    Loesung: git remote add origin git@github.com:DEIN-NAME/r6-tactical-playbook.git"
  exit 0
fi
ok "origin = $REMOTE"

# owner/repo aus SSH- oder HTTPS-URL ziehen
SLUG="$(printf '%s' "$REMOTE" | sed -E 's#^git@github.com:##; s#^https://github.com/##; s#\.git$##')"
OWNER="${SLUG%%/*}"
REPO="${SLUG##*/}"
say "  -> Repo: $OWNER/$REPO"
case "$REMOTE" in
  *github.com*) : ;;
  *) say "  [!!] Das ist keine github.com-Adresse."; say "       In diesem Fall greifen die Links unten nicht - vergleiche selbst mit dem Browser." ;;
esac
say "  Workflow-Seite im Browser:"
say "     https://github.com/$OWNER/$REPO/actions/workflows/deploy.yml"
say "  (404 = Datei liegt nicht auf dem Default-Branch)"

say ""
say "  Frage GitHub nach dem Default-Branch ..."
SYMREF="$(timeout 25 git ls-remote --symref origin HEAD 2>/dev/null | head -1 || true)"
DEFBR=""
case "$SYMREF" in
  ref:*) DEFBR="$(printf '%s' "$SYMREF" | sed -E 's#^ref: refs/heads/([^[:space:]]+).*#\1#')" ;;
esac
# Fallback: HEAD-Zeile ohne symref-Info (aeltere Server) -> nichts, dann raten
if [ -z "$DEFBR" ]; then
  for cand in main master; do
    if timeout 20 git ls-remote --exit-code --heads origin "$cand" >/dev/null 2>&1; then
      DEFBR="$cand"; break
    fi
  done
fi
if [ -n "$DEFBR" ]; then
  ok "Default-Branch auf GitHub: $DEFBR"
else
  say "  [??] Konnte den Default-Branch nicht abfragen (SSH/Netz?)."
  say "       Teste:  ssh -T git@github.com"
fi

say ""
say "  Branches auf GitHub:"
timeout 25 git ls-remote --heads origin 2>/dev/null | sed -E 's#.*refs/heads/#    #' || say "    (Abfrage fehlgeschlagen)"

hr
say "4) Liegt deploy.yml auf dem Default-Branch?"
hr
if ! timeout 30 git fetch --quiet origin 2>/dev/null; then
  say "  [??] git fetch fehlgeschlagen (weiter mit lokalen Daten)"
fi
if [ -n "$DEFBR" ] && git rev-parse --verify "origin/$DEFBR" >/dev/null 2>&1; then
  if git ls-tree -r --name-only "origin/$DEFBR" 2>/dev/null | grep -qx "$FILE"; then
    ok "deploy.yml liegt auf origin/$DEFBR"
    WF_ON_REMOTE=1
  else
    bad "deploy.yml liegt NICHT auf origin/$DEFBR -> Workflow kann nicht starten"
    WF_ON_REMOTE=0
  fi
else
  say "  [??] Remote-Branch nicht lokal vorhanden, pruefe mit git push"
  WF_ON_REMOTE=0
fi

hr
say "5) Ergebnis"
hr
if [ "${WF_ON_REMOTE:-0}" = "1" ]; then
  say "Alles liegt richtig. Der Workflow MUSS jetzt im Actions-Tab stehen:"
  say "   https://github.com/$OWNER/$REPO/actions/workflows/deploy.yml"
  say ""
  say "Wenn dort nichts laeuft, starte ihn von Hand:"
  say "   Actions -> links 'Deploy to GitHub Pages' -> rechts 'Run workflow' -> main -> gruen"
  say ""
  say "Wenn der Button 'Run workflow' fehlt, ist der Default-Branch nicht main:"
  say "   Settings -> Branches -> Default branch -> main  (dann Seite neu laden)"
  say ""
  say "Und pruefen: Settings -> Pages -> Source = 'GitHub Actions' (nicht 'Deploy from a branch')."
else
  say "Die Datei ist (noch) nicht auf dem Default-Branch. So behebst Du es:"
  say ""
  if [ "$BRANCH" != "main" ] && [ -n "$BRANCH" ]; then
    say "   A) Branch umbenennen und pushen:"
    say "      git branch -M main"
    say "      git push -u origin main"
    say "      dann auf GitHub: Settings -> Branches -> Default branch -> main"
  fi
  say "   B) Datei hinzufuegen und pushen:"
  say "      git add .github/workflows/deploy.yml"
  say "      git commit -m \"ci: GitHub-Pages-Workflow\""
  say "      git push"
  say ""
  say "   C) Ohne Terminal (Browser):"
  say "      https://github.com/$OWNER/$REPO/new/main"
  say "      Dateiname:  .github/workflows/deploy.yml"
  say "      Inhalt aus Deiner lokalen Datei einfuegen -> 'Commit changes'"
fi
say ""

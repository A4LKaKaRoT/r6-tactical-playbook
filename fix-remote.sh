#!/usr/bin/env bash
# Prüft die Remote-URL auf typische Copy-Paste-Schäden und repariert sie.
set -u
REPO="${1:-git@github.com:A4LKaKaRoT/r6-tactical-playbook.git}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "FEHLER: Hier ist kein Git-Repo. Erst:  cd ~/Documents/r6-tactical-playbook"
  exit 1
fi

CUR="$(git remote get-url origin 2>/dev/null || echo '')"
echo "Aktuell: ${CUR:-<kein origin>}"

case "$CUR" in
  "$REPO") echo "OK - URL ist korrekt.";;
  *) echo "-> setze URL neu"; git remote set-url origin "$REPO" 2>/dev/null || { git remote remove origin 2>/dev/null; git remote add origin "$REPO"; };;
esac

NEW="$(git remote get-url origin)"
echo "Jetzt:   $NEW"
case "$NEW" in
  *'['*|*']'*|*'('*|*')'*) echo "IMMER NOCH KAPUTT - bitte Zeile ohne Markdown kopieren"; exit 1;;
esac
echo
echo "Remote gesetzt. Nächster Befehl:"
echo "  git push -u origin main"
echo
echo "Tipp: Arbeite im Ordner, in dem das Repo liegt:"
echo "  cd ~/Documents/r6-tactical-playbook"

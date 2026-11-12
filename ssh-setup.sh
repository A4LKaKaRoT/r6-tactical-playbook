#!/usr/bin/env bash
# R6 Tactical Playbook - SSH-Key in 2 Minuten einrichten (kein Passwort, kein Token).
# Aufruf:  bash ssh-setup.sh
set -u

KEY="$HOME/.ssh/id_ed25519"
echo "== SSH-Key fuer GitHub einrichten =="
echo

mkdir -p "$HOME/.ssh" 2>/dev/null
chmod 700 "$HOME/.ssh" 2>/dev/null

if [ -f "$KEY" ]; then
  echo "-> Es gibt schon einen Key: $KEY (wird nicht ueberschrieben)"
else
  echo "-> Erzeuge neuen Key, OHNE Passphrase (es kommt keine Passwort-Frage)..."
  ssh-keygen -t ed25519 -N "" -C "$(hostname)-r6pb" -f "$KEY" >/dev/null || {
    echo "FEHLER: ssh-keygen ist fehlgeschlagen. Ist openssh-client installiert?"
    echo "  sudo apt install openssh-client"
    exit 1
  }
  echo "   fertig."
fi
chmod 600 "$KEY" 2>/dev/null
chmod 644 "$KEY.pub" 2>/dev/null

echo
echo "=================== DIESE ZEILE KOMPLETT KOPIEREN ==================="
cat "$KEY.pub"
echo "===================================================================="
echo
echo "Naechste Schritte:"
echo "  1) https://github.com/settings/keys im Browser oeffnen"
echo "  2) 'New SSH key' klicken"
echo "  3) Title:   $(hostname)"
echo "     Key type: Authentication Key"
echo "     Key:      die Zeile von oben einfuegen"
echo "  4) 'Add SSH key' klicken"
echo
printf "Enter druecken, wenn der Key bei GitHub gespeichert ist... "
read -r _ || true

echo
echo "-> Teste Verbindung zu GitHub..."
OUT="$(ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes -T git@github.com 2>&1)"
echo "   $OUT"
echo

case "$OUT" in
  *"successfully authenticated"*)
    echo "OK - SSH funktioniert, es wird nie wieder nach einem Passwort gefragt."
    echo
    if git rev-parse --git-dir >/dev/null 2>&1; then
      URL="$(git remote get-url origin 2>/dev/null || true)"
      case "$URL" in
        https://github.com/*)
          REPO="${URL#https://github.com/}"
          REPO="${REPO%.git}"
          git remote set-url origin "git@github.com:${REPO}.git"
          echo "-> Remote umgestellt: git@github.com:${REPO}.git"
          ;;
        "")
          echo "-> Kein Remote gesetzt. Naechster Befehl:"
          echo "   git remote add origin git@github.com:USERNAME/r6-tactical-playbook.git"
          ;;
        *)
          echo "-> Remote zeigt bereits auf: $URL"
          ;;
      esac
      echo
      echo "-> Jetzt pushen:   git push -u origin main"
    else
      echo "-> Du bist nicht in einem Git-Repo. Erst:  cd ~/r6-tactical-playbook"
    fi
    ;;
  *)
    echo "NOCH KEINE VERBINDUNG. Die drei haeufigsten Ursachen:"
    echo "  a) Der Key wurde bei GitHub nicht gespeichert (Schritt 2-4 nochmal)"
    echo "  b) Du bist mit dem falschen GitHub-Konto eingeloggt"
    echo "  c) Port 22 ist blockiert (Firmennetz/Uni). Dann in ~/.ssh/config eintragen:"
    echo
    echo "     Host github.com"
    echo "       HostName ssh.github.com"
    echo "       Port 443"
    echo "       User git"
    echo
    echo "     Und danach erneut:  ssh -T git@github.com"
    ;;
esac

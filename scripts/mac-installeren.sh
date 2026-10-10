#!/bin/bash
# Zet Jarvis op een Mac: eigen Python-omgeving, afhankelijkheden, en automatisch starten bij inloggen.
# Gebruik:  scripts/mac-installeren.sh            installeren
#           scripts/mac-installeren.sh --droog    alleen laten zien wat er zou gebeuren
#           scripts/mac-installeren.sh --verwijder  weer weghalen
# Er komt nooit een sleutel in een bestand: inloggen doe je zelf met `claude`.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="nl.noordster.jarvis"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG="$HOME/Library/Logs/noordster-jarvis.log"
VENV="$REPO/.venv"
MODUS="${1:-installeren}"
DROOG=0; [ "$MODUS" = "--droog" ] && DROOG=1

fout() { echo "STOP: $1" >&2; exit 1; }
doe() { if [ "$DROOG" = 1 ]; then echo "[droog] $*"; else "$@"; fi; }

if [ "$(uname)" != "Darwin" ] && [ -z "${NOORDSTER_MAC_TEST:-}" ]; then
  fout "Dit script is voor een Mac."
fi

maak_plist() {
  cat <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>$VENV/bin/python</string><string>-m</string><string>jarvis</string></array>
  <key>WorkingDirectory</key><string>$REPO</string>
  <key>EnvironmentVariables</key>
  <dict><key>PATH</key><string>$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string></dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><false/>
  <key>StandardOutPath</key><string>$LOG</string>
  <key>StandardErrorPath</key><string>$LOG</string>
</dict>
</plist>
EOF
}

if [ "$MODUS" = "--verwijder" ]; then
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  rm -f "$PLIST"
  echo "Weggehaald: automatisch starten. De map $VENV blijft staan (verwijder die zelf als je wilt)."
  exit 0
fi

# 1. Python 3.10 of nieuwer
PY=""
for k in python3.13 python3.12 python3.11 python3.10 python3; do
  p="$(command -v "$k" 2>/dev/null || true)"
  [ -n "$p" ] && "$p" -c 'import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)' && { PY="$p"; break; }
done
[ -n "$PY" ] || fout "Geen Python 3.10 of nieuwer gevonden. Installeer Python van python.org/downloads (het .pkg-bestand) en start dit script opnieuw."

# 2. Claude Code moet er zijn en jij moet ingelogd zijn
command -v claude >/dev/null 2>&1 || [ -x "$HOME/.local/bin/claude" ] || \
  fout "Claude Code ontbreekt. Plak dit in de Terminal, wacht tot het klaar is, en start dit script opnieuw:  curl -fsSL https://claude.ai/install.sh | bash   (bron: code.claude.com/docs/en/setup)"

# 3. Omgeving en afhankelijkheden
echo "Python: $PY ($(uname -m))"
doe "$PY" -m venv "$VENV"
doe "$VENV/bin/pip" install --quiet -r "$REPO/jarvis/requirements.txt"

# 4. Automatisch starten bij inloggen
doe mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
if [ "$DROOG" = 1 ]; then
  echo "[droog] schrijf $PLIST:"; maak_plist
else
  maak_plist > "$PLIST"
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  launchctl bootstrap "gui/$(id -u)" "$PLIST"
fi
echo "Klaar. Jarvis opent op http://127.0.0.1:8765 (nu en bij elke login). Log: $LOG"
echo "Nog niet ingelogd bij Claude? Typ eenmalig 'claude' in de Terminal en volg de browser."

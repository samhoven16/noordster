# Noordster op je MacBook Air (Jarvis)

Wat je krijgt: Jarvis draait op je laptop, opent bij elke login in je browser op `http://127.0.0.1:8765`, kiest per vraag het juiste model en leest alleen. De cockpit blijft de artifact: https://claude.ai/artifact/GLRFuueCEuPdSBE95QqucB (zet die als bladwijzer).

Tijd: ongeveer 15 minuten. Je hebt Terminal nodig (Spotlight: cmd+spatie, typ "Terminal").

## Controleer eerst (30 seconden)
Plak in Terminal:
```
sw_vers -productVersion; uname -m
```
- Het versienummer moet **13 of hoger** zijn (Claude Code vraagt dat, bron: code.claude.com/docs/en/setup). Lager: eerst macOS bijwerken.
- `arm64` = Apple-chip (M1 of nieuwer). **Goed.** `x86_64` = Intel. Dan kan Jarvis een oudere SDK-versie krijgen (de nieuwe heeft alleen een Apple-chip-pakket, gecontroleerd op PyPI). Werkt het dan niet, zeg het mij; het blijft werken in de cockpit.

## Stap 1. Python 3.10 of nieuwer
Typ `python3 --version`. Staat er 3.10 of hoger, ga door. Anders: download het `.pkg`-bestand op python.org/downloads, dubbelklik en volg de stappen.

## Stap 2. Claude Code
Plak (officiële regel van Anthropic):
```
curl -fsSL https://claude.ai/install.sh | bash
```
Open daarna een **nieuw** Terminal-venster en typ `claude`. Er opent een browser: log in met je Claude-abonnement. Sluit af met `/exit`.

## Stap 3. De map ophalen
Doe dit **voordat** je de repo op privé zet, of installeer GitHub Desktop (die logt zelf in):
```
git clone https://github.com/samhoven16/noordster.git ~/noordster
```
Vraagt je Mac om "Command Line Developer Tools", kies Installeren en herhaal daarna de regel.

## Stap 4. Eén script doet de rest
```
cd ~/noordster && scripts/mac-installeren.sh
```
Wil je eerst alleen zien wat er gebeurt: `scripts/mac-installeren.sh --droog`.
Het script maakt een eigen Python-omgeving, installeert wat Jarvis nodig heeft en zet "starten bij inloggen" aan. Er komt geen sleutel in een bestand.

## Stap 5. Controleer
- De browser opent `http://127.0.0.1:8765`. Stel een korte vraag: onder het antwoord staat het gekozen model en wat het kostte.
- Log uit en weer in: de pagina opent opnieuw.
- Geen pagina? Kijk in het logbestand: `cat ~/Library/Logs/noordster-jarvis.log` en stuur me de laatste regels.

## Weghalen
```
cd ~/noordster && scripts/mac-installeren.sh --verwijder
```

## Wat nog niet geverifieerd is
Ik heb dit niet op een Mac kunnen draaien. Gecontroleerd is: het script gedraagt zich goed in een testmodus (startbestand klopt, sleutel komt er nooit in, stopt netjes zonder Claude Code) en de benodigde pakketten bestaan voor Apple-chips. Onbekend: of macOS de eerste keer vraagt om toegang tot de sleutelhanger voor je Claude-login (kies dan "Altijd toestaan" voor Claude), en of Intel-Macs werken.

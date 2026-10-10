# Noordster Jarvis (v0)

Lokale app op jouw laptop. Alleen lezen. Elke vraag gaat naar het juiste model (Snel, Standaard of Zwaar), met het gekozen model en de kosten zichtbaar. De regels uit `CLAUDE.md` en de goedkeuringspoort gelden ook hier.

## Starten (eenmalig installeren)
1. Python 3.10 of nieuwer en de Claude Code CLI moeten op je laptop staan en je moet ingelogd zijn (`claude` in de terminal).
2. In de map van de repo:
   ```
   python -m venv .venv
   .venv/bin/pip install -r jarvis/requirements.txt      # Windows: .venv\Scripts\pip
   .venv/bin/python -m jarvis                            # opent http://127.0.0.1:8765
   ```
3. Zie je een foutmelding over inloggen of een sleutel, dan staat dat in de pagina. Los dat op met `claude` (inloggen) of met een `ANTHROPIC_API_KEY` in je omgeving. Een sleutel zet je nooit in een bestand of de chat.

## Automatisch openen bij inloggen
- Mac: Systeeminstellingen, Algemeen, Inlogonderdelen: voeg een scriptje toe dat `.venv/bin/python -m jarvis` start in deze map.
- Windows: zet een snelkoppeling met dezelfde opdracht in de map `shell:startup`.

## Modellen wisselen
Alles staat in `modellen.json`. Een beter model kiezen is één regel.

## Veiligheid
- Luistert alleen op 127.0.0.1 en weigert andere hostnamen (tegen DNS-rebinding).
- Elke vraag heeft een willekeurig token nodig dat alleen in de pagina staat die jij opent.
- Alleen de tools Read, Grep en Glob. Schrijven en alles naar buiten is niet aan en loopt later via de poort.

## Testen
`npm run test:jarvis` (nodig: `pip install -r jarvis/requirements-dev.txt`).

## Wat niet geverifieerd is
De echte aanroep werkte in de cloud-omgeving waar dit gebouwd is. Op jouw laptop is het nog niet gedraaid: inlog, Windows-paden en het starten bij inloggen zijn onbekend tot jij het probeert.

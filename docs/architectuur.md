# Architectuur: wat we van Copilot overnemen

Besluit van 10 okt, op verzoek van Sam: Copilot en Claude Code bouwen samen aan één architectuur, in deze repo, via pull requests. Copilots bestanden (`cockpit/`, `js/`, `INTEGRATION.md`) zijn gelezen en naast `nexus/index.html` gelegd. Hieronder staat wat er goed aan is en waar het in Nexus terechtkomt.

## Overnemen (Copilots ideeën, in Nexus gebouwd)

| Idee van Copilot | Wat Nexus al heeft | Wat er nog ontbreekt (werk voor Copilot, zie issues) |
|---|---|---|
| Actie gaat door een poort: voorgesteld, goedgekeurd, uitgevoerd of mislukt | Goedkeuringspoort met `nonce` en statussen (`PENDING_HUMAN_AUTH`, `REJECTED`, ...) in de database, plus de harde poort `.claude/hooks/gate.mjs` | Een zichtbaar **logboek van uitgevoerde acties** met resultaat (Copilot: `getExecutionHistory`) |
| Meldingen na uitvoeren (`notifyCompletion`, `notifyError`) | Alleen de feed | Eén rustige melding bij mislukken; geen melding bij routine (regel 9) |
| Vijf levensgebieden met doelen, taken en team | Sectoren en teams (`Kinetic`, `Bio-Forge`, ...) | Per gebied één regel "wat is nu het belangrijkste", alleen uit echte gegevens |
| Elke bron als adapter met `sync()` en `uitvoeren()` | Losse scripts (`scripts/hevy.mjs`) | Eén vaste vorm voor alle bronnen, **eerst alleen lezen** |
| Synchronisatie op een vast ritme | Nachtronde en Ochtend-run | Per bron een laatste-sync-tijd, met vlag als die verlopen is (les 6) |
| Ontwerp: rustige kleuren met betekenis, "Vandaag" bovenaan | Kaart "Wat is nieuw", briefing | Ranglijst top 3 op Vandaag, met reden per punt |

## Niet overnemen, met reden

- **Toestand in `localStorage`.** Alleen in één browser, niet gedeeld met de chat, de nachtrondes of Jarvis. Nexus gebruikt de gedeelde database (`db`) als enige bron van waarheid.
- **Cijfers en taken die verzonnen zijn** (scores, bedragen, bedrijfsnamen in `js/state-engine.js`). Regel 5: onbekend is "niet gecontroleerd".
- **`process.env` en sleutels in de browser** (`js/integration-layer.js`). Sleutels staan nooit in browsercode (regel 3); ze blijven in een omgevingsvariabele aan de serverkant of lokaal.
- **Uitvoering die "gelukt" teruggeeft zonder echte aanroep.** Een mislukte of niet-geïmplementeerde actie moet zichtbaar mislukken, nooit stil slagen (les 8).
- **Een tweede poort.** Alles naar buiten gaat door één poort (les 11): de bestaande. Geen eigen goedkeuringswachtrij naast die van Nexus.

## Spelregels voor de samenwerking

- Copilot werkt via **pull requests** op een eigen branch. Nooit direct naar `main`.
- Copilot mag nu ook in `nexus/` werken, mits er een test bij zit die faalt als de regel stukgaat (les 4) en de controle `Tests` groen is.
- Claude Code reviewt elke Copilot-PR in een verse context en merget alleen na groene tests en Sams regel. Zonder die regel merget Sam.
- Het speelveld `cockpit/`, `js/` blijft bestaan tot de ideeën hierboven zijn overgenomen; daarna wordt het verwijderd (opruimen, regel 8).
- Nieuwe afspraken komen in dit bestand, niet in een chat.

## Niet gecontroleerd

Of Copilots coding agent in Sams account actief is en hoeveel verzoeken per maand het abonnement toelaat: dat staat in zijn GitHub-instellingen, niet in de repo.

# Plan voor zondag 11 okt: de architectuur stap voor stap

Uitgewerkt per stap in `docs/plan-uitwerking.md`. Jarvis op je MacBook: `docs/macbook.md`.

Doel van de dag: één architectuur waarin elke laag een eigen plek, eigenaar en test heeft. Volgorde = fundering eerst (Fase 1 uit `CLAUDE.md`), features daarna. Audit gebeurt nooit in dezelfde sessie als het bouwen.

## Stap 0. Wat alleen Sam kan (10 minuten, voor we beginnen)
1. `noordster` op privé (GitHub, Settings, Change visibility). Beslis of `boekhouding-engine` bewust open is.
2. Branch protection op `main`: "Require a pull request" en "Require status checks: test".
3. Issue 17 toewijzen aan Copilot (rechts bij Assignees).
4. `nexus-os-elite` verwijderen en nachtronde 9 uitzetten.
5. `HEVY_API_KEY` als geheim zetten (de oude sleutel stond in de chat: eerst vernieuwen).
6. Status van de 6 sollicitaties doorgeven (de enige meetcijfer-stap).

Zonder 1, 2 en 5 bouwen we wel door, maar Copilot kan dan nog direct naar `main` en Hevy blijft leeg.

## De lagen en de volgorde

| Stap | Laag | Wat er klaar is aan het eind | Wie | Bewijs |
|---|---|---|---|---|
| 1 | **Gegevens**: één kaart van alle database-collecties (`atlas`, `bouw`, `briefing`, `bus`, `chat`, `dagen`, `geheugen`, `geld`, `notities`, `outreach`, `pijplijn`, `systeem/nieuw`, `config/profiel`, `lichaam/hevy`) | `docs/gegevens.md`: per collectie eigenaar, vorm, limiet en opruimregel (les 9). Test dat de kaart overeenkomt met wat de cockpit echt leest (les 3) | Claude | test faalt als een collectie ontbreekt in de kaart |
| 2 | **Poort en logboek**: één levenscyclus voor elke actie naar buiten | Kaart "Logboek" (issue 17), mislukt is zichtbaar mislukt | Copilot bouwt, Claude toetst in verse context | test die faalt zonder kaart; CI groen |
| 3 | **Bronnen**: één vaste vorm per bron (`sync()`, laatste-sync-tijd, vlag bij verlopen, eerst alleen lezen). Volgorde en wat wel/niet: `docs/koppelingen.md` | Hevy omgezet naar die vorm; Agenda en Gmail (alleen lezen, concepten via de poort) als lege adapters met "niet verbonden"; bank via CSV-import | Claude, Copilot reviewt | adapter die niet verbonden is meldt dat, nooit "gelukt" |
| 4 | **Vandaag**: top 3 met reden per punt | Alleen uit echte gegevens (sollicitaties, agenda, training). Geen gegevens = "niet gecontroleerd" | Copilot ontwerp, Claude data | test met lege database toont geen verzonnen punt |
| 5 | **Router en uitvoering**: cockpit-router en Jarvis dezelfde regels | Eén gedeelde regeltabel (`jarvis/modellen.json`) waar de cockpit-router naar verwijst, met test dat ze niet uit elkaar lopen | Claude | contracttest (les 1) |
| 6 | **Engineer-modus**: wie werkt wanneer | Weekritme (ma QA ... zo opschonen) gekoppeld aan `memory/backlog.md`; Copilot-PR's krijgen automatisch een Claude-review | Claude | taken-log toont de runs |
| 7 | **Audit** (aparte sessie, nooit dezelfde als bouwen) | Skill `audit` over stap 1 tot 6; bevindingen in de backlog | Andere sessie | ledger |

## Tijdsindeling (richtlijn)
- Ochtend: stap 0 (Sam), daarna stap 1 en 2 tegelijk (Claude en Copilot).
- Middag: stap 3 en 4.
- Avond: stap 5 en 6, laatste PR gemerged.
- Audit (stap 7): eerstvolgende sessie, niet morgen in dezelfde als het bouwen.

## Besluiten voor Sam (met aanbeveling)
1. **Jarvis op je laptop**: aanbeveling ja, alleen lezen, starten bij inloggen. Kost niets extra. Eerst een test door jou.
2. **Copilot-limiet**: ik weet niet hoeveel verzoeken je abonnement toelaat (niet gecontroleerd). Aanbeveling: maximaal 2 open Copilot-issues tegelijk.
3. **Boekhoudbaar** blijft geparkeerd tot jij het opent.

## Niet gecontroleerd
Of Copilot's agent in jouw account aan staat; of de Hevy-API werkt met de nieuwe sleutel; of Jarvis start op jouw laptop.

## Afspraak aan het eind van de dag
Eén zin: wat werkt nu zichtbaar, en wat is de volgende stap (`docs/overdracht.md`).

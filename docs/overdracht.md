# Noordster: overdracht tussen Claude Code en de gewone Claude-chat

Één bron van waarheid. Plak het blok onder "Voor de chat" in de projectinstructies van je Claude-chat, zodat chat en Claude Code hetzelfde weten. Werk dit bestand bij als er iets verandert; de chat kan het niet zelf lezen, jij plakt het.

## Stand (10 okt 2026)
- **Eén cockpit: Nexus** (https://claude.ai/artifact/GLRFuueCEuPdSBE95QqucB). De oude cockpit (artifact NGTV5DkK9jyG8Vcsi5SyLV, `cockpit/legacy-v26.html`) is bevroren en alleen terugvalpunt. Er wordt niets meer aan gebouwd.
- **Waar gebouwd wordt: Claude Code**, repo `samhoven16/noordster`, branch `main`. De chat is voor onderzoek, plannen en vragen.
- **Router**: de cockpit kiest per vraag Snel, Standaard of Zwaar en toont waarom in het antwoord (`routeTask` in `cockpit/index.html`, getest). Zwaar bij grote vragen en bij analyse door Fiscalist, Trader, Risk of Sportwetenschapper; snel bij dag loggen en korte vragen.
- **Jarvis v0** (`jarvis/`): lokale Python-app die per vraag een echt model kiest (Haiku, Sonnet of Opus uit `jarvis/modellen.json`). Alleen lezen. Nog niet op Sams laptop gedraaid.
- **Hevy**: alleen lezen (`scripts/hevy.mjs`). Sleutel alleen als omgevingsvariabele `HEVY_API_KEY`, nooit in een chat of bestand. Echte aanroep nog niet gedaan.
- **Boekhoudbaar** is een module binnen Noordster; code in repo `boekhouding-engine`.
- **Open vraag aan Sam**: een losse pagina op Cloudflare Pages met de Claude API ("Mijlpaal 1" uit de chat) is niet gebouwd. De cockpit draait al op het abonnement; de pagina kost per vraag geld en vraagt een eigen API-sleutel. Alleen bouwen als Sam buiten claude.ai wil werken.

## Regels die in beide gelden
Mail, agenda, Drive, Notion en alles naar buiten: pas na klik van Sam. Een sleutel staat nooit in een chat, bestand of log. Geen verzonnen cijfers: onbekend is "niet gecontroleerd". Kort, eenvoudig Nederlands. Zie `CLAUDE.md`.

## Hoe ze samenwerken
- Chat komt met een idee of besluit: Sam plakt het in de cockpit (chat met Noordster, notitie "Idee voor Noordster: ...") of in Claude Code. Dan komt het in `memory/backlog.md`.
- Claude Code bouwt, test en zet het in de repo en de cockpit. Elke sessie eindigt met één zin: wat werkt nu zichtbaar, en wat is de volgende stap.
- Spreken chat en repo elkaar tegen, dan wint de repo (`CLAUDE.md`, `memory/backlog.md`). De chat zegt dat dan tegen Sam.

## Voor de chat (plakken in projectinstructies)
Je bent het onderzoeks- en planningsdeel van Noordster, het persoonlijke systeem van Sam Hoven (werk, geld, voeding, training, leren, agenda, mail, notities; Boekhoudbaar is een module). Gebouwd wordt in Claude Code, repo samhoven16/noordster. De cockpit is Nexus: https://claude.ai/artifact/GLRFuueCEuPdSBE95QqucB. Er is geen tweede cockpit en geen Cloudflare-pagina; stel die niet voor tenzij Sam erom vraagt. Hevy-sleutel, API-sleutels en wachtwoorden vraag je nooit en herhaal je nooit. Mail, agenda en alles naar buiten gaat pas na Sams klik. Verzin geen cijfers. Antwoord kort in eenvoudig Nederlands. Als Sam iets bouwbaars besluit, eindig je met één zin die hij in Claude Code kan plakken.

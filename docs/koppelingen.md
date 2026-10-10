# Koppelingen: wat Copilot noemde en wat we echt aansluiten

Bron: de volledige Copilot-chat die Sam plakte (10 okt). Alles wat Copilot noemt is **voorstel, geen feit**: geen enkele repo- of productnaam is hier bij de bron gecontroleerd. Niets wordt geïnstalleerd voor de link is gecontroleerd (`CLAUDE.md`). Regels die altijd gelden: alles naar buiten via de poort, eerst alleen lezen, geen sleutels in bestanden, kosten dicht bij nul.

## 1. Echt aansluiten (in deze volgorde)

| # | Koppeling | Hoe | Waarom nu | Wat Sam moet doen |
|---|---|---|---|---|
| 1 | **Hevy** (training) | `scripts/hevy.mjs`, alleen lezen, staat klaar | Kost niets, test klaar | Sleutel vernieuwen en als geheim `HEVY_API_KEY` zetten |
| 2 | **Gmail** (sollicitaties, opvolging) | Bestaande connector; lezen en **concepten** maken, nooit versturen | Het enige meetcijfer: sollicitaties en gesprekken per week | Niets; Sam verstuurt zelf |
| 3 | **Google Agenda** | Bestaande connector, alleen lezen; schrijven pas na klik | Vandaag-top-3 heeft tijd nodig | Niets |
| 4 | **Notion en Drive** | Bestaande connectors, alleen lezen | Eenmalig invoeren: bestaand document bijwerken | Zeggen welke pagina's de bron zijn |
| 5 | **Bank (ASN, N26)** | Eerst **CSV-export** inlezen (geen inlog, geen sleutel). Pas later een bankkoppeling | Geld zonder risico; regel 3 | Eén CSV per maand uit de app downloaden |
| 6 | **MCP** | De standaard om bronnen aan te sluiten; de cockpit en Jarvis gebruiken dit al | Eén vorm voor alle bronnen (stap 3 van het plan) | Niets |

## 2. Later, na een besluit van Sam

| Koppeling | Voorwaarde |
|---|---|
| **Slaap en herstel** (Apple Health, Garmin, Whoop) | Eerst weten welk apparaat Sam heeft. Apple Health heeft volgens mijn kennis geen webkoppeling (gegevens staan op de telefoon): niet bij de bron gecontroleerd |
| **Stem** (Whisper) en **lokaal model** (Llama via Ollama) | Pas als Jarvis op Sams laptop draait; hardware onbekend |
| **Tauri-app** | Staat al in `docs/besluit-stack.md` als later |
| **Geheugenkaart / herhalen** (Anki-idee) | Eerst als simpele lijst in de database; geen aparte app |
| **Boekhoudbaar: Mollie, Stripe, Exact** | Geparkeerd tot Sam het opent |

## 3. Niet aansluiten, met reden

| Copilot noemde | Besluit | Reden |
|---|---|---|
| LangChain, LangGraph, OpenAI Agents SDK | Nee | De motor is de Claude Agent SDK (`docs/besluit-stack.md`); een tweede motor is dubbel werk en dubbel risico |
| Guardrails AI, NeMo Guardrails, Garak, WhyLabs | Nee | De harde poort (`.claude/hooks/gate.mjs`), de 12 lessen en de testcontrole doen dit al; Garak test modelservers, niet dit systeem |
| Postgres + pgvector, Redis, Celery, GraphRAG, LlamaIndex | Nee, nu | De gedeelde database van de cockpit is de enige bron; een eigen server kost geld, onderhoud en is een extra aanvalsvlak. Herzien bij meer dan ~500 documenten per tabel (L9) |
| Vercel, Railway, Render | Nee | Maandelijkse kosten en een server om te beveiligen; de cockpit draait al zonder |
| Sentry, New Relic, Traceloop, LangSmith | Nee | Het taken-log en alarmen bij groei zijn genoeg (L9) |
| **LinkedIn scrapen** en automatisch solliciteren | **Nee** | Afspraken van LinkedIn staan dit volgens mijn kennis niet toe en een account kan geblokkeerd worden (niet bij de bron gecontroleerd). Vacatures gaan via mail en handmatig; Sam beslist per sollicitatie (regel 1) |
| Zapier, Make.com, n8n | Nee, nu | Zapier is al als connector beschikbaar maar elke tussenlaag is een extra poort naast de ene poort (L11). Alleen voor één concrete bron die anders niet kan |
| Three.js, 3D-wereld, muziek, "neurale hersenen" | Later, optioneel | Mooi maar het meet niets. Eerst Vandaag-top-3 en logboek; daarna mag Copilot een visuele kamer voorstellen |
| Vaste 9 agents (Maestro, Atlas, Forge, Echo, Iron, Sage, Oracle, Guardian) | Niet als aparte code | Nexus heeft sectoren met teams; hernoemen is geen winst |
| Verzonnen cijfers uit de voorbeelden ($500k, 12% vet, "Axon €120k") | Nee | Regel 5 |

## 4. Te controleren voor iets geïnstalleerd wordt

Repo- en productnamen uit de chat zijn nog niet gecontroleerd: `maestro-ai`, `agentic-ai-hub`, `from-rag-to-agentic-rag`, `rulebasedLLM`, `claude-ui`, `BaoCode`, `opcode`, `claude-code-ui-ux-skill`. Eerder bleken in een andere geplakte blauwdruk links dood, een typfout-kaper en een repo die niet was wat er stond. Elke naam krijgt eerst een controle (bestaat, eigenaar, licentie, laatst bijgewerkt); volgens Copilots eigen beschrijving zijn alleen `claude-code-ui-ux-skill` en `opcode` mogelijk nuttig als inspiratie; de rest dubbelt wat er al is.

## 5. Wat dit voor het plan van zondag betekent

Stap 3 uit `docs/plan-morgen.md` (Bronnen) wordt: 1 Hevy, 2 Gmail-concepten en Agenda, 3 CSV-import voor de bank, in die volgorde, elk als adapter met laatste-sync-tijd en vlag bij verlopen.

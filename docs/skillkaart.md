# Skillkaart: welke expert-logica nemen we over

Bron: de inspiratielijst van Sam (10 okt 2026). Elke regel is getoetst aan zijn werkregels: voordeel (Y) vóór je iets doet, kosten dicht bij nul, eenmalig invoeren, weinig meldingen, externe acties na klik, niets leren wat slimmer over te nemen is.
Niveau: 1 kan in de cockpit/repo · 2 via koppeling met klik · 3 pas in de zelfstandige app · 4 niet of niet toegestaan.
Alle beweringen over de genoemde tools komen uit de lijst en zijn niet door mij nagekeken, behalve waar staat dat ik het wel deed.

| Veld | Voorbeeld uit de lijst | Wat we overnemen | Wat niet, en waarom | Niveau |
|---|---|---|---|---|
| Systeem | CrewAI, LangChain, Pydantic | De rolverdeling planner, werker, criticus met eigen grenzen. Dat doen Claude Code-agents al. Invoer van elke actie valideren met een schema | Een extra framework: meer onderdelen, meer kosten, geen voordeel boven wat er al is. Python hoeft niet: JSON-controle in Node volstaat | 1 |
| Geheugen | vector-database (Pinecone, Chroma) | Eén bron van waarheid: markdown voor tekst, later één database voor data | Vector-zoeken: de hele database is nu 23 documenten (gemeten), markdown is genoeg en kost niets | 1 |
| Inkomen/outreach | Clay, Lavender | Per contact: voor wie, wat, waarom, wanneer opvolgen (staat al). Korte mails (onder ±100 woorden), één duidelijke vraag, eenvoudige taal | Autonoom LinkedIn scrapen en massaal mailen: botst met voorwaarden, AVG en Sams regel (concept in Gmail, hij verstuurt, max 5 per dag). Een "9,5/10-score" door een model dat zijn eigen werk beoordeelt: onbetrouwbaar, de criticus werkt met een checklist in verse context | 2 |
| Fiscaal/boekhouding | Boekhoudbaar, bank-API (Bunq, Plaid) | `memory/constanten.json` met bron en verloopvlag. Urenteller tegen 1.225. Btw-reserve als richtwaarde, gemarkeerd als ruw. Boekhoudbaar levert de rekenkern | Bankkoppeling met schrijfrechten of automatisch betalen: harde regel 3. Alleen-lezen koppeling kan later, inloggen blijft handwerk van Sam | 2 |
| Lichaam | Whoop, Oura | Hevy-data (training, progressie) plus zelfgemelde energie. Rooster past zich aan op herstel | Hardware die Sam niet heeft genoemd. Geen medische claims; klachten naar de huisarts | 1 |
| Voeding/training | MacroFactor | Wekelijks doel bijstellen op basis van gelogd gewicht en gegeten hoeveelheid, mits Sam die logt | Aannemen dat een weegschaal-koppeling bestaat. Eerst vragen of hij gewicht logt | 1 |
| Leren | Perplexity, NotebookLM | Bronnen bij elke feitelijke claim; leesmateriaal samenvatten met bronverwijzing. Toetsen na 3, 7 en 30 dagen (staat al) | Een extra betaalde zoekdienst: web-zoeken met bronnen zit al in Claude | 1 |
| Leven/planning | Reclaim, Motion | De agenda-skill puzzelt blokken rond vaste afspraken en energie; Sam beslist | Automatisch uitnodigen of verschuiven van afspraken van anderen | 2 |
| Interface | Telegram/WhatsApp-bot | Op termijn één app (PWA) met goedkeuringskaarten en spraaknotitie | Een bot met pushmeldingen: botst met "weinig meldingen"; kan pas na Fase 3 | 3 |
| Koppelwerk | Make, Zapier | Alleen waar Claude geen koppeling heeft | Extra tussenlaag: extra storingspunt en kosten | 2 |
| Boekhoudbaar als bedrijf | "Jarvis"-agents, lead-agents, klantenservice-bot | Klantenservice en onboarding via vaste antwoorden gekoppeld aan code (L10), escalatie naar Sam | "Volledig zonder mensen" voor wettelijk advies: de adviseur-controle van tarieven blijft menselijk (zie `boekhouding-engine/.claude/audit-ledger.md`, F-TAX-111/112/331/332). Jarvis/OpenJarvis: niet nagekeken, daarom niet gebruikt | 2 |

## Volgorde voor het inbouwen
1. Fiscaal en inkomen (past bij het meetcijfer): constanten-register (gebouwd), outreach-skill, fiscale rooktest.
2. Lichaam en voeding: Hevy-analyse naar de repo, wekelijkse bijstelling.
3. Leren, leven.
Reden: het meetcijfer is sollicitaties en gesprekken, en Fase 1 begint bij constanten en poort.

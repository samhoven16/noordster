# Backlog (de engineer pakt het bovenste item dat bij de rol van de dag past)

Rollen per weekdag: ma QA, di beveiliging, wo kosten en snelheid, do UX, vr data en fiscaal, za documentatie en noodpad, zo opschonen.

| Prio | ID | Wat | Rol | Bron |
|---|---|---|---|---|
| hoog | U-1 | Kaart "Wat is nieuw" op Nexus: toont per dag wat de engineer veranderde (uit `memory/taken-log.md`, via db `lichaam`-achtig doc `systeem/nieuw`), zodat Sam het effect ziet zonder te vragen | UX | Sam 10 okt: effect niet voelbaar |
| hoog | C-1 | Echte chat in de nieuwe cockpit 5 minuten testen (JSON-uitvoer, tools, team, toestemmingen). Alleen Sam kan dit; daarna bugs hier | QA | fase0 §2 |
| hoog | N-2 | Hevy: Sam vernieuwt de sleutel (hij stond in de chat) en zet hem als geheim `HEVY_API_KEY` in de omgeving. Daarna eerste echte run van `node scripts/hevy.mjs` en de uitkomst naar db `lichaam/hevy` (client, analyse en kamer staan klaar en zijn getest met nep-antwoorden; echte API nog niet geprobeerd) | beveiliging | fase0 N-2 |
| midden | H-2 | Hevy schrijven (routines aanpassen) alleen als voorstel via de poort: Sportwetenschapper stelt voor, Criticus toetst, Sam klikt. Niet gebouwd, `scripts/hevy.mjs` kan bewust alleen lezen | UX | Hevy-opdracht |
| hoog | B-3 | `RUNBOOK.md`: plaatsvervanger "kluis-locatie X" invullen en tweede beheerder (Sam beslist wie) | documentatie | fase0 B-3 |
| hoog | S-1 | Schaal naar 20.000 klanten: F-SCALE-336/337/338 (guillotine plus cursor), Brevo-limiet, licentieserver als Sheet. Ontwerp eerst | kosten | fase0 §9b |
| midden | C-2 | Risicolimiet voor Trader vastleggen (Sam kiest; de Risk Manager legt de afweging uit) | data | fase0 |
| midden | B-5 | SEPA-QR lokaal genereren, geen IBAN naar quickchart.io/api.qrserver.com (Sam akkoord) | beveiliging | fase0 B-5 |
| midden | N-3 | Teamlog (Google Doc) bevriezen; één geheugenbron; scan-test dat geen run een tweede bron noemt | documentatie | fase0 N-3 |
| laag | N-8 | Caps op `bus`, `chat`, `briefing`, `bouw` (L9). Gemeten 10 okt: chat 29 docs (47 KB), bus 2, briefing 1, pipeline 3; lezen is al begrensd met limit(). Nog niets nodig. Opruimen = verwijderen, dus pas bouwen als een tabel boven ~500 docs komt, en dan eerst Sam vragen (regel 4) | kosten | fase0 N-8 |
| midden | N-9 | Constanten bij de bron bevestigen zodra een bron bereikbaar is; status op bevestigd | data | fase0 N-9 |
| midden | N-12 | Regels van oude nachtrondes opruimen (plan/audit tegenover plan/masterplan) in de oude artifact | documentatie | fase0 N-12 |
| laag | B-4 | `SECURITY.md` van Boekhoudbaar vervangen door echt beleid | documentatie | fase0 B-4 |
| laag | B-6 | hc-ping.com vaste URL uit de bron (`Triggers.gs:1445`) | beveiliging | fase0 B-6 |
| laag | B-7 | Tests die `website/version.json` wijzigen isoleren | QA | fase0 B-7 |
| laag | B-8 | Gemini-sleutel uit de URL naar header | beveiliging | fase0 B-8 |

# Backlog (de engineer pakt het bovenste item dat bij de rol van de dag past)

Rollen per weekdag: ma QA, di beveiliging, wo kosten en snelheid, do UX, vr data en fiscaal, za documentatie en noodpad, zo opschonen.

| Prio | ID | Wat | Rol | Bron |
|---|---|---|---|---|
| hoog | C-1 | Echte chat in de nieuwe cockpit 5 minuten testen (JSON-uitvoer, tools, team, toestemmingen). Alleen Sam kan dit; daarna bugs hier | QA | fase0 §2 |
| hoog | N-2 | Hevy-sleutel vernieuwen (Sam), daarna lichaamsanalyse opnieuw opzetten in de Week-run met omgevingsvariabele | beveiliging | fase0 N-2 |
| hoog | B-1 | Mailpoort-contracttest uitbreiden naar `boekhouding-engine/licence-server/` (8 aanroepen, 3 naar klanten) | beveiliging | fase0 B-1 |
| hoog | B-2 | Factuurdialog: BTW-weergave met integer-centen (`NieuweBoeking.gs:789,795`), regressietest €21,50 × 21% = €4,52 | data | fase0 B-2 |
| hoog | B-3 | `RUNBOOK.md`: plaatsvervanger "kluis-locatie X" invullen en tweede beheerder (Sam beslist wie) | documentatie | fase0 B-3 |
| hoog | S-1 | Schaal naar 20.000 klanten: F-SCALE-336/337/338 (guillotine plus cursor), Brevo-limiet, licentieserver als Sheet. Ontwerp eerst | kosten | fase0 §9b |
| midden | C-2 | Risicolimiet voor Trader vastleggen (Sam kiest; de Risk Manager legt de afweging uit) | data | fase0 |
| midden | B-5 | SEPA-QR lokaal genereren, geen IBAN naar quickchart.io/api.qrserver.com (Sam akkoord) | beveiliging | fase0 B-5 |
| midden | N-3 | Teamlog (Google Doc) bevriezen; één geheugenbron; scan-test dat geen run een tweede bron noemt | documentatie | fase0 N-3 |
| midden | N-8 | Caps en alarm op `bus`, `chat`, `briefing`, `bouw` (L9); nu 60 documenten, 176 KB artifact | kosten | fase0 N-8 |
| midden | N-9 | Constanten bij de bron bevestigen zodra een bron bereikbaar is; status op bevestigd | data | fase0 N-9 |
| midden | N-12 | Regels van oude nachtrondes opruimen (plan/audit tegenover plan/masterplan) in de oude artifact | documentatie | fase0 N-12 |
| laag | B-4 | `SECURITY.md` van Boekhoudbaar vervangen door echt beleid | documentatie | fase0 B-4 |
| laag | B-6 | hc-ping.com vaste URL uit de bron (`Triggers.gs:1445`) | beveiliging | fase0 B-6 |
| laag | B-7 | Tests die `website/version.json` wijzigen isoleren | QA | fase0 B-7 |
| laag | B-8 | Gemini-sleutel uit de URL naar header | beveiliging | fase0 B-8 |

# Fase 0-rapport — Noordster en Boekhoudbaar

Datum: 10 okt 2026 · Fase 0 = alleen lezen. Er is geen code gewijzigd.
Gelezen in: `noordster` (alles), `boekhouding-engine` (registers, runbook, tests, greps) en de 19 geplande taken (read-only lijst).

## 1. In vijf regels

1. **Boekhoudbaar is verder dan het document aanneemt.** Het heeft al een bug-klasse-register (12 klassen, 9 gesloten), een ledger, een rekenregister en een runbook. Alle 3.294 tests slagen en lint geeft 0 fouten. Fase 1 daar is dus vooral *gaten dichten*, niet bouwen.
2. **Noordster in deze repo is klein.** Het is een plugin met een statusbalk (6.140 bytes, 2 tests). Het startpakket uit het document (CLAUDE.md, agents, skills, goedkeuringspoort, `memory/constanten`) staat hier **niet**. Het bestaat niet op `main` en ook niet op de werkbranch.
3. **De audit uit het document klopt, en is nu bewezen.** Alle 19 taken draaien in `auto`-modus met 12 koppelingen zonder beperking. De regel "geen externe actie zonder klik" staat alleen als tekst in de prompts.
4. **De Hevy-sleutel staat nog in platte tekst** in de prompt van Lichaamsanalyse (stap 1). De sleutel is dus ook in deze sessie zichtbaar geweest. Vernieuw hem en trek de oude in. Ik heb hem niet in dit rapport gezet.
5. **Eén echte rekenfout gevonden in Boekhoudbaar** (alleen weergave): de factuurdialog toont €4,51 BTW waar de factuur zelf €4,52 opslaat (€21,50 × 21%).

## 2. Wat ik wel en niet heb gedaan

**Volledig gelezen:** `CLAUDE.md`, `bug-class-register.md`, `audit-ledger.md`, `calculation-register.md`, `go-live-readiness.md`, `RUNBOOK.md`, `SECURITY.md`, alle bestanden van `noordster`, alle 19 taak-prompts (de lijst van geplande taken).

**Zelf gedraaid:** `npm ci`, `jest` (286 suites, 3.294 tests, allemaal groen), `eslint` (0 fouten, 196 waarschuwingen), greps op uitgaande kanalen en geldafronding.

**Niet gedaan (dus niet beweerd):**
- De cockpit-artifact (±1 MB) en zijn database (`plan/*`, `nachtlog`, `outreach`, `pipeline`, `geheugen`) zijn niet gelezen. Alles over de cockpit-interne werking komt uit het document of uit de taak-prompts.
- De 39.587 regels `src/*.gs` zijn niet regel voor regel gelezen. Ik leunde op de bestaande registers, de groene tests en gerichte greps.
- Niet volledig gelezen: `invariants.md`, `flow-maps.md`, `sheet-schemas.md`, `repo-map.md`, `test-map.md`, de audits van juni, `website/`, `licence-server/` (alleen greps).
- De tests van de Noordster-plugin zijn niet gedraaid: er is hier geen `claude-code`-runtime. Het typecheck-pad is bovendien stuk (zie N-7).
- `npm audit` meldt 48 kwetsbaarheden (41 hoog) in dev-pakketten. Niet geanalyseerd.

Bijwerking gevonden: `npm test` wijzigt het bijgehouden bestand `website/version.json` (via `cycle85` en `cycle88`). Ik heb dat teruggezet.

## 3. Kaart

### 3.1 Noordster (repo `noordster`)

| Onderdeel | Doet | Bron |
|---|---|---|
| Plugin-manifest | naam `noordster`, versie 0.1.0, marketplace | `.claude-plugin/*.json` |
| Statusbalk/cockpit | tekent 7 domeinen met score 0–10 en een focusregel | `hooks/register.tsx:21-52` |
| Commando `/noordster` | `focus <tekst>`, `<domein> <0-10>`, `paneel`, `verberg` | `hooks/register.tsx:64-88` |
| Prompt-sectie | stuurt elk verzoek naar een domein (Boekhoudbaar = Inkomen), max 5 regels | `hooks/register.tsx:90-103` |
| Opmaak | spinner, berichtmarkering `★`, `▍` | `hooks/register.tsx:105-115` |
| Status | `focus`, `hidden`, `scores` als plugin-state | `types/index.d.ts` |
| Tests | 2 tests (focus zetten; cockpit tekent) | `hooks/noordster.test.ts` |

De echte cockpit (chat, wereld, Vandaag, goedkeuringskaarten, team) staat in de artifact. Die ligt niet in git en is dus niet versiebeheerd (zie N-6).

**Taken in de cloud (geverifieerd via de lijst):** 19 actief, precies zoals het document zegt.
- 7 terugkerend met `CRON_TZ=Europe/Amsterdam`: Ochtend 07:29 dagelijks; Agenda 08:50 en 11:50 ma–za; Avond 21:28 ma–za; Voeding 08:55 vr+za; Lichaamsanalyse do 08:47; Weekreview zo 18:52.
- 1 Werker (op aanroep), 1 dagronde 21:47, 11 nachtrondes (eenmalig, vaste UTC-tijd, 21:03 tot 07:03 NL).
- Niet in het document: 6 uitgezette eenmalige taken (voortest, 3× Gmail opruimen, Uitschrijven/AVG, PR-check).
- Modellen: Haiku voor Agenda en Avond; Sonnet voor de rest; Opus voor de eenmalige opruimtaken.

### 3.2 Boekhoudbaar (repo `boekhouding-engine`)

Google Apps Script (`src/`, 75 bestanden, 39.587 regels) + licentieserver (`licence-server/`) + website (`website/`, Cloudflare Pages). Verantwoordelijkheden per bestand staan in `.claude/repo-map.md`. Niet opnieuw geschreven, wel gecontroleerd dat de tests groen zijn.

Belangrijkste ketens (uit `CLAUDE.md`): formulier of dialoog → `Triggers.gs` → factuur/uitgave → `Boekingen.gs` (journaalpost) → `BTW.gs`, `Rapportages.gs`, `ExportAccountant.gs`/`XafExport40.gs`.

## 4. Dataschema's

- **Boekhoudbaar:** exacte kolommen staan in `.claude/sheet-schemas.md` (273 regels). Een contracttest koppelt de kolom-accessor `KOL` aan dat bestand (`contract-sheet-kolom.test.js`, groen) en een omgekeerde ban verbiedt losse kolomnummers in heel `src/`. Hier is L3 dus al afgedwongen. Niet opnieuw uitgeschreven.
- **Noordster-plugin:** 3 velden (`focus`: tekst, `hidden`: ja/nee, `scores`: domein→0–10).
- **Noordster-cockpit (artifact-database):** alleen bekend uit het document (`plan/*`, `nachtlog`, `outreach`, `pipeline`, `geheugen`). Exacte velden **niet geverifieerd** → Fase 0b (vraag 3).

## 5. Externe afhankelijkheden

| Afhankelijkheid | Gebruik | Risico / bron |
|---|---|---|
| Google Apps Script, Sheets, Drive, Gmail | hele Boekhoudbaar | 6 min runtime, 500 KB properties, mailquota (ledger F-SCALE-\*) |
| Mollie `v2` | betaling | vast in code: `Mollie.gs:18`, `licence-server/Code.gs:593` |
| Brevo `v3` | mail | vast in code: `licence-server/Code.gs:965,2037` |
| KvK `v2` | bedrijfsopzoek | vast in code, `v3` verwacht in 2027 (ledger F-DUR-151) |
| Gemini `v1beta` | bonscan | sleutel in de URL (`BoekingEngine.gs:679,836`); model-EOL eerder gebeurd (F-SCALE-332) |
| VIES, ECB | EU-BTW-check (`EUVerkoop.gs`), koersen (`Utils.gs`) | |
| quickchart.io, api.qrserver.com | SEPA-QR | zie flow F-3 |
| hc-ping.com | heartbeat | vaste URL `Triggers.gs:1445` |
| Cloudflare Pages, GitHub Actions | site, CI | `RUNBOOK.md` §4 |
| Claude-koppelingen (Gmail, Agenda, Drive, Notion, Docs, Brevo, Zapier, Cloudflare, Base44, Canva, Figma, Claude Code Remote) | Noordster-taken | alle 12 aan elke taak gekoppeld, `permitted_tools` leeg |
| Hevy-API | training | sleutel in prompt (N-2) |
| Belastingdienst/wetten.overheid.nl | bronnen tarieven | `BELASTING_META` heeft bron + datum per jaar |

## 6. Waar geld, belasting en persoonsgegevens stromen

| # | Stroom | Waar | Opmerking |
|---|---|---|---|
| F-1 | Factuur/uitgave → journaalpost → BTW-aangifte | `Triggers.gs` → `Boekingen.gs` → `BTW.gs` | bedragen als float met één afrondpunt (`rondBedrag_`, `rondTariefCent_`), **niet** integer-centen overal. Het register noemt dat zelf een eerlijke grens |
| F-2 | Fiscaal advies (IB, KIA, MIA, Zvw, box 3) | `Belastingadvies.gs` | 2026 bron-geverifieerd; open: F-TAX-111/112/331/332 wachten op de adviseur |
| F-3 | **SEPA-QR: IBAN, naam, bedrag, referentie gaan in een URL naar een derde** | `Verkoopfacturen.gs:858-867` | quickchart.io, daarna api.qrserver.com. Voor een eenmanszaak is een IBAN een persoonsgegeven. Ik vond geen test of tekst die dit afdekt (privacytekst niet gelezen) |
| F-4 | Klantmail (factuur, herinnering, OTP, drips) | zie §7 | |
| F-5 | Export naar accountant (XAF 4.0, CSV) | `ExportAccountant.gs`, `XafExport40.gs` | consistentie CSV↔XAF is geborgd (F-ACC-162/340) |
| F-6 | Licentie-validatie en betaling | `Licentie.gs` ↔ `licence-server/Code.gs` | enige centrale opslag; klantdata blijft in de eigen sheet |
| F-7 | Noordster: Gmail, Agenda, Drive, Hevy, Docs | 19 taken | zie N-1, N-2, N-5 |

## 7. Alle uitgaande kanalen

**Boekhoudbaar** (geteld met grep): `MailApp.sendEmail` 19× in `src/` (4 zijn commentaar, 15 dragen de marker `klant-mail-ok`) en 8 echte aanroepen in `licence-server/` (`Code.gs:989,1490,1901,1927,2066,3441,3899`, `AdminDashboard.gs:759`). `UrlFetchApp.fetch` 33× in `src/`, 7× in `licence-server/`. `GmailApp.sendEmail` 0×. Delen van Drive-bestanden via code: 0×. `deleteTrigger` 5× in `src/`, 3× in `licence-server/`.

**Noordster:** elke taak heeft Gmail, Agenda, Drive, Notion, Docs, Brevo, Zapier, Cloudflare, Base44, Canva, Figma en Claude Code Remote tot zijn beschikking. Volgens hun prompts mailen Ochtend, Avond, Voeding, Lichaamsanalyse, de eenmalige opruimtaken en Uitschrijven/AVG. Die laatste was opgedragen ±19 derden te mailen namens Sam (met zijn toestemming in de prompt, maar zonder poort). Of alle mails echt zijn verstuurd heb ik niet gecontroleerd.

## 8. Eerste bug-klasse-register

### 8.1 Noordster (nieuw; nu nog geen enkele klasse gesloten)

| # | Les | Klasse | Bewijs | Sluiting (Fase 1) | Status |
|---|---|---|---|---|---|
| N-1 | L11 | Uitzending buiten een poort om | alle 19 taken `auto`; 12 koppelingen, `permitted_tools: []`; regels alleen als tekst | PreToolUse-hook `gate` + per taak een toegestane lijst; contracttest die elke taak met een tool buiten zijn lijst laat falen | 🔴 open |
| N-2 | L12 / L5 | Geheim in een prompt | Hevy-sleutel in platte tekst, taak `trig_0175XvrsTDSPucT4j8xb4EjB`, stap 1 | sleutel vernieuwen (Sam), daarna in een geheimenvak; scan-test op alle taak-prompts | 🔴 open |
| N-3 | L3 | Geheugen op meerdere plekken | Data-doc (`9356c4a8…`) voor Ochtend/Weekreview/Werker; oude Teamlog (`1G6Eh4ey…`) nog gelezen én beschreven door Agenda, Voeding en Lichaamsanalyse; artifact-database; claude.ai-memory; plugin-state. **Vijf bronnen, twee ervan lopen uit elkaar** | één bron + test die faalt als een taak een tweede bron noemt | 🔴 open |
| N-4 | L8 | Maker is ook de controleur | elke ronde bouwt, test en publiceert zelf op de live artifact; taken mogen zichzelf en elkaar wijzigen (`update_trigger`), ronde 11 mag 3 nieuwe taken aanmaken | testset en limieten in een map die de agents niet kunnen schrijven; publiceren alleen als concept | 🔴 open |
| N-5 | L11 | Drie risico's in één taak (privédata + onbetrouwbare invoer + uitzending) | Agenda (Haiku) leest een Gmail-antwoord en schrijft in de agenda; Voeding leest webfolders en mailt; Lichaam leest web/Hevy en mailt | rechten per taak splitsen: lezen en schrijven nooit in dezelfde run | 🔴 open |
| N-6 | L3 / L12 | Cockpit niet in git | de artifact (±1 MB) is prototype én specificatie, maar niet versiebeheerd; backup alleen in tijdelijke map en versie 26 | export naar de repo, terugzetten één keer oefenen | 🔴 open |
| N-7 | L4 | Test bewijst niets | plugin-test controleert alleen dat tekst bestaat; `tsconfig.json:2` verwijst naar `.claude-plugin/types/tsconfig.json`, dat niet bestaat → typecheck kan niet draaien. Cockpit-tests draaien tegen een nagebootste `window.claude` | echte rooktest; mutatiecheck per test | 🔴 open |
| N-8 | L9 | Groei zonder cap | `nachtlog`, `bouwlog`, `outreach`, 11 eenmalige taken blijven staan; claim "61 van 25.000 documenten" en "bijna 1 MB" komt uit het document, niet door mij gemeten | cap + opruimroutine + alarm | 🟠 open, niet gemeten |
| N-9 | L5 / L6 | Constanten zonder bron | `memory/constanten` (urencriterium 1.225, aftrekposten, btw-reserve) bestaat niet in de repo; bedragen zitten in prompts en de artifact | register met bron, datum, jaar en verloopvlag; test die faalt zodra een jaar verstrijkt | 🔴 open |
| N-10 | L9 | Gebruikslimiet | taak "Gmail opruimen ronde 2" faalde op 8 okt met `USAGE_LIMIT_REACHED`; 19 taken delen één limiet | één werker; budget-hook | 🟠 bevestigd door een echte fout |
| N-11 | L2 | Documentatie beloofd, niet geleverd | het document zegt "startpakket gemaakt" (agents, skills, hook met test); niets daarvan in de repo | opnieuw opleveren in Fase 1 of het document corrigeren | 🔴 open |

Eerlijke correcties op het document (audit punt 10): alle 7 terugkerende taken hebben `CRON_TZ=Europe/Amsterdam`. De wintertijd op 25 okt is voor hen dus **geen** risico. De eenmalige nachtrondes staan in vaste UTC-tijd en lopen vóór 25 okt af. Het genoemde botsen van dagronde 21:47 met Avond 21:28 is geen tijdbotsing; wel overlapt de dagronde van vanavond met nachtronde 1 (de prompt vangt dat op met een skip-regel).

### 8.2 Boekhoudbaar: bestaand register (12 klassen) naast de 12 lessen

Bron: `.claude/bug-class-register.md`. Status hierna uit dat bestand; tests bevestigen ze niet allemaal.

| Les | Klasse in het register | Stand |
|---|---|---|
| L1 | #1 kolomindex, #2 rate-limit, #3 properties, #10 grondslag | gesloten; #1 is zelf-opruimend |
| L4 | #8 vals-groene test | gesloten (ledger-ratel) |
| L5/L6 | #7 jaar/tarief | tarief gesloten; API-versies "eerlijke grens" |
| L7 | #9 geld-precisie | gesloten, maar floats met één afrondpunt (zie B-2) |
| L8 | #11 verifier in één pad | gesloten voor audit-ketens |
| L9 | #3 en #12 | #12 deels open (3 plekken, F-SCALE-336/337/338) |
| L11 | #4 klantmail-poort | gesloten voor `src/`; **gat in `licence-server/` (B-1)** |
| L12 | geen eigen klasse | zie B-3 |

### 8.3 Boekhoudbaar: nieuwe bevindingen (deze fase)

| # | Les | Bevinding | Bewijs | Ernst (mijn inschatting) |
|---|---|---|---|---|
| B-1 | L11 | De mail-poort (`contract-klant-notificatie-gate.test.js:24-28`) leest alleen `src/*.gs`. De 8 mailaanroepen in `licence-server/` vallen erbuiten. Drie ervan gaan naar klanten (OTP-fallback `Code.gs:989`, licentiemail `:2066`, drip `:3441`). Of elk een eigen opt-out heeft is niet gecontroleerd | grep + testbestand | midden |
| B-2 | L7 | Dialoog rekent BTW met `Math.round(excl*pct*100)/100` (`NieuweBoeking.gs:795`; aantal×prijs op `:789`). Dit is dezelfde fout als F-BTW-340, nu in de browser. Gemeten: €21,50 × 21% → dialoog €4,51, opgeslagen factuur €4,52. Alleen weergave (de payload bevat geen totalen), maar de klant ziet een ander bedrag dan op de factuur komt | `node -e` | laag-midden (vertrouwen, geen boekingsfout) |
| B-3 | L12 | `RUNBOOK.md:40` heeft de placeholder "fysieke kluis-locatie X" nog staan; er is geen tweede beheerder; het runbook is van 2026-06-09, vóór de standby-server en latere wijzigingen | lezen | hoog (bus-factor) |
| B-4 | L10 | `SECURITY.md` is de standaard-GitHub-sjabloon met versies (5.1.x, 4.0.x) die niet bij `package.json` (2.0.0) passen en zonder meldadres | lezen | laag |
| B-5 | AVG | SEPA-QR stuurt IBAN/naam/bedrag/referentie naar quickchart.io en api.qrserver.com (F-3) | `Verkoopfacturen.gs:858-867` | midden |
| B-6 | L11 | Vaste `hc-ping.com`-URL staat nog in de bron (`Triggers.gs:1445`), terwijl de commentaar erboven zelf zegt dat derden dan valse groene pings kunnen sturen en alle klanten dezelfde heartbeat delen | lezen | laag |
| B-7 | L8 | Twee tests wijzigen een bijgehouden bestand (`website/version.json`) | `git status` na `jest` | laag |
| B-8 | — | Gemini-sleutel zit in de URL (`?key=`) | `BoekingEngine.gs:679,836` | laag |

Open in de ledger en relevant voor Fase 1: F-ACC-005 (voorbelasting zonder bewijsstuk, HOOG), F-ACC-334, F-SCALE-336/337/338 (klasse 12), F-DUR-151/152 (API-versies, config-schema), F-TAX-111/112/331/332 (wachten op de adviseur).

## 9. Wat alleen Sam kan beslissen (vijf vragen)

1. **Boekhoudbaar:** module binnen Noordster of los product achter een gedeelde kernel? Dit bepaalt Fase 2. Mijn advies: los product, gedeelde kernel, afhankelijkheid één kant op.
2. **Boekhoudbaar:** hoeveel klanten nu en verwacht over twee jaar? (invulveld voor volume- en tijdbudgetten)
3. **Fase 0b:** mag ik de cockpit-artifact en de database (`plan/*`, `nachtlog`, …) alleen lezen en in kaart brengen? Zonder dit blijft §4 voor de cockpit leeg. Mijn advies: ja.
4. **Taken:** mag ik na jouw akkoord in Fase 1 de 12 koppelingen per taak terugbrengen tot wat elke taak nodig heeft, en de nachtrondes na vannacht uitzetten? Vannacht raak ik niets aan. Hevy-sleutel vernieuwen blijft jouw stap.
5. **AVG:** de SEPA-QR lokaal laten genereren zodat IBAN en bedrag niet naar een derde gaan? Mijn advies: ja, maar het is een productkeuze.

## 10. Einde fase 0

- **Af:** kaart, uitgaande kanalen, afhankelijkheden, stromen, register voor Noordster, nieuwe bevindingen voor Boekhoudbaar.
- **Bewezen:** 3.294 tests groen; lint 0 fouten; 19 taken en hun rechten; de €4,51/€4,52-afwijking.
- **Open:** cockpit-schema's en artifact-inhoud (niet gelezen); `src/*.gs` niet regel voor regel gelezen; plugin-tests niet gedraaid; AVG-tekst niet gecontroleerd; `npm audit` niet beoordeeld.
- **Nodig van Sam:** antwoord op de vijf vragen en akkoord voor Fase 1. Zonder akkoord begin ik er niet aan.
- **Voorstel Fase 1-volgorde voor Noordster** (volgt het protocol; pas na akkoord): (1) constanten-register met verloopvlag, (2) noodpad dat alle taken veilig stopt of alleen-lezen zet, (3) goedkeuringspoort als hook met test, (4) geheimenscan op taak-prompts, (5) één geheugenbron. Punt 1 en 2 staan al bovenaan de backlog in het document.

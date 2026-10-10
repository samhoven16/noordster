# Uitwerking van het plan: per stap precies wat, waar en hoe we het bewijzen

Hoort bij `docs/plan-morgen.md` (het overzicht) en `docs/macbook.md` (Jarvis op de MacBook). Alles hieronder is gebaseerd op de code en routines zoals ze nu zijn. Wat ik niet kon controleren staat bij "Onbekend".

## Werkafspraken voor elke stap
- Eén pull request per stap, klein (richtlijn 100 regels), met een test die faalt als de regel stukgaat (les 4) en een mutatie die dat bewijst.
- Volgorde per stap: ontwerp in deze tekst, test eerst, dan code, dan `npm test` lokaal, dan de controle `Tests` op GitHub, dan merge.
- Copilot bouwt alleen wat hieronder bij "Copilot" staat, via een issue en een pull request. Ik toets die in een verse context voor ik merge.
- Eindigt een stap met een zichtbare wijziging, dan schrijf ik die in db `systeem/nieuw` (kaart "Wat is nieuw") en publiceer ik de artifact.

## Stap 0. Voorbereiding (Sam, plus ik op de Mac)
Zie `docs/plan-morgen.md` stap 0 en `docs/macbook.md`. Extra gevonden bij het uitwerken:
- De routine **"Noordster – Inspiratie"** (zondag 15:07) heeft 12 koppelingen aan (Gmail, Drive, Agenda, Notion, Zapier, Cloudflare, Base44, ...). Die routine leest het web. Privégegevens plus onbetrouwbare tekst plus een weg naar buiten is de gevaarlijke combinatie uit de veiligheidsnotitie in je Claude Doc (nog niet in deze repo vastgelegd; dat doe ik in `CLAUDE.md` als je ja zegt). Haal bij de routine alle koppelingen weg (claude.ai, Routines, bewerken). Ik kan koppelingen niet aanpassen met mijn gereedschap; verwijderen en opnieuw maken doe ik niet zonder jouw ja (regel 4).
- Nachtronde 9 staat nog aan en werkt aan de oude artifact. Uitzetten.

## Stap 1. Gegevens: `docs/gegevens.md` + test
**Waarom eerst:** alles hierna schrijft of leest de database. Nu staat de kennis verspreid over code en runs.
**Wat de code nu leest of schrijft (uit `nexus/index.html`):** `atlas`, `bouw`, `briefing`, `bus`, `chat`, `dagen`, `geheugen`, `geld`, `menuhist`, `notities`, `outreach`, `pijplijn`, `pipeline`, en de losse documenten `config/doel`, `config/compact`, `config/profiel`, `voeding/menu`, `voeding/boodschappen`, `systeem/nieuw`, `lichaam/hevy`.
**Valkuil die erin moet:** `pipeline` zijn de goedkeuringskaarten van de poort; `pijplijn` zijn de weekdocumenten van de verkoop (id `JJJJ-Www`). Twee bijna gelijke namen. Niet hernoemen (gegevens verplaatsen is verwijderen, regel 4); wel vet in de kaart zetten.
**Per collectie in de kaart:** eigenaar (cockpit of welke run schrijft), velden, grootte nu (uit N-8: chat 29 documenten, bus 2, briefing 1, pipeline 3), limiet (voorstel: 5 maal de huidige grootte of 500, wat lager is; Sam keurt goed), opruimregel (alleen met jouw ja), alarm (waarschuwing in de feed bij 80 procent van de limiet).
**Test `tests/gegevens.test.mjs`:** leest de collectienamen uit `nexus/index.html` (`db.collection("x")`, `db.doc("x/y")`) en uit de tabel. Faalt als er een collectie in de code staat die niet in de tabel staat, en andersom (behalve rijen gemarkeerd "alleen runs"). Mutatie: een nieuwe `db.collection("proef")` in de code moet de test laten falen.
**Klaar als:** test groen, mutatie gevangen, geen enkele collectie zonder eigenaar.
**Onbekend:** de echte documentaantallen vandaag; die haal ik met `ArtifactData list` op voor ik de limieten vastleg.

## Stap 2. Poort en logboek (Copilot bouwt, issue 17)
**Bestaande poortkaart** (`pipeline`): `{t, nonce, status, type, opdracht, bron, bronT, datum, dispatch, direct_klaar, direct{tool,args}, rejectedAt}`; status `PENDING_HUMAN_AUTH` of `REJECTED`, uitkomst in `dispatch` (`gestart` of `mislukt`).
**Opdracht aan Copilot (aanvulling op issue 17):** de tekst die vertelt wat een kaart is ("wacht op jouw klik", "afgewezen", "goedgekeurd en gestart", "starten mislukt", "in je agenda gezet") staat nu op **twee plekken** in de cockpit (de dagfeed en het overzicht). Maak daar **één** functie van en laat de nieuwe kaart "Logboek" dezelfde gebruiken (les 1: één plek, niet twee).
**Test:** kaarten met elke status in de testdatabase; de kaart toont per kaart het juiste label, "mislukt" is rood, meer dan 10 kaarten toont er 10, geen kaarten toont geen kaart. Mutatie: de kaart weghalen laat de test falen.
**Mijn toets:** ik lees de pull request zonder de bouwgeschiedenis, draai `npm test`, en probeer de poort te omzeilen (kaart zonder nonce, dubbele klik).

## Stap 3. Bronnen in één vaste vorm (ik bouw, Copilot reviewt)
**Beperking die het ontwerp bepaalt:** scripts kunnen niet naar de database schrijven; dat kan alleen een Claude-sessie met `ArtifactData`. De routines Ochtend, Avond en Week hebben bewust **geen** koppelingen. Dus: een script haalt op en print JSON, een sessie schrijft het weg.
**Vorm per bron:** `scripts/bronnen/<naam>.mjs` met `naam`, `lees()` die `{ok:true, gelezen_op, data}` of `{ok:false, reden}` geeft, en `verlooptNa` in uren. Een bron die niet verbonden is geeft `ok:false` met reden, nooit `ok:true`. Resultaat komt in doc `bronnen/<naam>`; de cockpit toont per bron "gelezen 3 uur geleden", "verlopen" of "niet verbonden".
**Volgorde:** (1) Hevy in deze vorm zetten (client bestaat, `scripts/hevy.mjs`), (2) bank via CSV: `scripts/bronnen/bank.mjs` leest een bestand dat jij zelf downloadt, bedragen in hele centen met één afrondpunt (les 7), alleen totalen per maand en categorie de database in, **het bestand zelf nooit in de repo** (`data/` in `.gitignore`, de repo is publiek), (3) Agenda en Gmail alleen lezen in een gewone sessie met koppelingen, niet in een routine.
**Tests:** contracttest die elke adapter laadt en de vorm controleert; test dat `ok:false` nooit als gelukt in de cockpit verschijnt; verlopen-vlag met een oude `gelezen_op`.
**Onbekend en nodig van Sam:** de kolommen van de ASN- en N26-CSV ken ik niet; ik bouw pas na drie voorbeeldregels zonder echte namen of rekeningnummers. De Hevy-aanroep is nog nooit met een echte sleutel gedaan.

## Stap 4. Vandaag: top 3 met reden
**Regel (vast, geen gokwerk):** kandidaten uit (a) open sollicitatie- of outreach-opvolging die vandaag of eerder moet, (b) de hoofdactie van de briefing, (c) de trainingsdag, (d) leren van vandaag. Rangorde per soort: opvolging 100, hoofdactie 90, training 60, leren 40, plus 10 als de opvolging al verlopen is. Maximaal 3. Bij gelijk wint de oudste. Elk punt toont zijn bron en reden uit het veld waar het vandaan komt.
**Leeg:** geen kandidaten betekent de tekst "Niets te kiezen: geen gegevens (niet gecontroleerd)", geen verzonnen punt.
**Waar:** een pure functie `vandaagTop(S)` in `nexus/index.html`, naast `briefCard()`.
**Copilot:** alleen de weergave (rustige kleuren met betekenis, volgorde, reden onder elk punt) als aparte pull request ná de functie. Issue-tekst: "Ontwerp de kaart Top 3 voor `vandaagTop(S)`; gebruik geen eigen gegevens; test met lege en volle database."
**Tests:** volle database geeft 3 in de goede volgorde; lege database geeft de lege-tekst; verlopen opvolging staat boven een gewone. Mutatie: rangorde omdraaien faalt.

## Stap 5. Router: één waarheid voor cockpit en Jarvis
**Gevonden verschil:** `jarvis/router.py` heeft een regel die `routeTask` in de cockpit niet heeft: staat er agenda, mail, Drive, Notion of een dag in de vraag, dan nooit "snel" (tools nodig). Ik neem die regel over in de cockpit (veiliger).
**Contract:** `tests/router-gevallen.json` met vragen, rol en foto, en het verwachte niveau. De Python-test en de cockpit-test draaien dezelfde lijst. Een nieuwe regel zonder nieuw geval is niet af.
**Mutatie:** de agenda-regel uit één van de twee halen laat een test falen.
**Onbekend:** wat de kosten per niveau in de praktijk worden; Jarvis toont ze per vraag, dat meet ik na een week.

## Stap 6. Engineer-modus en bewaking
- Weekritme staat in `CLAUDE.md`. Wat nog ontbreekt: een routine die dagelijks het bovenste backlog-item van de dagrol oppakt en een **draft pull request** maakt, zonder koppelingen. Eerst één proefrun; of een routine bij GitHub kan werken met jouw repo-toegang weet ik niet tot het getest is.
- Copilot-pull requests: ik toets elke in een verse context. Automatisch op een gebeurtenis kan ik dat niet; dat gaat dus op afroep ("toets de open pull requests") en in de dagelijkse run.
- Alarm: de feed meldt als een collectie boven 80 procent van haar limiet komt (stap 1) of een bron verlopen is (stap 3).

## Stap 7. Audit (aparte sessie)
Skill `audit`, geen bouwwerk in dezelfde sessie. Bevindingen komen als regels in `memory/backlog.md`. Eerste keer: na stap 1 tot en met 5, dus niet morgen.

## Tijdlijn morgen (richtlijn, jij beslist het tempo)
1. Ochtend: jij stap 0 en `docs/macbook.md` (15 minuten). Ik start stap 1 en lees het resultaat van Copilot op issue 17.
2. Midden: stap 1 klaar en gemerged, stap 2 getoetst en gemerged.
3. Middag: stap 3 (Hevy en bank) zodra de sleutel en de voorbeeldregels er zijn; stap 5 kan zonder jou.
4. Avond: stap 4 functie, dan Copilot voor de weergave. Laatste regel: wat werkt nu zichtbaar en wat is de volgende stap.

## Wat ik van Sam nodig heb (kort)
1. Stap 0 uit het plan en de Mac-installatie.
2. Apparaat voor slaap en herstel (Apple Watch, Garmin, Whoop of geen).
3. Drie voorbeeldregels uit de ASN- en N26-CSV zonder namen of rekeningnummers (alleen de kolomkoppen en de vorm van een bedrag).
4. Haal de koppelingen weg bij de routine "Noordster – Inspiratie".

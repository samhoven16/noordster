# Bug-klasse-register Noordster (L1)

Een bevinding is pas klaar als de klasse is gesloten: contracttest, chokepoint, of onmogelijk door ontwerp. Bron en bewijs: `docs/fase0-rapport.md` §8.1.

| # | Klasse | Sluiting | Status |
|---|---|---|---|
| N-1 | Uitzending buiten de poort om (L11) | `gate.mjs` + test (`tests/gate.test.mjs`) voor sessies in deze repo. Cloud-taken: toegestane tools per taak, nog te doen | 🟠 deels: poort gebouwd, 19 cloud-taken nog open |
| N-2 | Geheim in een prompt (L12) | sleutel vernieuwen (Sam), geheimenvak, scan-test op taak-prompts | 🔴 open |
| N-3 | Geheugen op meerdere plekken (L3) | één bron + test | 🔴 open |
| N-4 | Maker is ook controleur (L8) | testset buiten bereik van de bouwers; publiceren als concept | 🔴 open |
| N-5 | Privédata + onbetrouwbare invoer + uitzending in één taak | rechten per taak splitsen | 🔴 open |
| N-6 | Cockpit niet in git (L3, L12) | export naar repo, terugzetten oefenen | 🔴 open |
| N-7 | Test bewijst niets (L4) | `npm test` heeft mutatiecheck (poort en verloopvlag); plugin-tests en rooktest cockpit nog open | 🟠 deels |
| N-8 | Groei zonder cap (L9) | cap + alarm. Gemeten: database 23 documenten, artifact 140.533 bytes | 🟠 laag risico nu, cap ontbreekt |
| N-9 | Constanten zonder bron (L5, L6) | `memory/constanten.json` + `scripts/constanten-check.mjs` + tests, verloopvlag getest | 🟠 gebouwd, 4 van 4 nog "ongecontroleerd" (bron onbereikbaar) |
| N-10 | Gebruikslimiet (L9) | één werker, budget-hook | 🟠 open, eerder gebeurd (8 okt) |
| N-11 | Documentatie beloofd, niet geleverd (L2) | dit startpakket zit nu in de repo | 🟢 gesloten voor CLAUDE.md, poort, noodstop, constanten; agents en skills (planner/werker/criticus) nog niet |
| N-12 | Regels spreken elkaar tegen (L3) | `plan/audit.regel` verbiedt zelf nieuwe rondes aanmaken, `plan/masterplan.zelfverbetering` en ronde 11 staan het toe. Tijdvak verschilt ook (05:03–06:03Z in plan, 06:03–08:03Z in taak). Eén bron voor het protocol | 🔴 open |

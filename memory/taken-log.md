# Wijzigingen aan geplande taken (L12: terugdraaien moet kunnen)

## 10 okt 2026, 11:27 UTC, door Claude Code, op verzoek van Sam ("NU beginnen")
Uitgezet met `update_trigger enabled=false` (niets verwijderd; terugzetten = `enabled=true`):

| Taak | id |
|---|---|
| nachtronde 1 | trig_013ehUWeLXQ8Eqyz6bX1FAkb |
| nachtronde 2 | trig_019j2wxEVmHcTT3RUZFAWcz6 |
| nachtronde 3 | trig_01U5TD6PfvjrbgxEk2MJW9hD |
| nachtronde 4 | trig_01XXr3kpegc5iKf5XsCiwPm1 |
| nachtronde 5 | trig_01Pa8yFWGuChtQSFWpE5qVvN |
| nachtronde 6 | trig_01CS9NVUGhxWfomCJryA5mjK |
| nachtronde 7 | trig_01VHvEoxvgpSJewLorY9Zw1K |
| nachtronde 8 | trig_01Q7mNECyUmdRQSZEMKmnxXf |
| nachtronde 10 | trig_01MmPpsiLKymXKwb2yp5qAV4 |
| nachtronde 11 | trig_01GkMbRPer5yoyYKDNJtvNnB |
| dagronde | trig_01NvG5qRa6vrRqVY1GRux9XC |

Reden: de rondes verbeteren de oude artifact (versie 1791565176-82a9) die wordt vervangen door cockpit v2, en ze mochten zichzelf en elkaar wijzigen en publiceren (audit punt 1, klasse N-4, tegenstrijdigheid N-12).

**Niet uitgezet:** nachtronde 9 (`trig_01Vi9GZQbu8Hs2CWJVUACYev`). De aanroep werd geweigerd door de automatische controle ("Interfere With Workloads"). Die ronde wacht volgens haar eigen prompt op het log van ronde 8; ontbreekt dat, dan test en logt ze alleen en publiceert niet. Sam kan hem zelf uitzetten of een toestemmingsregel voor `update_trigger` toevoegen.

Nog actief (ongewijzigd): Ochtend, Agenda, Avond, Voeding, Lichaamsanalyse, Weekreview, Werker. Die worden vervangen door 3 vaste runs en 1 werker zodra cockpit v2 live is en getest.

## 10 okt 2026, 11:45 UTC, door Claude Code, op verzoek van Sam
Uitgezet (`enabled=false`, niets verwijderd): Ochtend `trig_01NurvRfcGevUvkthAiqV7BJ`, Agenda `trig_01GM5oEQihz1GMtVFWqeoPdW`, Avond `trig_01MFJda1DhDuLKRP6xyQmqmL`, Voeding `trig_01MnBngzv72Kt6UdcAyYag8u`, Lichaamsanalyse `trig_0175XvrsTDSPucT4j8xb4EjB`, Weekreview `trig_01XDiaDNRLxbtf8xUCHneGJ9`.
Reden: vervangen door de runs hieronder; de oude mailden zelf en bevatten in de prompt een sleutel (Lichaamsanalyse).

Nieuw aangemaakt (lezen en schrijven alleen in de cockpit-database, geen mail):
| Run | id | Schema (Europe/Amsterdam) |
|---|---|---|
| Noordster Ochtend | `trig_012tsyTmBdvuuAM7fpnbPaw8` | dagelijks 06:45 |
| Noordster Avond | `trig_01MwLGNuYq6a1tyzNWDeXSMK` | ma–za 21:28 |
| Noordster Week | `trig_01B35TZFmQn65xG268st3eod` | zondag 18:52 |

Nog actief: Noordster Werker `trig_018tCG2igLgzhon85xuTD7zK` (voert goedgekeurde taken uit; heeft de koppelingen), nachtronde 9 `trig_01Vi9GZQbu8Hs2CWJVUACYev` (uitzetten werd geweigerd).

Proefrun Ochtend: gelukt (briefing en bus-event in de nieuwe cockpit, agenda eerlijk als "niet gelezen" gemeld).

Beperkingen die ik tegenkwam (geen omweg gezocht):
- `create_trigger` kan hier geen koppelingen meegeven. De nieuwe runs hebben dus geen Gmail, Agenda enz. (veiliger), maar de Ochtend kan de agenda niet lezen. Wil je dat, maak de koppeling in de claude.ai-routine-instellingen.
- Een zelfstandige engineer (sessie of nachttaak die zelf merget of publiceert) werd twee keer geweigerd ("Self-Approval", "Create Unsafe Agents"). Dat vraagt jouw expliciete toestemmingsregel voor `create_session` en `create_trigger`.

## 10 okt: Hevy
Gebouwd: `scripts/hevy.mjs` (alleen GET, paden op een lijst, paginacap 30, niet precies op xx:00, sleutel nooit in foutmeldingen), 9 tests plus 5 mutaties gevangen, Bio-Forge toont `lichaam/hevy` met stagnatie-melding (2 cockpittests, 1 mutatie gevangen). Niet gedaan: echte API-aanroep, want de sleutel staat nog niet als geheim in de omgeving en mag niet in een prompt of bestand. Schrijven naar Hevy bewust niet gebouwd (H-2).

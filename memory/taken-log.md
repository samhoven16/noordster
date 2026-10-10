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

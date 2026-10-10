# Instructies voor GitHub Copilot in deze repo

**Werk alleen in deze repo (`samhoven16/noordster`).** De repo `nexus-os-elite` wordt niet gebruikt: maak geen nieuwe repo's en push niets daarheen.

Dit is Noordster, het persoonlijke systeem van Sam Hoven. Lees `CLAUDE.md` voor je iets doet; die regels gelden ook voor jou. De belangrijkste:

1. **Nooit direct op `main` pushen.** Maak een branch en een pull request. Sam of Claude Code merget na groene tests.
2. **Raak `nexus/` niet aan.** Dat is de echte cockpit (Nexus), met tests in `tests/cockpit.test.mjs`. De map `cockpit/` is jouw speelveld voor ontwerpideeën; zet daar niets met verzonnen cijfers die als echt kan gelden zonder "voorbeeld" erbij.
3. **Geen verzonnen cijfers, bedrijven of contacten** in code of tekst die als echt kan gelden. Voorbeelden alleen met "voorbeeld" erbij.
4. **Geen sleutels, wachtwoorden of persoonlijke gegevens** in bestanden. Deze repo moet privé zijn; ga ervan uit dat alles dat je schrijft later openbaar kan worden.
5. **Alles naar buiten (mail, agenda, betalingen) gaat pas na klik van Sam**, via de poort in `.claude/hooks/gate.mjs`. Pas `.claude/` niet aan.
6. **Draai `npm test`** voor je een pull request opent en zeg wat je niet hebt kunnen controleren.
7. Kort, in eenvoudig Nederlands.

Bouwen gebeurt in Claude Code; Copilot helpt met voorstellen en kleine wijzigingen via pull requests. Zie `docs/overdracht.md`.

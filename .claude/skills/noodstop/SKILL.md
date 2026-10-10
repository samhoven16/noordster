---
name: noodstop
description: Noodstop. Gebruik als Sam zegt "stop alles", "noodstop" of er iets misgaat met mail, agenda of geplande taken. Zet alles veilig stil of alleen-lezen en legt vast wat is uitgezet zodat het terug kan.
disable-model-invocation: true
---

# Noodstop (L12)

Doel: in twee minuten staat alles stil, en kan het later precies zo terug.

## Stap 1. Poort dicht (altijd eerst)
Draai `node .claude/hooks/gate.mjs --noodstop`. Vanaf nu blokkeert de poort elke schrijfactie via Gmail, Agenda, Drive, Notion, Zapier, Brevo, Docs en Claude Code Remote. Lezen blijft werken.

## Stap 2. Geplande taken uit
1. `list_triggers` (claude-code-remote) met `enabled: true`.
2. Zet elke taak waarvan de naam met "Noordster" begint op `enabled: false` met `update_trigger`. Raak taken van anderen niet aan.
3. Schrijf de lijst (id, naam, schema) naar `memory/noodstop-log.md`. Zonder die lijst kan het niet netjes terug.

## Stap 3. Controle
`list_triggers` met `enabled: true` mag geen Noordster-taak meer tonen. Meld aan Sam in drie regels: wat staat uit, wat blijft lezen, hoe het terugkomt.

## Terugzetten (alleen op verzoek van Sam)
1. `node .claude/hooks/gate.mjs --hervat`.
2. Zet de taken uit `memory/noodstop-log.md` weer aan met `update_trigger`, een voor een, en meld welke.

## Eerlijke grens
De poort-hook werkt alleen in sessies die in deze repo draaien. Cloud-taken die buiten de repo draaien stoppen door stap 2, niet door stap 1.

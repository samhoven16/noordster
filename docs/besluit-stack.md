# Besluit: stack en aanpak voor Noordster (10 okt 2026)

Sam vroeg: onderzoek altijd de beste optie, volg niet mijn voorkeur. Dit is de uitkomst, met wat wel en niet gecontroleerd is. Herzien bij een van de "wanneer anders"-punten.

## Besluit
1. **Hoofdtaal TypeScript**, Python alleen voor data en analyse. Reden: Sams doel is een scherm dat er bijzonder uitziet en overal opent; dat is een webpagina. Eén taal voor scherm en achterkant. De Agent SDK bestaat voor beide talen (bron 4).
2. **Motor: de Claude Agent SDK, geen LangGraph of OpenAI Agents SDK.** Hij heeft al de agentlus, tools, MCP, subagents, hooks (onze goedkeuringspoort) en sessies. Extra lagen voegen foutplekken toe voor één gebruiker zonder klanten.
3. **Scherm: eerst een installeerbare webpagina (PWA), later pas een app-schil (Tauri).** Tauri is licht (indicatief 42 MB tegen 168 MB geheugen bij Electron, uit één blog), maar vraagt Rust-kennis en veel testwerk per besturingssysteem (bron 3).
4. **Eigen jarvis-app voor Sam zelf: ja. Voor klanten: nee.** Persoonlijk gebruik van de Agent SDK op een eigen abonnement valt onder "gewoon individueel gebruik"; producten voor anderen, ook Boekhoudbaar met 20.000 klanten, moeten API-sleutels gebruiken (bron 1).
5. **Jarvis v0 blijft in Python** tot Sam hem op zijn laptop heeft geprobeerd. Daarna omzetten naar TypeScript. Geen werk omzetten dat nog niet bewezen is.

## Wat gecontroleerd is
- Anthropic zelf (bron 1): de advertentielimieten van Pro en Max gaan uit van "gewoon, individueel gebruik van Claude Code en de Agent SDK". Wat precies "gewoon" is staat er niet. Daarom is "Pro voelt als Max" **niet te beloven**; een agent die dag en nacht draait kan buiten die lijn vallen.
- Anthropic zelf: wie producten bouwt moet API-sleutels gebruiken en mag geen inlog of Pro/Max-gegevens van gebruikers doorsluizen of bewaren.
- De Agent SDK voor TypeScript bestaat (`@anthropic-ai/claude-agent-sdk`) en heeft een eigen Claude Code-programma ingebouwd (bron 4).
- Een echte aanroep via de Python-SDK werkte in de cloud-omgeving (Haiku, $0,0045). Op Sams laptop niet geprobeerd.

## De geplakte "Nexus OS"-blauwdruk: wat ik overneem en wat niet
Overnemen (past bij wat er al is): een centrale coördinator, sectoren met teams, een veiligheidslaag (hebben we: poort, noodstop, Criticus), een geheugen, en een scherm dat leeft.
Niet overnemen:
- **Links die niet kloppen of niet bestaan.** `github.com/guarderails-ai/guardrails` geeft 404 (de echte is `guardrails-ai/guardrails`, een typfout die een kaper kan misbruiken); `traceloop/openllm` geeft 404; "maestro-ai" bestaat maar is een bedrijfssysteem voor muzieklabels met 2 sterren, geen orkestratiesjabloon; garak is nu `NVIDIA/garak` (bronnen 5 en 6). **Niets uit die lijst installeren zonder de echte bron te controleren.**
- **Verzonnen cijfers in de schermen** ($47.200, 92% match, 12% vetpercentage). Dat botst met regel 5. Alleen echte gegevens.
- **Beroemde mensen als agents** (Buffett, Kahneman, Huberman). Het zijn geen die mensen en het geeft schijnautoriteit. Beter: een werker met een methode en bronnen, gecontroleerd door de Criticus.
- **De stapel LangChain + LangGraph + Guardrails + NeMo + GraphRAG + pgvector + Redis + Celery.** Voor één gebruiker is dat tien extra onderdelen die kunnen breken. Pas bij een concrete muur.
- **Camera-vormcontrole, vaste "dating"-doelen en dergelijke.** Niet gevraagd door Sam in zijn missie; zijn keuzes zijn van hemzelf (regel 10).
- **3D-wereld als eerste stap.** Mooi, maar het levert pas waarde met echte gegevens eronder. Volgorde: echte gegevens, dan beeld.

## Wanneer ik van besluit verander
Alleen bij een van deze muren: (1) een server moet altijd luisteren naar meldingen van buiten (betalingen); (2) Sam wil per taak het exacte model en de kosten sturen; (3) klanten moeten de cockpit zelf gebruiken. Dan: eigen app op Cloudflare met API-sleutel.

## Bronnen
1. https://code.claude.com/docs/en/legal-and-compliance (Anthropic, direct gelezen)
2. https://github.com/lrrecords/maestro-ai (direct gelezen)
3. Vergelijking Tauri, Electron, PWA: https://www.pkgpulse.com/guides/electron-vs-tauri-2026 (blog, cijfers niet onafhankelijk gecontroleerd)
4. https://code.claude.com/docs/en/agent-sdk/typescript.md (via zoekresultaat; niet zelf gelezen)
5. https://github.com/guardrails-ai/guardrails
6. https://github.com/NVIDIA/garak

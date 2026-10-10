"""Jarvis v0: lokale server op 127.0.0.1 met een chatpagina. Alleen lezen: Read, Grep, Glob.
Schrijven loopt via de poort (.claude/hooks/gate.mjs), die hier meeloopt omdat de projectinstellingen worden geladen."""
import json
import secrets
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import HTMLResponse, StreamingResponse

from .router import kies

REPO = Path(__file__).resolve().parent.parent
PAGINA = (Path(__file__).parent / "static" / "index.html").read_text(encoding="utf-8")
LEZEN = ["Read", "Grep", "Glob"]
STIJL = "Antwoord kort, in eenvoudig Nederlands. Je bent Noordster, de assistent van Sam Hoven. Volg CLAUDE.md."


async def claude_vraag(route, tekst):
    """Echte aanroep via de Claude Agent SDK. Geeft dicts: {'tekst': ...} en op het eind {'klaar': {...}}."""
    from claude_agent_sdk import AssistantMessage, ClaudeAgentOptions, ResultMessage, TextBlock, query

    opties = ClaudeAgentOptions(
        model=route.model, effort=route.effort, cwd=str(REPO), setting_sources=["project"],
        allowed_tools=LEZEN, permission_mode="default",
        system_prompt={"type": "preset", "preset": "claude_code", "append": STIJL},
    )
    async for m in query(prompt=tekst, options=opties):
        if isinstance(m, AssistantMessage):
            for b in m.content:
                if isinstance(b, TextBlock) and b.text:
                    yield {"tekst": b.text}
        elif isinstance(m, ResultMessage):
            yield {"klaar": {"kosten_usd": m.total_cost_usd, "fout": bool(m.is_error)}}


def maak_app(vraag_fn=claude_vraag, poort=8765, token=None):
    token = token or secrets.token_urlsafe(24)
    app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
    toegestaan = {f"127.0.0.1:{poort}", f"localhost:{poort}", "testserver"}

    @app.middleware("http")
    async def alleen_lokaal(request: Request, call_next):
        # Tegen DNS-rebinding: een andere hostnaam krijgt niets.
        if request.headers.get("host", "") not in toegestaan:
            return HTMLResponse("Niet toegestaan", status_code=403)
        return await call_next(request)

    @app.get("/", response_class=HTMLResponse)
    async def pagina():
        return PAGINA.replace("__TOKEN__", token)

    @app.post("/api/vraag")
    async def api_vraag(body: dict, x_jarvis_token: str = Header(default="")):
        # Een eigen header dwingt een preflight af; een andere website kan die niet krijgen.
        if not secrets.compare_digest(x_jarvis_token, token):
            raise HTTPException(403, "token ontbreekt")
        tekst = str(body.get("tekst", "")).strip()[:4000]
        if not tekst:
            raise HTTPException(400, "lege vraag")
        route = kies(tekst, rol=body.get("rol"))

        async def stroom():
            yield f"event: route\ndata: {json.dumps({'label': route.label, 'niveau': route.niveau, 'model': route.model}, ensure_ascii=False)}\n\n"
            try:
                async for deel in vraag_fn(route, tekst):
                    soort = "klaar" if "klaar" in deel else "tekst"
                    yield f"event: {soort}\ndata: {json.dumps(deel, ensure_ascii=False)}\n\n"
            except Exception as e:  # geen sleutel of inlog, geen netwerk: zeg het eerlijk
                yield f"event: fout\ndata: {json.dumps({'tekst': type(e).__name__ + ': ' + str(e)[:200]})}\n\n"

        return StreamingResponse(stroom(), media_type="text/event-stream")

    return app, token

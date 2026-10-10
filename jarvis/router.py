"""Router: kiest per vraag model en inspanning en zegt waarom.
Zelfde regels als routeTask in cockpit/index.html, maar hier kiest hij echte modellen."""
import json
import re
from dataclasses import dataclass
from pathlib import Path

MODELLEN = json.loads((Path(__file__).parent / "modellen.json").read_text(encoding="utf-8"))
ZWAAR_ROLLEN = {"fiscalist", "trader", "risk", "sportwet"}
ANALYSE = re.compile(r"analyse|plan|stagn|waarom|advies|risico|btw|aftrek|belasting|schema|limiet", re.I)
GROOT = re.compile(r"strategie|businessplan|diepgaand|jaarplan|vergelijk .* en ", re.I)
LOG = re.compile(r"^\s*(energie|getraind|gekookt|geleerd|ondernemersuren|uren)\b", re.I)
NIET_KORT = re.compile(r"menu|plan|week|waarom|advies|analyse|toets|overhoor|grafiek|tabel|wat moet", re.I)
TOOLS_NODIG = re.compile(r"agenda|mail|drive|notion|afspraak|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag|morgen|vandaag", re.I)


@dataclass(frozen=True)
class Route:
    niveau: str
    model: str
    effort: str
    why: str

    @property
    def label(self) -> str:
        return f"{MODELLEN[self.niveau]['naam']} · {self.why}"


def _route(niveau: str, why: str) -> Route:
    m = MODELLEN[niveau]
    return Route(niveau, m["model"], m["effort"], why)


def kies(tekst: str, heeft_foto: bool = False, rol: str | None = None) -> Route:
    t = tekst or ""
    if heeft_foto:
        return _route("default", "foto")
    if len(t) > 700 or GROOT.search(t):
        return _route("complex", "grote vraag")
    if rol in ZWAAR_ROLLEN and ANALYSE.search(t):
        return _route("complex", f"{rol}: geld of gezondheid")
    if len(t) < 200 and LOG.search(t):
        return _route("quick", "dag loggen")
    if len(t) < 200 and not NIET_KORT.search(t):
        if TOOLS_NODIG.search(t):  # agenda of mail erbij: nooit snel
            return _route("default", "agenda of mail erbij")
        return _route("quick", "korte vraag")
    return _route("default", "gewone vraag")

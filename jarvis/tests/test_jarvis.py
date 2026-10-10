import json
import unittest

from jarvis.router import kies


class RouterTests(unittest.TestCase):
    def test_log_is_snel(self):
        r = kies("Energie 7, getraind")
        self.assertEqual((r.niveau, r.model, r.effort), ("quick", "claude-haiku-5-5", "low"))
        self.assertEqual(r.label, "Snel · dag loggen")

    def test_grote_vraag_is_zwaar(self):
        self.assertEqual(kies("Maak een uitgebreid businessplan").niveau, "complex")
        self.assertEqual(kies("x" * 701).niveau, "complex")

    def test_agenda_woord_nooit_snel(self):
        self.assertEqual(kies("Wat staat er morgen").niveau, "default")

    def test_analyse_door_specialist_is_zwaar_zonder_rol_niet(self):
        self.assertEqual(kies("Analyseer mijn btw", rol="fiscalist").niveau, "complex")
        self.assertNotEqual(kies("Analyseer mijn btw").niveau, "complex")

    def test_foto_en_gewone_vraag_standaard(self):
        self.assertEqual(kies("hoi", heeft_foto=True).niveau, "default")
        self.assertEqual(kies("Maak een weekmenu met linzen").niveau, "default")


try:
    from fastapi.testclient import TestClient
    from jarvis.server import maak_app
    KAN = True
except ImportError:  # fastapi of httpx ontbreekt: zie requirements-dev.txt
    KAN = False


async def nep(route, tekst):
    yield {"tekst": "Testantwoord op: " + tekst}
    yield {"klaar": {"kosten_usd": 0.001, "fout": False}}


@unittest.skipUnless(KAN, "fastapi of httpx ontbreekt")
class ServerTests(unittest.TestCase):
    def setUp(self):
        app, self.token = maak_app(vraag_fn=nep, token="geheim")
        self.c = TestClient(app, base_url="http://testserver")

    def post(self, headers=None, host=None, body=None):
        h = dict(headers or {})
        if host:
            h["host"] = host
        return self.c.post("/api/vraag", json=body or {"tekst": "Energie 7"}, headers=h)

    def test_zonder_token_geweigerd(self):
        self.assertEqual(self.post().status_code, 403)
        self.assertEqual(self.post({"x-jarvis-token": "fout"}).status_code, 403)

    def test_vreemde_host_geweigerd(self):
        self.assertEqual(self.post({"x-jarvis-token": "geheim"}, host="evil.example").status_code, 403)
        self.assertEqual(self.c.get("/", headers={"host": "evil.example"}).status_code, 403)

    def test_stroom_geeft_route_tekst_en_klaar(self):
        r = self.post({"x-jarvis-token": "geheim"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("event: route", r.text)
        self.assertIn("Snel · dag loggen", r.text)
        self.assertIn("Testantwoord op: Energie 7", r.text)
        self.assertIn("event: klaar", r.text)

    def test_lege_vraag_geweigerd(self):
        self.assertEqual(self.post({"x-jarvis-token": "geheim"}, body={"tekst": "  "}).status_code, 400)

    def test_fout_van_claude_wordt_gemeld_niet_verzwegen(self):
        async def stuk(route, tekst):
            raise RuntimeError("geen inlog")
            yield
        app, _ = maak_app(vraag_fn=stuk, token="geheim")
        r = TestClient(app, base_url="http://testserver").post("/api/vraag", json={"tekst": "hoi"}, headers={"x-jarvis-token": "geheim"})
        self.assertIn("event: fout", r.text)
        self.assertIn("geen inlog", r.text)

    def test_pagina_bevat_token_en_geen_placeholder(self):
        t = self.c.get("/").text
        self.assertIn('TOKEN="geheim"', t)
        self.assertNotIn("__TOKEN__", t)

    def test_modelnamen_staan_alleen_in_modellen_json(self):
        import pathlib
        src = pathlib.Path("jarvis/router.py").read_text() + pathlib.Path("jarvis/server.py").read_text()
        self.assertNotIn("claude-", src)
        self.assertEqual(json.loads(pathlib.Path("jarvis/modellen.json").read_text())["quick"]["model"], "claude-haiku-5-5")


if __name__ == "__main__":
    unittest.main()

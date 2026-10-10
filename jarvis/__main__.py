import threading
import webbrowser

import uvicorn

from .server import maak_app

POORT = 8765
app, token = maak_app(poort=POORT)
threading.Timer(1.0, lambda: webbrowser.open(f"http://127.0.0.1:{POORT}/")).start()
uvicorn.run(app, host="127.0.0.1", port=POORT, log_level="warning")

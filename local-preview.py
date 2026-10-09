"""Serve the downloaded site at localhost so browser modules can load."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser

ROOT = Path(__file__).resolve().parent / "public"
assert (ROOT / "studio" / "index.html").is_file(), "Missing public/studio/index.html"


class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.send_response(302)
            self.send_header("Location", "/studio/index.html")
            self.end_headers()
            return
        super().do_GET()


server = ThreadingHTTPServer(("127.0.0.1", 0), partial(PreviewHandler, directory=str(ROOT)))
url = f"http://127.0.0.1:{server.server_port}/studio/index.html"
print(f"Living Studio: {url}", flush=True)
print("Keep this window open while browsing; press Ctrl+C to stop.", flush=True)
webbrowser.open(url)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()

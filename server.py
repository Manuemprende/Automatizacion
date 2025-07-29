import http.server
import socketserver
import webbrowser
import threading

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # silenciar logs


def open_browser():
    webbrowser.open(f'http://localhost:{PORT}/index.html')

if __name__ == '__main__':
    threading.Timer(1.0, open_browser).start()
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Servidor iniciado en http://localhost:{PORT}")
        httpd.serve_forever()

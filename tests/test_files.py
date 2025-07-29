import os

def test_files_exist():
    for path in ['index.html', 'static/script.js', 'static/style.css', 'static/logo.svg', 'server.py']:
        assert os.path.exists(path)

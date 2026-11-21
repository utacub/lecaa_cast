#!/usr/bin/env python3
"""Keep sw.js and pwa.js in step with the published files.

Run from the repository root after any change to index.html, pwa.js, the manifest or the icons:
    python3 maintenance/update-sw.py
It writes the exact size of index.html (used for the download progress bar) and a cache
version derived from the content of every shell file, so browsers download the new version.
"""
import hashlib, re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
shell = ['index.html', 'pwa.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
         'icons/maskable-512.png', 'icons/apple-touch-icon.png']
size = (root / 'index.html').stat().st_size

def write(name, pattern, value):
    path = root / name
    text, count = re.subn(pattern, value, path.read_text(encoding='utf-8'), count=1)
    assert count == 1, f'{name}: pattern not found: {pattern}'
    path.write_text(text, encoding='utf-8')

write('pwa.js', r'const APP_BYTES = \d+;', f'const APP_BYTES = {size};')
write('sw.js', r'const APP_BYTES = \d+;', f'const APP_BYTES = {size};')
digest = hashlib.sha256()
for name in shell + ['sw.js']:
    data = (root / name).read_bytes()
    if name == 'sw.js':
        data = re.sub(rb"const CACHE = PREFIX \+ '[^']*';", b'', data)
    digest.update(name.encode() + b'\0' + data)
version = re.search(r'Versión \*\*([0-9.]+)\*\*', (root / 'README.md').read_text(encoding='utf-8')).group(1)
write('sw.js', r"const CACHE = PREFIX \+ '[^']*';", f"const CACHE = PREFIX + '{version}-{digest.hexdigest()[:8]}';")
print(f'index.html: {size} bytes; cache {version}-{digest.hexdigest()[:8]}')

#!/usr/bin/env bash
# Build varian yang meng-host sendiri Python runtime (tanpa CDN): dist-selfhosted/
# Berguna untuk lingkungan yang memblokir CDN atau hosting offline/intranet.
# Prasyarat: wheel paket sudah ada di node_modules/.pyodide-cache (jalankan `npm run test:content` sekali).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=dist-selfhosted
VITE_PYODIDE_LOCAL=1 npx vite build --outDir "$OUT" --emptyOutDir
mkdir -p "$OUT/pyodide"
for f in pyodide.mjs pyodide.asm.mjs pyodide.asm.wasm python_stdlib.zip pyodide-lock.json; do
  cp "node_modules/pyodide/$f" "$OUT/pyodide/"
done
cp node_modules/.pyodide-cache/*.whl "$OUT/pyodide/"
du -sh "$OUT"

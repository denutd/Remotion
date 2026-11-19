#!/usr/bin/env bash
# Audit render final: info stream, frame hitam, lembar kontak 1 fps, kata per detik.
#   bash scripts/qa/audit.sh kertas-a4
set -euo pipefail

slug="$1"
src="out/${slug}.mp4"
dir="out/audit-${slug}"
mkdir -p "$dir"
rm -f "$dir"/sheet-*.jpg

FF="${FFMPEG:-ffmpeg}"
if ! command -v "$FF" >/dev/null 2>&1 && [ -f "/c/ProgramData/chocolatey/bin/ffmpeg.exe" ]; then
  FF="/c/ProgramData/chocolatey/bin/ffmpeg.exe"
fi
PROBE="${FFPROBE:-ffprobe}"
if ! command -v "$PROBE" >/dev/null 2>&1 && [ -f "/c/ProgramData/chocolatey/bin/ffprobe.exe" ]; then
  PROBE="/c/ProgramData/chocolatey/bin/ffprobe.exe"
fi

echo "== durasi & stream"
"$PROBE" -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact=p=0 "$src"

echo "== frame hitam (blackdetect)"
"$FF" -v info -i "$src" -vf "blackdetect=d=0.1:pix_th=0.06" -an -f null - 2>&1 | grep -E "black_start" || echo "tidak ada"

echo "== lembar kontak 1 fps"
"$FF" -v error -y -i "$src" -vf "fps=1,scale=240:-2,tile=8x2" -q:v 4 "$dir/sheet-%02d.jpg"
ls "$dir"

echo "== kata per detik"
node -e '
const t = require("./src/videos/'"$slug"'/timeline.generated.json");
const by = {};
for (const w of t.words) { const s = Math.floor(w.start); (by[s] ??= []).push(w.display); }
for (let s = 0; s <= Math.ceil(t.durationInFrames / t.fps); s++) console.log(String(s).padStart(2), (by[s] ?? []).join(" "));
' > "$dir/words.txt"
cat "$dir/words.txt"

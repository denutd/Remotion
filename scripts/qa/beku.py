# Cek frame beku atau frame dobel: tblend difference + signalstats YAVG per frame.
# Pakai: python scripts/qa/beku.py out/kertas-a4.mp4
import os
import re
import shutil
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')
if len(sys.argv) < 2:
    raise SystemExit('Pakai: python scripts/qa/beku.py <file-video.mp4>')

choco = r'C:\ProgramData\chocolatey\bin\ffmpeg.exe'
ff = os.environ.get('FFMPEG') or (choco if os.path.exists(choco) else shutil.which('ffmpeg') or 'ffmpeg')

out = subprocess.run(
    [ff, '-v', 'error', '-i', sys.argv[1], '-vf', 'tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-an', '-f', 'null', '-'],
    capture_output=True,
    text=True,
    check=True,
).stdout

vals = [float(m) for m in re.findall(r'YAVG=([0-9.]+)', out)]
fps = 30
print('frame', len(vals), 'durasi', round(len(vals) / fps, 1), 's')
runs, start = [], None
for i, v in enumerate(vals + [99]):
    if v < 0.25 and start is None:
        start = i
    elif v >= 0.25 and start is not None:
        if i - start >= 15:
            runs.append((start, i))
        start = None
print('rentang diam >= 0,5 dtk:', [(round(a / fps, 2), round(b / fps, 2)) for a, b in runs] or 'tidak ada')
dob = [i for i in range(1, len(vals) - 1) if vals[i] < 0.05 and vals[i - 1] > 0.6 and vals[i + 1] > 0.6]
print('frame dobel terisolasi:', len(dob), [round(i / fps, 2) for i in dob[:20]])
half = [sum(vals[k:k + 15]) / max(1, len(vals[k:k + 15])) for k in range(0, len(vals), 15)]
low = [(round(k * 0.5, 1), round(v, 2)) for k, v in enumerate(half) if v < 0.6]
print('blok 0,5 dtk dengan gerak rata-rata < 0,6:', low or 'tidak ada')

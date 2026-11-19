# QA pelafalan opsional: transkrip audio narasi dengan faster-whisper lokal.
# Setup sekali:
#   python -m venv out/probe/stt-venv
#   out/probe/stt-venv/Scripts/pip install faster-whisper
# Pemakaian:
#   out/probe/stt-venv/Scripts/python.exe scripts/qa/transkrip.py public/voice/<slug>/voice.mp3
import os
import shutil
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

if len(sys.argv) < 2:
    raise SystemExit('Pakai: python scripts/qa/transkrip.py <voice.mp3>')

choco = r'C:\ProgramData\chocolatey\bin\ffmpeg.exe'
ff = os.environ.get('FFMPEG') or (choco if os.path.exists(choco) else shutil.which('ffmpeg') or 'ffmpeg')
pcm = subprocess.run([ff, '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0

model = WhisperModel('mobiuslabsgmbh/faster-whisper-large-v3-turbo', device='cpu', compute_type='int8')
segments, info = model.transcribe(audio, language='id', word_timestamps=True, beam_size=5, condition_on_previous_text=False)
print(f'durasi={info.duration:.1f}s')
for s in segments:
    print(f'\n{s.start:6.2f}-{s.end:6.2f}  {s.text.strip()}')
    print('        ' + ' '.join(f'{w.word.strip()}[{w.probability:.2f}]' for w in (s.words or [])))

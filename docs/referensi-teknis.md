# Referensi Teknis Proyek (Untuk AI Agent & Developer)

Ringkasan perintah, arsitektur, dan aturan teknis inti di repositori ini.

---

## 1. Struktur Kode Inti
- **`src/brand/theme.ts`**: Pengaturan identitas `channel` (`name`, `handle`, `highlightPrefix`, `copyrightYear`), palet `colors`, resolusi `1080×1920` `30 fps`, dan `layout` Safe Zone (`safeTop: 170`, `safeBottom: 1520`, `safeRight: 960`).
- **`src/brand/fonts.ts`**: Memuat font lokal `Plus Jakarta Sans` dan `IBM Plex Mono` dari `public/fonts/`.
- **`src/lib/narration.ts`**: Parser markup `{tampil|ucap}` dan pembuang audio tag `[...]` untuk forced alignment.
- **`src/lib/timeline.ts` & `src/lib/beats.ts`**: `buildTimeline`, `estimateSpokenTimes`, `mapSpokenTimes` (edit distance), serta `makeBeat()` / `beat()` / `beatEnd()`.
- **`src/components/`**: `Background`, `Captions` (DP pagination `<= 3` kata / `<= 18` huruf, anti kata sambung yatim), `Watermark`, `Logo`, `SafeZones`, `SceneShell`.
- **`src/kit/`**:
  - `Editorial.tsx`: `SolidTag`, `Sorot`, `Label`, `Kepala`, `Baris`, `KetFoto`, `Coret`, `Panah`, `DriftGrid`, `LatarDiagram`, `SubpixelImg`, `Foto`, `Rekaman`, `Shot`, `clipAt`, `pingpong`, `offsetAman`, `ramp`, `riseIn`, `breathe`.
  - `EndCard.tsx`: Penutup retensi di atas visual terakhir + wajib `sources` dan `credit`.
  - `Sfx.tsx`: Pemutar efek suara lokal (`public/sfx/*.wav`).
- **`src/three/`**: `Stage` (`alpha: false`), `PostFX` (composer sinkron + `SanitizeEffect` anti-NaN GPU Intel + `AgX`/`ACES`), `CameraRig`, `camPath` (interpolasi bola + `projector()`), `Sun3D`, `Planet3D` (prosedural), `Earth3D` (opsional tekstur NASA), `StarField`, `Streaks3D`, `Trail`, `Dust`, `FootagePlane` (frame blending).
- **`src/videos/`**:
  - `kertas-a4/` — Contoh referensi #1 (Editorial 2D + SVG + SFX + `Cover`).
  - `cahaya-matahari/` — Contoh referensi #2 (3D WebGL + multi-segmen `SceneShell` + `camPath` + `projector()` + `Cover`).

---

## 2. Perintah CLI Lengkap

### Setup & Pratinjau
- `npm run setup` — Membuat 11 SFX `.wav` bebas hak cipta (`sfx-kit`) lalu cek seluruh prasyarat (`cek-setup`).
- `npm run dev` — Membuka Remotion Studio.
- `npm run lint` — `tsc --noEmit` (`noUnusedLocals: true`).
- `npm run demo-footage` — Membuat klip MP4 demo 1080×1920 30fps ke `public/footage/demo/latar-demo.mp4` untuk latihan `<Rekaman>`.

### Suara & Timeline
- `npm run estimate <slug>` — Bangun `timeline.generated.json` estimasi tanpa API key (juga `npm run voice -- <slug> --estimate`).
- `npm run voices -- --json` — Cek kuota & simpan kandidat suara Indonesia ke `out/voices.json`.
- `npm run voice -- <slug> --sample Nama` — Uji 3 segmen pertama ke `out/sampel-suara/`.
- `npm run voice -- <slug>` — Generate narasi MP3 penuh (`public/voice/<slug>/voice.mp3`), `words.json`, & `timeline.generated.json`.
- `npm run timeline -- <slug> --tulis` — Perbarui teks tampilan `{tampil|ucap}` tanpa panggil API ulang.
- `npm run ucapan -- <slug> "kalimat {X}" "v1" "v2"` — Uji pelafalan kata/singkatan.
- `npm run voice:ganti -- <slug> <segId>` — Regenerasi 1 segmen lalu sambung di titik sunyi (`< -45 dBFS`).
- `npm run voice:kata -- <slug> <kata> <donor.mp3> --donor=a,b --target=c,d` — Tambal 1 kata dengan normalisasi RMS & crossfade 15 ms.

### QA, Render & Cleanup
- `npm run stills -- <Id> <detik...> [--debug] [--scale=0.5]` — Render frame PNG (`--gl=angle` aktif otomatis). Di PowerShell, jika `--flag` termakan npm, jalankan langsung `npx tsx scripts/stills.mts ...`.
- `npm run final -- <slug> [--frames=a-b] [--concurrency=1]` — Render H.264 `CRF 15` PNG-intermediate, lalu normalisasi audio dua-pass ke `-14 LUFS` (`AAC 320 kbps`) + tanam metadata sumber/hak cipta ke `out/<slug>.mp4`. Di PowerShell gunakan `npx tsx scripts/render.mts ...` jika mengirim flag `--frames` / `--concurrency`.
- `npx remotion still <CoverId> out/<slug>-cover.jpg --image-format=jpeg --jpeg-quality=92` — Render thumbnail cover (otomatis memakai `angle` dari `remotion.config.ts`).
- `bash scripts/qa/audit.sh <slug>` — Cek stream, `blackdetect`, lembar kontak 1 fps, kata/detik.
- `python scripts/qa/beku.py out/<slug>.mp4` — Cek rentang diam `>= 0,5 dtk` & frame dobel (`tblend`).
- `out/probe/stt-venv/Scripts/python.exe scripts/qa/transkrip.py public/voice/<slug>/voice.mp3` — Audit pelafalan lokal via `faster-whisper`.
- `npm run bersih-temp` — Hapus sisa bundle Remotion di `%TEMP%`.

---

## 3. Aturan Teknis Video & Footage
1. **Kecepatan putar footage:** `kecepatan × fps_klip / 30` harus bilangan bulat (`30 fps -> 1×`, `60 fps -> 0,5×/1×`, `24 fps -> 1,25×`, `25 fps -> 1,2×`), atau interpolasi dulu:
   - `ffmpeg -i src.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920,minterpolate=fps=60:mi_mode=mci" -an out-60.mp4`
   - Untuk klip VFR / frame duplikat: `mpdecimate,framerate=fps=75` (diputar `0,4×`).
   - Atau pasang `fps={fpsKlip}` pada `FootagePlane` untuk *frame blending*.
2. **Gerakan foto:** selalu gunakan `Foto` / `SubpixelImg` (`transform: translate3d(...) scale(...)`), jangan animasikan CSS `left/top`.
3. **Upload via HP (ADB `scripts/hp.mjs`):**
   - `node scripts/hp.mjs push <lokal> sdcard/Movies/<nama>`
   - `node scripts/hp.mjs ui [regex]`, `tapt "<teks>"`, `tap x y`, `typef <caption-ascii.txt>`, `shot <nama>` (disimpan ke `%TEMP%/ooohgt-hp`).
   - `type`/`typef` hanya menerima ASCII murni (ganti emoji/em-dash/panah Unicode menjadi ASCII sebelum dikirim ke HP).

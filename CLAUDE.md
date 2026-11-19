# Panduan Autopilot untuk AI Agent (`CLAUDE.md`)

Repositori ini dirancang agar **user non-teknis cukup memberi prompt sederhana**, sementara **AI Agent mengerjakan seluruh proses teknis** secara otomatis dari awal sampai video siap unggah.

Selalu berkomunikasi dengan user dalam bahasa Indonesia yang santai, jelas, dan jujur. Jangan membebani user dengan perintah terminal manual jika kamu bisa menjalankannya langsung.

---

## 1. Mode Setup Otomatis (Saat User Minta Setup Proyek)
Jika user meminta setup laptop / proyek:
1. Cek lingkungan: `node -v`, `ffmpeg -version`, `python --version`, `adb version`.
2. Jika `ffmpeg` belum terpasang atau tidak punya filter `loudnorm`, bantu pasangkan otomatis sesuai OS (mis. Windows: `winget install Gyan.FFmpeg` atau `choco install ffmpeg`; macOS: `brew install ffmpeg`; Linux: `sudo apt install ffmpeg`).
3. Jalankan `npm install` lalu `npm run setup` (yang membuat efek suara lokal `public/sfx/*.wav` dan memverifikasi kesiapan).
4. Jelaskan dengan sederhana bahwa proyek siap dicoba (`npm run dev` untuk pratinjau), dan mode simulasi `--estimate` bisa dipakai gratis tanpa API key.
5. Jika user ingin membuat suara AI ElevenLabs, pandu mereka menyalin `.env.example` menjadi `.env` lalu mengisi `ELEVENLABS_API_KEY` secara lokal (**JANGAN pernah membaca, mencetak, atau meng-commit isi `.env`**).

---

## 2. Mode Produksi Video End-to-End (Saat User Minta Bikin Video)

### Langkah A — Riset Topik & Sumber Primer
- Jika user belum punya topik spesifik, cek tren/berita terbaru atau usulkan 3 ide topik yang dekat dengan kehidupan sehari-hari, ada efek *"oh gitu ternyata"*, dan datanya jelas.
- Verifikasi klaim ke **sumber primer** (data resmi lembaga/pemerintah, standar baku seperti ISO/BIPM, atau jurnal ilmiah *peer-reviewed*). Jangan melebihkan klaim.
- Catat sumber di komentar tiap segmen dan di `export const sources` pada `src/videos/<slug>/script.ts`.

### Langkah B — Draf Naskah HTPC Sesuai Funnel Konten + Gerbang Persetujuan
Sesuaikan pendekatan naskah dengan tujuan funnel yang diinginkan user:
1. **Awareness (TOFU):** Fokus murni pada rasa penasaran, fenomena mengejutkan (*"Oh gitu ternyata!"*), hook kuat frame 0, dan sains/fakta di balik masalah sehari-hari.
2. **Consideration (MOFU):** Komparasi objektif (*Pilihan A vs Pilihan B*, *Mitos vs Fakta*, bedah komposisi/fitur), membekali penonton dengan kriteria memilih yang tepat.
3. **Conversion (BOFU):** Problem-solution konkret, menunjukkan efektivitas solusi melalui fakta/B-roll penggunaan nyata, diakhiri kesimpulan logis mengapa solusi ini paling tepat (tanpa elemen visual jualan yang mengganggu/norak).

Buat folder `src/videos/<slug>/` (lihat contoh `src/videos/kertas-a4/` untuk 2D atau `src/videos/cahaya-matahari/` untuk 3D):
- **Hook (0–3 dtk):** klaim utuh langsung tampil di layar pada frame 0 dan mulai terucap <= 0,3 dtk.
- **Tension:** ketukan singkat yang menunjukkan masalah/taruhan.
- **Payoff:** penjelasan mekanisme berbasis fakta + visual jelas.
- **Outro:** kesimpulan singkat atau takeaway penting yang relevan dengan topik (tanpa keharusan teks/ucapan "Oh gitu ternyata") dengan `export const tail = 0.5`.
- Gunakan markup `{tampil|ucap}` (mis. `{210|dua ratus sepuluh}`, `{ISO|ai es o}`) dan audio tag ElevenLabs v4 seperlunya (`[casual]`, `[inhales]`).
- **WAJIB:** minta persetujuan user pada draf naskah **sebelum** menjalankan `npm run voice -- <slug>` (agar kredit ElevenLabs tidak terbuang). Sementara menunggu atau jika belum ada `.env`, jalankan `npm run estimate <slug>` agar bisa langsung menyusun adegan.

### Langkah C — Cari Aset Visual & Footage Bebas Komersial
- Jika memakai foto/video nyata: cari dari **Pexels** atau **Wikimedia Commons (CC0 / Public Domain / CC BY)**.
- Perhatikan lisensi: jika **CC BY**, wajib cantumkan kredit di `credits` dan `EndCard`. Hindari menampilkan wajah yang bisa dikenali dalam konteks negatif/sensitif.
- Untuk video footage, pastikan fps dan kecepatan putar menghasilkan langkah frame bulat (`kecepatan * fps_klip / 30 = bilangan bulat`), atau gunakan `ffmpeg` (`minterpolate` / `mpdecimate`) serta `FootagePlane` / `<Rekaman>`.
- Jika tanpa footage eksternal, buat ilustrasi editorial SVG bergerak (`src/kit/Editorial.tsx`) atau scene 3D prosedural (`src/three/`).

### Langkah D — Buat Suara & Bangun Adegan Remotion
- Setelah naskah disetujui & `.env` tersedia, jalankan `npm run voice -- <slug>` (atau cek kandidat suara dulu lewat `npm run voices -- --json` dan `--sample`). Jika ada salah ucap 1 segmen/kata, perbaiki hemat kredit lewat `npm run ucapan`, `npm run voice:ganti`, atau `npm run voice:kata` (detail di `docs/referensi-teknis.md`).
- Sinkronkan semua animasi dan `<Sfx>` memakai `beat('kata')` / `beatEnd('kata')` dan `segStart('id')`.
- **Aturan visual:**
  - **Visual Afiliasi & Edukasi Dinamis:** Bebas menampilkan ekspresi manusia, wajah, model produk, footage B-roll lifestyle (Pexels, Unsplash, CC0, atau aset footage pengguna), serta ilustrasi/grafik pendukung untuk meningkatkan *hook* dan *trust* penonton pada konten affiliate.
  - Gunakan desain editorial rapi (`SolidTag`, grafik batang mulai dari `0`, satuan & tahun selalu tertulis, label harga/diskon/rekomendasi bila relevan).
  - **Jangan biarkan layar diam >= 0,5 detik:** gunakan `LatarDiagram`, `DriftGrid`, `breathe`, atau dorongan kamera `SubpixelImg`.
  - Patuhi **Safe Zone** (`y` antara `200..1500`, `x <= 950`).
  - `EndCard` wajib tampil di atas visual terakhir yang tetap bergerak (bukan layar hitam) dan menampilkan `sources` + `credit`.
- Daftarkan komposisi & cover (`Still`) di `src/Root.tsx` serta di `VIDEOS` pada `scripts/render.mts`.

### Langkah E — QA Mandiri & Render Final
1. `npm run lint` (`tsc --noEmit`) — harus nol error.
2. `npm run stills -- <CompositionId> 0 5 15 --debug` — **baca file PNG hasilnya** untuk memeriksa langsung Safe Zone, kontras teks, dan kesesuaian visual.
3. `npm run final -- <slug> --concurrency=1` — menghasilkan `out/<slug>.mp4` (`CRF 15`, audio ternormalisasi `-14 LUFS`, metadata lengkap). Untuk cover: `npx remotion still <CoverId> out/<slug>-cover.jpg --image-format=jpeg --jpeg-quality=92`.
4. Jalankan audit: `python scripts/qa/beku.py out/<slug>.mp4` (cek frame beku/dobel) dan `bash scripts/qa/audit.sh <slug>` (cek `blackdetect` & lembar kontak 1 fps).

### Langkah F — Caption 4 Sosmed & Upload via HP (ADB)
- Siapkan draf judul & caption siap tempel untuk **TikTok, Instagram Reels, Facebook Reels, dan YouTube Shorts** (sertakan sumber singkat + catatan label AI jika platform mewajibkannya).
- Jika user menyambungkan HP Android via USB (`adb devices`), bantu kirim MP4/cover (`node scripts/hp.mjs push ...`) dan siapkan versi caption ASCII (`typef` ADB hanya mendukung ASCII — tanpa emoji/em-dash/panah Unicode).
- Detail teknis perintah lengkap ada di `docs/referensi-teknis.md`.

---

## Aturan Keamanan Ketat
- `.env` berisi `ELEVENLABS_API_KEY`: **jangan pernah membaca isinya ke output chat, mencetaknya, atau meng-commit ke Git**.
- Screenshot HP lewat `scripts/hp.mjs` otomatis disimpan di folder Temp OS (`%TEMP%/ooohgt-hp`) agar data pribadi tidak pernah masuk ke folder proyek.

# Bikin Video Edukasi & Konten Afiliasi 9:16 Cukup Pakai Prompt AI

Template siap pakai berbasis **Remotion** untuk membuat video vertikal 9:16 (**TikTok / Instagram Reels / YouTube Shorts / Facebook Reels**) — **cukup ngobrol dengan AI coding agent kamu** (Antigravity, Claude Code, Cursor, Codex, dll.).

Proyek ini dirancang fleksibel untuk berbagai tahap funnel: **Awareness (TOFU)**, **Consideration (MOFU)**, hingga **Conversion/Affiliate (BOFU)** dengan visual editorial modern yang bersih, profesional, dan bebas dari elemen *hard-selling* yang mengganggu.

---

## 🚀 Yang Bisa Dikerjakan AI di Proyek Ini

1. **Riset Topik & Fakta Valid** — Mengambil data primer (jurnal ilmiah, standar ISO, data medis/resmi).
2. **Dukungan Visual Lengkap & Fleksibel**:
   - Footage B-roll lifestyle, model produk, ekspresi emosi, dan wajah manusia (Pexels, Unsplash, lisensi komersial/CC0, atau aset pribadi).
   - Ilustrasi editorial 2D, diagram anatomi/medis dinamis, grafik SVG bergerak.
   - Scene 3D WebGL sinematik (Three.js / React Three Fiber).
3. **Penyusunan Naskah HTPC**:
   - **Awareness:** Hook kuat frame 0, rasa penasaran, penjelasan sains/fakta di balik masalah sehari-hari.
   - **Consideration:** Komparasi objektif (*Pilihan A vs B*, *Mitos vs Fakta*, bedah komposisi).
   - **Conversion / Affiliate:** Problem-solution konkret dengan visualisasi solusi yang meyakinkan tanpa *gimmick* norak.
4. **Narasi Suara AI & Sinkronisasi Presisi**:
   - Integrasi ElevenLabs dengan sinkronisasi kata per kata (`beat` / `beatEnd`).
   - Efek suara prosedural lokal (`public/sfx/`).
   - Teks *auto-caption* dinamis dan *safe zone* sosmed otomatis.
5. **Quality Assurance (QA) Mandiri**:
   - Pengecekan otomatis frame hitam, frame diam/beku (`beku.py`), dan normalisasi audio standar siaran (`-14 LUFS`).
6. **Distribusi & Upload**:
   - Penyiapan judul & caption siap posting untuk 4 platform sosmed.
   - Dukungan transfer & otomasi via kabel USB Android (ADB).

---

## 🛠️ Cara Pakai (Tinggal Copy-Paste Prompt!)

### Langkah 1 — Buka Proyek di AI Editor
1. Clone repositori ini ke komputer kamu:
   ```bash
   git clone https://github.com/denutd/Remotion.git
   ```
2. Buka foldernya menggunakan AI agent pilihanmu (**Antigravity**, **Claude Code**, **Cursor**, **Windsurf**, dll.).

### Langkah 2 — Setup Proyek Otomatis
Ketik atau copy prompt ini ke chat AI:

```text
Tolong setup proyek ini di laptop saya sampai siap pakai.
Cek dan pasang kebutuhan yang kurang (Node.js, ffmpeg, npm install, npm run setup).
Jelaskan juga cara pasang API key ElevenLabs ke file .env dengan aman.
```

> **Belum punya API key ElevenLabs?** Proyek ini tetap bisa berjalan dan merender video penuh dalam **mode estimasi gratis** (`npm run estimate <slug>`). Kamu baru perlu mengisi API key saat siap memproduksi suara final.

---

### Langkah 3 — Minta AI Bikin Video Baru Sesuai Funnel

#### A. Contoh Video Awareness (Edukasi / Masalah Sehari-hari)
```text
Buatkan 1 video edukasi awareness tentang "Kenapa Kulit Eksim Sering Kambuh Padahal Sudah Diobati".
Gunakan diagram 2D model lapisan kulit (Brick & Mortar) dan visual editorial yang bersih.
Tolong buatkan draf naskahnya dulu untuk saya setujui sebelum generate suara ElevenLabs.
```

#### B. Contoh Video Consideration (Komparasi / Solusi)
```text
Buatkan video tipe consideration tentang "Ceramide vs Hyaluronic Acid untuk Memperbaiki Skin Barrier".
Bandingkan secara objektif fungsi keduanya dengan visual B-roll dan grafik perbandingan yang jelas.
```

#### C. Contoh Video Conversion / Affiliate (Problem - Solution)
```text
Buatkan video edukasi konversi untuk produk pelembap skin barrier.
Fokus pada problem-solution: jelaskan mengapa bahan aktif tertentu efektif mengatasi masalah kulit kering/gatal,
tampilkan footage B-roll manusia dan produk yang estetik, tanpa elemen tombol keranjang yang norak.
```

---

## 💡 Kumpulan Prompt Praktis

| Kebutuhan | Prompt ke AI |
|---|---|
| **Kustomisasi Branding** | *"Pasang branding channel di `src/brand/theme.ts` dengan nama `@namaku`"* atau *"Hilangkan semua watermark channel agar video bersih polos."* |
| **Pratinjau Studio (Web UI)** | *"Jalankan Remotion Studio (`npm run dev`) supaya saya bisa lihat pratinjau video di browser."* |
| **Gunakan Visual Foto / B-roll** | *"Untuk video ini, gunakan foto/footage orang dan ekspresi dari sumber komersial bebas hak cipta."* |
| **Pakai Animasi 3D Sinematik** | *"Untuk video ini, pakai animasi 3D WebGL seperti contoh `cahaya-matahari`."* |
| **Perbaiki 1 Kata Suara yang Salah** | *"Kata `[X]` kurang pas pengucapannya. Tolong perbaiki kata itu saja dengan `npm run voice:kata` tanpa memotong kredit untuk seluruh naskah."* |
| **Render Video Final** | *"Naskah dan visual sudah oke, tolong render video final MP4 dan buatkan cover/thumbnail-nya."* |

---

## 📂 Struktur Proyek & Contoh Video

- `src/videos/` — Folder video yang sudah siap pakai:
  - `apa-itu-eksim/` — Contoh **Awareness** dengan foto/B-roll lifestyle manusia & motion graphics editorial.
  - `kulit-eksim/` — Contoh **Edukasi Medis** dengan diagram anatomi interaktif 2D (*Skin Barrier Diagram*).
  - `kertas-a4/` — Contoh **Motion Graphics 2D & SVG** berbasis data presisi ISO 216.
  - `cahaya-matahari/` — Contoh **3D Sinematik** (Three.js WebGL: simulasi tata surya, orbit, dan partikel debu).
- `src/brand/theme.ts` — Konfigurasi warna, tipografi, safe zone, dan branding/watermark (opsional).
- `src/kit/` — Komponen siap pakai: `Editorial.tsx` (kartu teks, grafik, perbandingan), `EndCard.tsx`, `<Sfx />`.
- `scripts/` — Skrip automasi: ElevenLabs TTS, perbaikan suara hemat kredit, SFX generator, normalisasi volume siaran (`-14 LUFS`), dan QA audit.

---

## 🎨 Kebijakan Aset & Visual

- **Dukungan Wajah & B-Roll Manusia**: Proyek ini mendukung penuh penggunaan foto/video manusia, ekspresi emosional, footage lifestyle, model produk, maupun diagram ilmiah untuk meningkatkan retensi dan konversi penonton.
- **Lisensi Komersial**: Pastikan semua footage eksternal berasal dari sumber berlisensi komersial bebas royalti (seperti Unsplash, Pexels, lisensi CC0/Public Domain) atau aset milik Anda sendiri.
- **Tanpa Watermark Paksaan**: Secara default, video dihasilkan bersih tanpa watermark atau tagline penutup yang kaku, sehingga siap di-branding sesuai kebutuhan akun Anda.

---

## 🔒 Catatan Keamanan

- **API Key Terlindungi**: File `.env` yang berisi `ELEVENLABS_API_KEY` otomatis diabaikan oleh `.gitignore`. Jangan pernah meng-commit atau membagikan file `.env` ke publik.
- **Data Lokal**: Semua audio dan aset video diproses langsung di komputer lokal Anda.

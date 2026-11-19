# Bikin Video Edukasi 9:16 Cukup Pakai Prompt AI

Template siap pakai untuk membuat video edukasi pendek **TikTok / Instagram Reels / YouTube Shorts / Facebook Reels** — **cukup ngobrol dengan AI coding agent kamu** (Antigravity, Claude Code, Cursor, Codex, dll.).

Kamu **tidak perlu** jago coding atau setting terminal manual satu per satu. Semua skrip, template animasi 2D/3D, efek suara, dan panduan teknis sudah dibaca otomatis oleh AI dari repositori ini.

---

## Yang Bisa Dikerjakan AI di Proyek Ini
1. **Riset tren & sumber resmi** (jurnal, aturan pemerintah, data ilmiah terpercaya)
2. **Cari footage gambar & video** yang aman untuk penggunaan komersial (Pexels / Wikimedia Commons) atau bikin ilustrasi/animasi sendiri
3. **Menyusun naskah** yang padat, jelas, dan sinkron per kata
4. **Mengedit video + bikin motion graphics 2D & 3D** otomatis (Remotion + Three.js)
5. **Membuat narasi suara AI** (ElevenLabs) lengkap dengan efek suara & *auto-caption* per kata
6. **Cek kualitas otomatis** (cek frame hitam, frame diam, dan audio standar `-14 LUFS`)
7. **Menyiapkan caption 4 sosmed** (TikTok, IG, FB, YouTube) — sampai bantu kirim & jadwalkan lewat HP Android yang dicolok ke laptop

---

## Cara Pakai (Tinggal Copy-Paste Prompt!)

### Langkah 1 — Buka Proyek di AI Editor
1. Download / `git clone` repositori ini ke laptopmu.
2. Buka foldernya menggunakan AI agent pilihanmu (**Antigravity**, **Claude Code**, **Cursor**, **Windsurf**, dll.).

### Langkah 2 — Minta AI Setup Laptopmu Otomatis
Copy-paste prompt ini ke chat AI:

```text
Tolong setup proyek ini di laptop saya sampai siap pakai.
Cek dan pasang kebutuhan yang kurang (Node.js, ffmpeg, npm install, npm run setup).
Kalau nanti saya mau pakai suara ElevenLabs, jelaskan cara pasang API key ke file .env dengan aman.
```

> **Belum punya API key ElevenLabs?** Tenang! Proyek ini tetap bisa jalan dan merender video penuh dalam **mode simulasi gratis** (`--estimate`), baru isi API key kalau sudah mau pakai suara AI sungguhan.

### Langkah 3 — Minta AI Bikin Video Pertama Kamu
Copy-paste prompt ini ke chat AI:

```text
Buatkan 1 video edukasi pendek tentang [TULIS TOPIK KAMU, atau ketik: "carikan 3 topik menarik yang lagi ramai di Indonesia"].

Tolong ikuti alur proyek ini:
1. Riset data & sumber primer yang valid.
2. Susun draf naskah dulu dan minta persetujuan saya sebelum membuat suara ElevenLabs.
3. Setelah saya setujui, buat visual/animasi 2D atau 3D-nya, cari footage bebas komersial kalau perlu, lalu cek hasil tampilannya (QA) sebelum render MP4 final.
4. Sekalian buatkan judul & caption untuk TikTok, Instagram Reels, Facebook, dan YouTube Shorts.
```

---

## Kumpulan Prompt Praktis Lainnya

Tinggal copy-paste sesuai kebutuhan:

| Mau Ngapain? | Prompt ke AI |
|---|---|
| **Ganti nama channel / watermark** | *"Ganti branding channel di `src/brand/theme.ts` menjadi nama `@namachannelku`."* |
| **Lihat contoh video yang sudah ada** | *"Jalankan pratinjau Remotion Studio (`npm run dev`) supaya saya bisa lihat contoh video `KertasA4` (2D) dan `CahayaMatahari` (3D)."* |
| **Pakai gaya 3D sinematik** | *"Untuk video ini, pakai gaya 3D WebGL seperti contoh `cahaya-matahari`."* |
| **Perbaiki 1 kata yang salah ucap** | *"Kata `[X]` di segmen `[Y]` kurang pas pengucapannya. Tolong tes beberapa variasi ejaan dulu (`npm run ucapan`), lalu perbaiki segmen/kata itu saja tanpa mengulang seluruh audio."* |
| **Bantu upload lewat HP (Android)** | *"Saya sudah colok HP Android lewat kabel USB dengan USB Debugging aktif. Tolong kirim file video final ke HP dan bantu arahkan/otomatiskan upload & jadwal ke TikTok, IG, FB, dan YouTube."* |

---

## Isi Singkat Folder (Untuk AI & Yang Ingin Ngoprek)

- `CLAUDE.md` & `AGENTS.md` — Instruksi autopilot untuk AI agent kamu
- `docs/referensi-teknis.md` — Rangkuman perintah & aturan teknis untuk AI
- `src/videos/kertas-a4/` — Contoh jadi #1: animasi **Editorial 2D + SVG**
- `src/videos/cahaya-matahari/` — Contoh jadi #2: animasi **3D WebGL Three.js**
- `src/brand/theme.ts` — Pengaturan nama channel, warna, dan *safe zone*
- `scripts/` — Otomasi suara ElevenLabs, `sfx-kit`, render `-14 LUFS`, QA, dan kontrol HP ADB

---

## Prinsip Visual & Adab (Larangan Meng-generate Makhluk Bernyawa)

Dalam proyek ini, seluruh visual ilustrasi/animasi (SVG, 3D, maupun gambar AI) **dibatasi hanya pada benda mati, diagram, peta, grafik data, teks, tumbuhan, dan fenomena alam** — **jangan meng-generate gambar atau ilustrasi makhluk bernyawa** (manusia, karakter kartun, wajah, maupun hewan). Jika topik membutuhkan gambaran situasi nyata, gunakan rekaman/foto nyata yang sah atau ilustrasi objek tak bernyawa (alat, denah, grafik, molekul, bangunan, tumbuhan).

Dasar larangannya dari hadits shahih:

1. **Shahih al-Bukhari No. 5950 & Shahih Muslim No. 2109** (dari Abdullah bin Mas'ud *radhiyallahu 'anhu*), Rasulullah ﷺ bersabda:
   > إِنَّ أَشَدَّ النَّاسِ عَذَابًا عِنْدَ اللَّهِ يَوْمَ الْقِيَامَةِ الْمُصَوِّرُونَ
   > *"Sesungguhnya manusia yang paling berat siksanya di sisi Allah pada hari Kiamat adalah orang-orang yang membuat gambar (makhluk bernyawa)."*

2. **Shahih al-Bukhari No. 2225** (dari jalur Ibnu Abbas *radhiyallahu 'anhuma*), Rasulullah ﷺ bersabda:
   > مَنْ صَوَّرَ صُورَةً فَإِنَّ اللَّهَ مُعَذِّبُهُ، حَتَّى يَنْفُخَ فِيهَا الرُّوحَ، وَلَيْسَ بِنَافِخٍ فِيهَا أَبَدًا
   > *"Barang siapa membuat suatu gambar (makhluk bernyawa), sesungguhnya Allah akan menyiksanya hingga ia meniupkan ruh ke dalamnya, padahal ia tidak akan pernah bisa meniupkannya selamanya."*

   Lalu Ibnu Abbas *radhiyallahu 'anhuma* memberikan jalan keluar:
   > وَيْحَكَ إِنْ أَبَيْتَ إِلَّا أَنْ تَصْنَعَ، فَعَلَيْكَ بِهَذَا الشَّجَرِ، كُلِّ شَيْءٍ لَيْسَ فِيهِ رُوحٌ
   > *"Jika engkau tetap harus membuat gambar, maka buatlah gambar pohon ini — segala sesuatu yang tidak memiliki ruh."*

---

## Catatan Keamanan
- **Jangan pernah** menulis atau menempel API key ElevenLabs langsung di chat publik/GitHub. Simpan hanya di file `.env` lokal (file `.env` otomatis diabaikan oleh `.gitignore`).

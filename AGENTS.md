# AGENTS.md

Ikuti seluruh alur kerja dan aturan autopilot di [CLAUDE.md](CLAUDE.md), serta detail teknis di [docs/referensi-teknis.md](docs/referensi-teknis.md).

Ringkasan prinsip untuk semua AI Agent:
1. User cukup memberi prompt sederhana — kerjakan setup (`npm install`, `npm run setup`, pasang `ffmpeg` bila perlu), riset, kode, QA, hingga render secara mandiri.
2. Gunakan `npm run estimate <slug>` saat mengembangkan animasi; minta persetujuan naskah dari user sebelum menjalankan `npm run voice -- <slug>` (ElevenLabs).
3. Verifikasi setiap hasil visual lewat `npm run lint`, `npm run stills -- <Id> ... --debug` (inspeksi PNG), `beku.py`, dan `audit.sh`.
4. **Dukungan Konten Afiliasi & Komersial**: Diperbolehkan dan didukung penuh menampilkan wajah, manusia, ekspresi emosi, footage B-roll lifestyle, model produk, dan elemen visual dinamis lainnya yang relevan untuk konversi penjualan dan affiliate marketing. Pastikan aset bebas hak cipta komersial (Pexels, Unsplash, lisensi CC0/komersial, atau aset pengguna sendiri).
5. Jangan pernah membaca isi `.env` ke chat, mencetaknya, atau memasukkannya ke Git.

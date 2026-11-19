// Cek kesiapan komputer untuk belajar & merender video: `npm run cek-setup`.
// ✓ = siap, ⚠ = opsional/info, ✗ = wajib dibereskan. Isi API key tidak pernah dicetak.

import {execFileSync} from 'node:child_process';
import {existsSync, readdirSync, readFileSync, statfsSync} from 'node:fs';
import path from 'node:path';
import {FF} from './lib/ffmpeg.mts';

let gagal = 0;
const ok = (m: string) => console.log(`✓ ${m}`);
const warn = (m: string, saran?: string) => console.log(`⚠ ${m}${saran ? `\n    -> ${saran}` : ''}`);
const bad = (m: string, saran: string) => {
	gagal++;
	console.log(`✗ ${m}\n    -> ${saran}`);
};
const run = (cmd: string, args: string[]) => {
	try {
		return execFileSync(cmd, args, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']});
	} catch {
		return null;
	}
};

// 1. Node.js
const major = Number(process.versions.node.split('.')[0]);
if (major >= 20) ok(`Node.js ${process.versions.node}`);
else bad(`Node.js ${process.versions.node} terlalu lama (minimal v20, disarankan v22 LTS)`, 'pasang Node.js 22 LTS dari nodejs.org, lalu buka terminal baru');

// 2. Paket npm
if (existsSync('node_modules/remotion/package.json') && existsSync('node_modules/@remotion/renderer/package.json')) {
	const v = JSON.parse(readFileSync('node_modules/remotion/package.json', 'utf8')).version as string;
	ok(`paket npm terpasang (remotion ${v})`);
} else bad('paket npm belum terpasang', 'jalankan `npm install` di folder proyek');

// 3. ffmpeg lengkap
const ver = run(FF, ['-hide_banner', '-version']);
if (!ver) {
	bad(
		`ffmpeg tidak ditemukan (dicari: ${FF})`,
		'Windows: `winget install Gyan.FFmpeg` atau `choco install ffmpeg` | macOS: `brew install ffmpeg` | Linux: `sudo apt install ffmpeg`',
	);
} else {
	const filters = run(FF, ['-hide_banner', '-filters']) ?? '';
	const missing = ['loudnorm', 'ebur128', 'minterpolate', 'blackdetect'].filter((f) => !new RegExp(`\\b${f}\\b`).test(filters));
	if (missing.length) bad(`ffmpeg tanpa filter: ${missing.join(', ')}`, 'pasang build ffmpeg lengkap (bukan versi minimal)');
	else ok(`ffmpeg ${ver.split('\n')[0].split(' ')[2]} (${FF})`);
}

// 4. Aset lokal (font & sfx)
const fontsOk = existsSync('public/fonts/PlusJakartaSans-latin.woff2') && existsSync('public/fonts/IBMPlexMono-700-latin.woff2');
if (fontsOk) ok('font lokal siap di public/fonts/');
else bad('font lokal belum lengkap di public/fonts/', 'pastikan file font dari repo tutorial ada di public/fonts/');

const sfxCount = existsSync('public/sfx') ? readdirSync('public/sfx').filter((f) => f.endsWith('.wav')).length : 0;
if (sfxCount >= 11) ok(`kit SFX siap (${sfxCount} file .wav di public/sfx/)`);
else warn('kit SFX belum dibuat', 'jalankan `npm run sfx-kit` untuk mensintesis 11 efek suara bebas hak cipta');

// 5. API key ElevenLabs (opsional saat latihan pakai `--estimate`, wajib saat buat suara AI)
if (!existsSync('.env')) {
	warn('.env belum ada (aman untuk latihan mode --estimate / Remotion Studio)', 'untuk buat narasi suara AI: salin `.env.example` ke `.env` lalu isi ELEVENLABS_API_KEY');
} else {
	const key = /^ELEVENLABS_API_KEY=(.+)$/m.exec(readFileSync('.env', 'utf8'))?.[1]?.trim() ?? '';
	if (key.length >= 20) ok('.env berisi ELEVENLABS_API_KEY');
	else warn('.env ada, tetapi ELEVENLABS_API_KEY masih kosong', 'isi ELEVENLABS_API_KEY=... jika ingin menjalankan `npm run voice`');
}

// 6. Opsional QA: bash & python
if (run('bash', ['--version'])) ok('bash tersedia (audit: `bash scripts/qa/audit.sh <slug>`)');
else warn('bash tidak ada (opsional untuk audit.sh)', 'Windows: pasang Git for Windows (git-scm.com)');

const py = run('python', ['--version']) || run('python3', ['--version']);
if (py) ok(`${py.trim()} tersedia (untuk cek frame beku: scripts/qa/beku.py)`);
else warn('Python belum ada (opsional untuk QA frame beku & Whisper lokal)');

const venvPy = path.join('out', 'probe', 'stt-venv', 'Scripts', 'python.exe');
if (existsSync(venvPy) && run(venvPy, ['-c', 'import faster_whisper']) !== null) ok('Whisper lokal siap (out/probe/stt-venv)');

// 7. Ruang disk
try {
	const fs = statfsSync('.');
	const freeGb = (fs.bavail * fs.bsize) / 1e9;
	if (freeGb >= 15) ok(`ruang disk bebas ${freeGb.toFixed(0)} GB`);
	else warn(`ruang disk bebas ${freeGb.toFixed(0)} GB`, 'disarankan >= 15 GB untuk cache render sementara');
} catch {
	warn('ruang disk tidak bisa dicek');
}

console.log(
	gagal
		? `\n${gagal} hal wajib belum siap. Bereskan yang bertanda ✗ lalu jalankan lagi \`npm run cek-setup\`.`
		: '\nSiap! Coba jalankan `npm run dev` atau `npm run stills -- KertasA4 0`.',
);
process.exit(gagal ? 1 : 0);

// Kendali HP Android lewat ADB untuk unggah & jadwal sosmed. Perintah bisa dirangkai dengan token ";;".
// Screenshot disimpan di %TEMP%\ooohgt-hp (bukan di proyek agar notifikasi pribadi tidak ikut ke Git).
//   node scripts/hp.mjs shot [nama] [x y w h]   screenshot -> %TEMP%\ooohgt-hp\<nama>.png
//   node scripts/hp.mjs push lokal sdcard/...   salin file ke HP
//   node scripts/hp.mjs ui [regex]              daftar elemen UI + koordinat [cx,cy]
//   node scripts/hp.mjs tap x y | tapt regex [n] | long x y [ms] | swipe x1 y1 x2 y2 [ms]
//   node scripts/hp.mjs key KEYCODE... | type "teks" | typef file.txt | wait ms | app paket | cur

import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const OUT = path.join(os.tmpdir(), 'ooohgt-hp');
mkdirSync(OUT, {recursive: true});
const CHOCO_FF = 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe';
const FF = process.env.FFMPEG || (existsSync(CHOCO_FF) ? CHOCO_FF : 'ffmpeg');

const adb = (args, opts = {}) => execFileSync('adb', args, {maxBuffer: 64 << 20, ...opts});
const sh = (cmd) => adb(['shell', cmd]).toString();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function shot(name = 's', crop) {
	const raw = path.join(OUT, '_raw.png');
	writeFileSync(raw, adb(['exec-out', 'screencap', '-p']));
	if (name.includes('#')) {
		const counter = path.join(OUT, '_nomor.txt');
		let n = 0;
		try {
			n = Number(readFileSync(counter, 'utf8')) || 0;
		} catch {}
		writeFileSync(counter, String(++n));
		name = name.replace('#', String(n).padStart(3, '0'));
		mkdirSync(path.dirname(path.join(OUT, name)), {recursive: true});
	}
	const out = path.join(OUT, `${name}.png`);
	const vf = crop ? `crop=${crop[2]}:${crop[3]}:${crop[0]}:${crop[1]},scale='min(900,iw)':-2` : 'scale=540:-2';
	execFileSync(FF, ['-v', 'error', '-y', '-i', raw, '-vf', vf, out]);
	console.log(`shot ${out}`);
}

function pixel(x, y) {
	const raw = path.join(OUT, '_px.png');
	writeFileSync(raw, adb(['exec-out', 'screencap', '-p']));
	return [...execFileSync(FF, ['-v', 'error', '-i', raw, '-vf', `crop=1:1:${x}:${y}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])];
}

async function expect(x, y, rgb, tol) {
	for (let attempt = 1; ; attempt++) {
		const got = pixel(x, y);
		const ok = got.every((v, i) => Math.abs(v - rgb[i]) <= tol);
		if (ok || attempt === 4) {
			console.log(`expect ${x},${y} ~${rgb.join('/')} dapat ${got.join('/')} ${ok ? 'OK' : 'GAGAL'}${attempt > 1 ? ` (percobaan ${attempt})` : ''}`);
			if (!ok) process.exit(3);
			return;
		}
		await sleep(700);
	}
}

function dump() {
	for (let i = 0; i < 4; i++) {
		try {
			const r = sh('rm -f /data/local/tmp/ui.xml; uiautomator dump /data/local/tmp/ui.xml >/dev/null 2>&1; cat /data/local/tmp/ui.xml 2>/dev/null');
			if (r.includes('<hierarchy')) return r;
		} catch {}
	}
	throw new Error('uiautomator dump gagal');
}

const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#10;/g, '⏎').replace(/&amp;/g, '&');

function nodes() {
	const xml = dump();
	const list = [];
	for (const m of xml.matchAll(/<node ([^>]*?)\/?>/g)) {
		const a = {};
		for (const p of m[1].matchAll(/([\w-]+)="([^"]*)"/g)) a[p[1]] = unesc(p[2]);
		const b = a.bounds?.match(/\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]/);
		if (!b) continue;
		const [x1, y1, x2, y2] = b.slice(1).map(Number);
		if (x2 <= x1 || y2 <= y1) continue;
		list.push({...a, x1, y1, x2, y2, cx: Math.round((x1 + x2) / 2), cy: Math.round((y1 + y2) / 2)});
	}
	return list;
}

function ui(filter) {
	const re = filter ? new RegExp(filter, 'i') : null;
	let i = 0;
	for (const n of nodes()) {
		const label = `${n.text ?? ''} ${n['content-desc'] ?? ''} ${n['resource-id'] ?? ''}`;
		const interesting = n.text || n['content-desc'] || n.clickable === 'true' || /EditText/.test(n.class);
		if (!interesting || (re && !re.test(label))) continue;
		const flags = [n.clickable === 'true' && 'c', n.checked === 'true' && 'ON', n.selected === 'true' && 'sel', n.focused === 'true' && 'foc', n.scrollable === 'true' && 'scr', n.enabled === 'false' && 'off'].filter(Boolean).join(',');
		const id = (n['resource-id'] ?? '').replace(/^.*:id\//, '#');
		const cls = (n.class ?? '').split('.').pop();
		console.log(`${String(i++).padStart(3)} [${n.cx},${n.cy}] ${cls}${n.text ? ` "${n.text.slice(0, 90)}"` : ''}${n['content-desc'] ? ` {${n['content-desc'].slice(0, 90)}}` : ''}${id ? ` ${id}` : ''}${flags ? ` (${flags})` : ''} ${n.x1},${n.y1},${n.x2},${n.y2}`);
	}
}

function tapt(pattern, nth = 0) {
	const re = new RegExp(pattern, 'i');
	const hits = nodes().filter((n) => re.test(n.text ?? '') || re.test(n['content-desc'] ?? ''));
	if (!hits.length) throw new Error(`tidak ada elemen cocok /${pattern}/`);
	const n = hits[Math.min(nth, hits.length - 1)];
	sh(`input tap ${n.cx} ${n.cy}`);
	console.log(`tapt "${n.text || n['content-desc']}" @${n.cx},${n.cy} (${hits.length} cocok)`);
}

function type(text) {
	if (/[^\x20-\x7E\n]/.test(text)) throw new Error(`karakter non-ASCII: ${[...text].filter((c) => /[^\x20-\x7E\n]/.test(c)).join(' ')}`);
	const lines = [];
	text.split('\n').forEach((line, i) => {
		if (i > 0) lines.push('input keyevent 66');
		for (let k = 0; k < line.length; k += 60) {
			const chunk = line.slice(k, k + 60).replace(/'/g, `'\\''`).replace(/ /g, '%s');
			lines.push(`input text '${chunk}'`);
		}
	});
	const f = path.join(OUT, '_type.sh');
	writeFileSync(f, lines.join('\n') + '\n');
	adb(['push', f, '/data/local/tmp/ph_type.sh']);
	sh('sh /data/local/tmp/ph_type.sh');
	console.log(`type ${text.length} karakter`);
}

let argv = process.argv.slice(2);
if (argv[0] === 'run') {
	const tokens = readFileSync(argv[1], 'utf8').trim().split(/\s+/);
	argv = Array.from({length: Number(argv[2] ?? 1)}, () => [...tokens, ';;']).flat();
}
const cmds = [];
for (let cur = []; ; ) {
	const t = argv.shift();
	if (t === undefined || t === ';;') {
		if (cur.length) cmds.push(cur);
		cur = [];
		if (t === undefined) break;
	} else cur.push(t);
}

for (const [c, ...a] of cmds) {
	switch (c) {
		case 'shot': shot(a[0], a.length >= 5 ? a.slice(1, 5).map(Number) : undefined); break;
		case 'ui': ui(a[0]); break;
		case 'tap': sh(`input tap ${a[0]} ${a[1]}`); console.log(`tap ${a[0]},${a[1]}`); break;
		case 'long': sh(`input swipe ${a[0]} ${a[1]} ${a[0]} ${a[1]} ${a[2] ?? 900}`); console.log(`long ${a[0]},${a[1]}`); break;
		case 'tapt': tapt(a[0], Number(a[1] ?? 0)); break;
		case 'swipe': sh(`input swipe ${a[0]} ${a[1]} ${a[2]} ${a[3]} ${a[4] ?? 350}`); console.log('swipe'); break;
		case 'key': sh(a.map((k) => `input keyevent ${k}`).join('; ')); console.log(`key ${a.join(' ')}`); break;
		case 'type': type(a.join(' ').replace(/\\n/g, '\n')); break;
		case 'typef': type(readFileSync(a[0], 'utf8').replace(/\r/g, '').trim()); break;
		case 'wait': await sleep(Number(a[0])); break;
		case 'app': sh(`monkey -p ${a[0]} -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1`); console.log(`app ${a[0]}`); break;
		case 'px': for (let k = 0; k + 1 < a.length; k += 2) console.log(`px ${a[k]},${a[k + 1]} = ${pixel(a[k], a[k + 1]).join('/')}`); break;
		case 'expect': await expect(Number(a[0]), Number(a[1]), a.slice(2, 5).map(Number), Number(a[5] ?? 30)); break;
		case 'push': console.log(adb(['push', a[0], `/${a[1].replace(/^\/+/, '')}`]).toString().trim()); break;
		case 'back': sh('input keyevent 4'); console.log('back'); break;
		case 'open': sh(`am start -a android.intent.action.VIEW -d '${a[0]}'${a[1] ? ` -p ${a[1]}` : ''} >/dev/null`); console.log(`open ${a[0]}`); break;
		case 'cur': console.log(sh("dumpsys window | grep -E 'mCurrentFocus|mFocusedApp' | head -2").trim()); break;
		default: throw new Error(`perintah tidak dikenal: ${c}`);
	}
}

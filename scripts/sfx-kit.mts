// Kit efek suara disintesis dari nol (deterministik, bebas klaim hak cipta).
//   npm run sfx-kit                -> public/sfx/<nama>.wav (48 kHz, stereo, 16-bit)
//   npm run sfx-kit -- --demo      -> juga out/sampel-suara/sfx-kit-demo.mp3

import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {FF} from './lib/ffmpeg.mts';

const SR = 48000;
const TAU = Math.PI * 2;

type Stereo = {l: Float32Array; r: Float32Array};

const rng = (seed: number) => () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buf = (sec: number) => new Float32Array(Math.round(sec * SR));
const stereo = (sec: number): Stereo => ({l: buf(sec), r: buf(sec)});

const white = (n: number, seed: number) => {
	const r = rng(seed);
	return Float32Array.from({length: n}, () => r() * 2 - 1);
};

const pink = (n: number, seed: number) => {
	const w = white(n, seed);
	const out = new Float32Array(n);
	let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
	for (let i = 0; i < n; i++) {
		const x = w[i];
		b0 = 0.99886 * b0 + x * 0.0555179;
		b1 = 0.99332 * b1 + x * 0.0750759;
		b2 = 0.969 * b2 + x * 0.153852;
		b3 = 0.8665 * b3 + x * 0.3104856;
		b4 = 0.55 * b4 + x * 0.5329522;
		b5 = -0.7616 * b5 - x * 0.016898;
		out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + x * 0.5362) * 0.11;
		b6 = x * 0.115926;
	}
	return out;
};

type Kind = 'lp' | 'hp' | 'bp';
const filter = (x: Float32Array, kind: Kind, freq: (t: number) => number, q = 0.707) => {
	const y = new Float32Array(x.length);
	let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
	for (let i = 0; i < x.length; i++) {
		const f = Math.min(SR * 0.45, Math.max(20, freq(i / SR)));
		const w0 = (TAU * f) / SR;
		const cos = Math.cos(w0);
		const alpha = Math.sin(w0) / (2 * q);
		let b0: number, b1: number, b2: number;
		if (kind === 'lp') [b0, b1, b2] = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2];
		else if (kind === 'hp') [b0, b1, b2] = [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2];
		else [b0, b1, b2] = [alpha, 0, -alpha];
		const a0 = 1 + alpha;
		const a1 = -2 * cos;
		const a2 = 1 - alpha;
		const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
		x2 = x1;
		x1 = x[i];
		y2 = y1;
		y1 = v;
		y[i] = v;
	}
	return y;
};

const env = (t: number, attack: number, decay: number, curve = 2) =>
	t < attack ? (t / attack) ** curve : Math.exp(-(t - attack) / decay);

const reverb = (x: Stereo, wet: number, size = 1): Stereo => {
	const run = (src: Float32Array, shift: number) => {
		const combs = [1557, 1617, 1491, 1422].map((d) => Math.round((d + shift) * size));
		const out = new Float32Array(src.length);
		for (const d of combs) {
			const line = new Float32Array(d);
			let k = 0;
			let lp = 0;
			for (let i = 0; i < src.length; i++) {
				const v = line[k];
				lp = v * 0.8 + lp * 0.2;
				line[k] = src[i] + lp * 0.78;
				out[i] += v / combs.length;
				k = (k + 1) % d;
			}
		}
		let y = out;
		for (const d of [225, 556].map((v) => Math.round((v + shift / 4) * size))) {
			const line = new Float32Array(d);
			const z = new Float32Array(y.length);
			let k = 0;
			for (let i = 0; i < y.length; i++) {
				const v = line[k];
				const w = y[i] + v * 0.5;
				line[k] = w;
				z[i] = v - w * 0.5;
				k = (k + 1) % d;
			}
			y = z;
		}
		return Float32Array.from(src, (s, i) => s * (1 - wet) + y[i] * wet * 2.2);
	};
	return {l: run(x.l, 0), r: run(x.r, 23)};
};

const normalize = (s: Stereo, peakDb = -3): Stereo => {
	let peak = 1e-9;
	for (const ch of [s.l, s.r]) for (const v of ch) peak = Math.max(peak, Math.abs(v));
	const g = 10 ** (peakDb / 20) / peak;
	const fade = Math.round(0.008 * SR);
	for (const ch of [s.l, s.r]) {
		for (let i = 0; i < ch.length; i++) ch[i] *= g;
		for (let i = 0; i < fade; i++) ch[ch.length - 1 - i] *= i / fade;
	}
	return s;
};

const sweep = (sec: number, freq: (t: number) => number, amp: (t: number) => number) => {
	const out = buf(sec);
	let ph = 0;
	for (let i = 0; i < out.length; i++) {
		const t = i / SR;
		ph += (TAU * freq(t)) / SR;
		out[i] = Math.sin(ph) * amp(t);
	}
	return out;
};

const pan = (mono: Float32Array, p: (t: number) => number): Stereo => {
	const s = {l: new Float32Array(mono.length), r: new Float32Array(mono.length)};
	for (let i = 0; i < mono.length; i++) {
		const a = ((p(i / SR) + 1) / 2) * (Math.PI / 2);
		s.l[i] = mono[i] * Math.cos(a);
		s.r[i] = mono[i] * Math.sin(a);
	}
	return s;
};
const center = (mono: Float32Array) => pan(mono, () => 0);
const mix = (...parts: [Float32Array, number][]) => {
	const n = Math.max(...parts.map(([p]) => p.length));
	const out = new Float32Array(n);
	for (const [p, g] of parts) for (let i = 0; i < p.length; i++) out[i] += p[i] * g;
	return out;
};

const tick = () => {
	const sec = 0.06;
	const body = sweep(sec, () => 2600, (t) => env(t, 0.0008, 0.006, 1));
	const air = filter(white(buf(sec).length, 11), 'hp', () => 5000).map((v, i) => v * env(i / SR, 0.0004, 0.0022, 1));
	return normalize(center(mix([body, 1], [sweep(sec, () => 5200, (t) => env(t, 0.0008, 0.003, 1)), 0.25], [air, 0.35])));
};

const whoosh = () => {
	const sec = 0.55;
	const n = buf(sec).length;
	const peakT = 0.24;
	const center_ = (t: number) => (t < peakT ? 550 * (2400 / 550) ** (t / peakT) : 2400 * (900 / 2400) ** ((t - peakT) / (sec - peakT)));
	const band = filter(pink(n, 21), 'bp', center_, 1.1);
	const body = filter(filter(pink(n, 22), 'lp', () => 420), 'hp', () => 180);
	const a = (t: number) => (t < peakT ? (t / peakT) ** 1.6 : Math.exp(-(t - peakT) / 0.09));
	const mono = filter(mix([band.map((v, i) => v * a(i / SR)), 1], [body.map((v, i) => v * a(i / SR)), 0.35]), 'hp', () => 140);
	return normalize(reverb(pan(mono, (t) => -0.55 + (1.1 * t) / sec), 0.12));
};

const swish = () => {
	const sec = 0.24;
	const n = buf(sec).length;
	const hp = filter(white(n, 31), 'hp', (t) => 1800 * (6500 / 1800) ** (t / sec));
	const bp = filter(hp, 'bp', (t) => 3200 + 3000 * (t / sec), 0.9);
	const mono = bp.map((v, i) => v * env(i / SR, 0.012, 0.05, 1.3));
	return normalize(pan(mono, (t) => -0.3 + (0.6 * t) / sec));
};

const pop = () => {
	const sec = 0.12;
	const tone = sweep(sec, (t) => 280 + 820 * Math.exp(-t / 0.012), (t) => env(t, 0.0015, 0.03, 1));
	const click = filter(white(buf(sec).length, 41), 'bp', () => 3000, 1.5).map((v, i) => v * env(i / SR, 0.0003, 0.0015, 1));
	return normalize(reverb(center(mix([tone, 1], [click, 0.2])), 0.08));
};

const drip = () => {
	const sec = 0.32;
	const tone = sweep(sec, (t) => 650 + 900 * (1 - Math.exp(-t / 0.018)), (t) => env(t, 0.001, 0.045, 1));
	const tail = sweep(sec, (t) => 1500 + 300 * (1 - Math.exp(-t / 0.03)), (t) => env(t, 0.004, 0.07, 1));
	return normalize(reverb(center(mix([tone, 1], [tail, 0.18])), 0.18, 0.8));
};

const thud = () => {
	const sec = 0.6;
	const n = buf(sec).length;
	const body = sweep(sec, (t) => 150 + 110 * Math.exp(-t / 0.025), (t) => env(t, 0.002, 0.09, 1));
	const sub = sweep(sec, (t) => 85 + 40 * Math.exp(-t / 0.03), (t) => env(t, 0.002, 0.12, 1));
	const knock = filter(filter(white(n, 51), 'lp', () => 1600), 'hp', () => 250).map((v, i) => v * env(i / SR, 0.0008, 0.02, 1));
	const paper = filter(white(n, 52), 'bp', () => 2600, 0.8).map((v, i) => v * env(i / SR, 0.0005, 0.012, 1));
	return normalize(reverb(center(mix([body, 1], [sub, 0.45], [knock, 0.7], [paper, 0.25])), 0.1, 0.7));
};

const buzz = () => {
	const sec = 0.95;
	const n = buf(sec).length;
	const bursts: [number, number][] = [
		[0, 0.34],
		[0.52, 0.86],
	];
	const gate = (t: number) => {
		for (const [a, b] of bursts) {
			if (t >= a && t <= b) return Math.min(1, (t - a) / 0.01, (b - t) / 0.025);
		}
		return 0;
	};
	const wob = (t: number) => 180 + 3 * Math.sin(TAU * 7 * t);
	const motor = mix(
		[sweep(sec, wob, gate), 1],
		[sweep(sec, (t) => wob(t) * 2, gate), 0.55],
		[sweep(sec, (t) => wob(t) * 3, gate), 0.32],
		[sweep(sec, (t) => wob(t) * 4, gate), 0.18],
	);
	const rattle = filter(white(n, 71), 'bp', () => 2300, 1.2).map((v, i) => {
		const t = i / SR;
		return v * gate(t) * Math.abs(Math.sin(TAU * wob(t) * t));
	});
	const mono = filter(mix([motor, 1], [rattle, 0.22]), 'hp', () => 140);
	return normalize(reverb(center(mono), 0.05, 0.6));
};

const riser = () => {
	const sec = 1.4;
	const n = buf(sec).length;
	const noise = filter(pink(n, 61), 'bp', (t) => 300 * (6000 / 300) ** (t / sec), 1.4);
	const tone = sweep(sec, (t) => 200 * 4 ** (t / sec), () => 1);
	const a = (t: number) => (t / sec) ** 2.2;
	const mono = mix([noise.map((v, i) => v * a(i / SR)), 1], [tone.map((v, i) => v * a(i / SR)), 0.12]);
	return normalize(reverb(pan(mono, () => 0), 0.15));
};

const chime = (freq: number, decay: number, sparkle = 0) => {
	const sec = decay * 4.5;
	const parts: [number, number, number][] = [
		[1, 1, decay],
		[2, 0.32, decay * 0.55],
		[3, 0.12, decay * 0.35],
		[4.2, 0.14, decay * 0.12],
	];
	const tone = mix(...parts.map(([k, g, d]): [Float32Array, number] => [sweep(sec, () => freq * k, (t) => env(t, 0.003, d, 1)), g]));
	const out = sparkle ? mix([tone, 1], [sweep(sec, () => freq * 2, (t) => env(t, 0.01, decay * 0.8, 1)), sparkle]) : tone;
	return normalize(reverb(center(out), 0.22, 1.1), -4);
};

const SOUNDS: Record<string, () => Stereo> = {
	tick,
	whoosh,
	swish,
	pop,
	drip,
	thud,
	riser,
	buzz,
	'chime-1': () => chime(659.25, 0.42),
	'chime-2': () => chime(830.61, 0.42),
	'chime-3': () => chime(987.77, 0.65, 0.18),
};

const wav = (s: Stereo) => {
	const n = s.l.length;
	const b = Buffer.alloc(44 + n * 4);
	b.write('RIFF', 0);
	b.writeUInt32LE(36 + n * 4, 4);
	b.write('WAVEfmt ', 8);
	b.writeUInt32LE(16, 16);
	b.writeUInt16LE(1, 20);
	b.writeUInt16LE(2, 22);
	b.writeUInt32LE(SR, 24);
	b.writeUInt32LE(SR * 4, 28);
	b.writeUInt16LE(4, 32);
	b.writeUInt16LE(16, 34);
	b.write('data', 36);
	b.writeUInt32LE(n * 4, 40);
	for (let i = 0; i < n; i++) {
		b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s.l[i])) * 32767), 44 + i * 4);
		b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s.r[i])) * 32767), 46 + i * 4);
	}
	return b;
};

const outDir = path.join('public', 'sfx');
mkdirSync(outDir, {recursive: true});
const made: [string, Stereo][] = [];
for (const [name, make] of Object.entries(SOUNDS)) {
	const s = make();
	writeFileSync(path.join(outDir, `${name}.wav`), wav(s));
	made.push([name, s]);
	console.log(`${name.padEnd(8)} ${(s.l.length / SR).toFixed(2)} dtk -> public/sfx/${name}.wav`);
}

if (process.argv.includes('--demo')) {
	const gap = 0.6;
	const parts = made.filter(([n]) => !n.startsWith('chime'));
	const chimes = made.filter(([n]) => n.startsWith('chime'));
	const total = parts.reduce((t, [, s]) => t + s.l.length / SR + gap, 0) + 3.5;
	const demo = stereo(total);
	let at = 0.3;
	for (const [, s] of parts) {
		const o = Math.round(at * SR);
		for (let i = 0; i < s.l.length; i++) {
			demo.l[o + i] += s.l[i];
			demo.r[o + i] += s.r[i];
		}
		at += s.l.length / SR + gap;
	}
	[0, 0.9, 1.35].forEach((dt, k) => {
		const s = chimes[k][1];
		const o = Math.round((at + dt) * SR);
		for (let i = 0; i < s.l.length && o + i < demo.l.length; i++) {
			demo.l[o + i] += s.l[i];
			demo.r[o + i] += s.r[i];
		}
	});
	mkdirSync(path.join('out', 'sampel-suara'), {recursive: true});
	mkdirSync(path.join('out', 'probe'), {recursive: true});
	const tmp = path.join('out', 'probe', 'sfx-kit-demo.wav');
	writeFileSync(tmp, wav(normalize(demo, -3)));
	const mp3 = path.join('out', 'sampel-suara', 'sfx-kit-demo.mp3');
	execFileSync(FF, ['-v', 'error', '-y', '-i', tmp, '-c:a', 'libmp3lame', '-q:a', '2', mp3]);
	console.log(`demo: ${mp3}`);
}

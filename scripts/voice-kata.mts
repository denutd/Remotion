// Ganti audio SATU kata dengan rekaman donor dari `npm run ucapan`, sambil menyamakan keras suara (RMS) dan crossfade.
//   npm run voice:kata -- <slug> <kata> <donor.mp3> --donor=awal,akhir --target=awal,akhir

import {execFileSync} from 'node:child_process';
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {normalizeWord, tokenize, type Segment} from '../src/lib/narration.ts';
import {buildTimeline, type Timeline, type WordTime} from '../src/lib/timeline.ts';
import {FF} from './lib/ffmpeg.mts';

const FPS = 30;
const RATE = 44100;
const FADE = 0.008;
const XFADE = 0.015;

const [slug, word, donorFile] = process.argv.slice(2);
const opt = (name: string) =>
	process.argv
		.find((a) => a.startsWith(`--${name}=`))
		?.slice(name.length + 3)
		.split(',')
		.map(Number);
const [dA, dB] = opt('donor') ?? [];
const [A, B] = opt('target') ?? [];
if (!slug || !word || !donorFile || [dA, dB, A, B].some((v) => !Number.isFinite(v))) {
	throw new Error('Pakai: npm run voice:kata -- <slug> <kata> <donor.mp3> --donor=awal,akhir --target=awal,akhir');
}
const target = normalizeWord(word);
const {segments, tail} = (await import(`../src/videos/${slug}/script.ts`)) as {segments: Segment[]; tail?: number};
const dir = path.join('public', 'voice', slug);
const timelineFile = path.join('src', 'videos', slug, 'timeline.generated.json');
const old = JSON.parse(readFileSync(timelineFile, 'utf8')) as Timeline;
const tokens = tokenize(segments);
if (tokens.length !== old.words.length || tokens.some((t, i) => t.display !== old.words[i].display)) {
	throw new Error('Token tampilan naskah berbeda dari timeline; kata tidak bisa diganti di tempat.');
}
const hits = old.words.flatMap((w, i) => (normalizeWord(w.display) === target ? [i] : []));
if (!hits.length) throw new Error(`Kata "${word}" tidak ada di timeline ${slug}`);
const ti = hits.reduce((a, b) => (Math.abs(old.words[b].start - A) < Math.abs(old.words[a].start - A) ? b : a));
const tw = old.words[ti];
if (A > tw.start + 0.05 || B < tw.end - 0.1 || (ti + 1 < old.words.length && B > old.words[ti + 1].start + 0.1)) {
	throw new Error(`--target ${A}-${B} tidak cocok dengan kata "${tw.display}" di timeline (${tw.start}-${tw.end}).`);
}

const decode = (file: string) => {
	const pcm = execFileSync(FF, ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(RATE), '-f', 'f32le', '-'], {maxBuffer: 1 << 28});
	return new Float32Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + pcm.byteLength));
};
const at = (t: number) => Math.round(t * RATE);
const rms = (pcm: Float32Array, a: number, b: number) => {
	let s = 0;
	for (let i = at(a); i < at(b); i++) s += pcm[i] * pcm[i];
	return Math.sqrt(s / Math.max(1, at(b) - at(a)));
};

const narr = decode(path.join(dir, 'voice.mp3'));
const donor = decode(donorFile);
const gain = rms(narr, A, B) / Math.max(1e-6, rms(donor, dA, dB));

const p1 = narr.slice(0, at(A));
const p2 = donor.slice(at(dA), at(dB)).map((v) => v * gain);
const p3 = narr.slice(at(B));
const f = at(FADE);
const x = at(XFADE);
for (let i = 0; i < f; i++) {
	p1[p1.length - 1 - i] *= i / f;
	p2[i] *= i / f;
}
for (let i = 0; i < x; i++) {
	const k = i / x;
	p3[i] = p2[p2.length - x + i] * Math.cos((k * Math.PI) / 2) + p3[i] * Math.sin((k * Math.PI) / 2);
}
const total = new Float32Array(p1.length + p2.length - x + p3.length);
total.set(p1, 0);
total.set(p2.subarray(0, p2.length - x), p1.length);
total.set(p3, p1.length + p2.length - x);
const delta = (p2.length - x) / RATE - (B - A);

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backup = path.join(dir, `arsip-kata-${stamp}`);
mkdirSync(backup, {recursive: true});
copyFileSync(path.join(dir, 'voice.mp3'), path.join(backup, 'voice.mp3'));
copyFileSync(timelineFile, path.join(backup, 'timeline.generated.json'));
mkdirSync(path.join('out', 'probe'), {recursive: true});
const raw = path.join('out', 'probe', `kata-${slug}.f32`);
writeFileSync(raw, Buffer.from(total.buffer));
execFileSync(FF, ['-v', 'error', '-y', '-f', 'f32le', '-ar', String(RATE), '-ac', '1', '-i', raw, '-c:a', 'libmp3lame', '-b:a', '192k', path.join(dir, 'voice.mp3')]);

const times: WordTime[] = old.words.map((w, i) => {
	if (i < ti) return {start: w.start, end: w.end};
	if (i > ti) return {start: w.start + delta, end: w.end + delta};
	return {start: A + 0.02, end: A + (p2.length - x) / RATE};
});
const spokenTimes: WordTime[] = tokens.flatMap((t, i) => {
	const {start, end} = times[i];
	const n = t.spoken.length;
	return t.spoken.map((_, j) => ({start: start + ((end - start) * j) / n, end: start + ((end - start) * (j + 1)) / n}));
});
const timeline = buildTimeline({
	segments,
	tokens,
	spokenTimes,
	audioDuration: old.audioDuration + delta,
	fps: FPS,
	audio: old.audio,
	estimated: false,
	tail,
});
writeFileSync(timelineFile, JSON.stringify(timeline, null, '\t') + '\n');

mkdirSync(path.join('out', 'sampel-suara'), {recursive: true});
const nth = hits.length > 1 ? `-${hits.indexOf(ti) + 1}` : '';
const listen = path.join('out', 'sampel-suara', `kata-${slug}-${target}${nth}.mp3`);
execFileSync(FF, ['-v', 'error', '-y', '-ss', String(Math.max(0, A - 1.5)), '-to', String(A + (p2.length - x) / RATE + 1.5), '-i', path.join(dir, 'voice.mp3'), '-c:a', 'libmp3lame', '-q:a', '2', listen]);
console.log(`${slug}: ${tw.display} ${A}-${B} dtk diganti donor ${dA}-${dB} dtk (geser ${delta >= 0 ? '+' : ''}${delta.toFixed(3)} dtk)`);
console.log(`  durasi video ${(old.durationInFrames / FPS).toFixed(1)} -> ${(timeline.durationInFrames / FPS).toFixed(1)} dtk | dengar: ${listen}`);

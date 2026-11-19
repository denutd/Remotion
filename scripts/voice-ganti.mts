// Buat ulang SATU segmen narasi lalu sambung ke voice.mp3 yang sudah ada agar bagian lain tetap persis.
//   npm run voice:ganti -- <slug> <id-segmen>

import {execFileSync} from 'node:child_process';
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {tts, type AlignedWord, type VoiceConfig} from './lib/tts.mts';
import {tokenize, ttsText, type Segment} from '../src/lib/narration.ts';
import {buildTimeline, mapSpokenTimes, type Timeline, type WordTime} from '../src/lib/timeline.ts';
import {FF} from './lib/ffmpeg.mts';

const FPS = 30;
const RATE = 44100;
const PAD_BEFORE = 0.06;
const PAD_AFTER = 0.12;
const FADE = 0.008;

const [slug, segId] = process.argv.slice(2);
if (!slug || !segId) throw new Error('Pakai: npm run voice:ganti -- <slug> <id-segmen>');

const {segments, voice, tail} = (await import(`../src/videos/${slug}/script.ts`)) as {
	segments: Segment[];
	voice: VoiceConfig;
	tail?: number;
};
const dir = path.join('public', 'voice', slug);
const timelineFile = path.join('src', 'videos', slug, 'timeline.generated.json');
const old = JSON.parse(readFileSync(timelineFile, 'utf8')) as Timeline;
const k = segments.findIndex((s) => s.id === segId);
if (k < 0) throw new Error(`Segmen "${segId}" tidak ada di naskah ${slug}`);

const tokens = tokenize(segments);
if (tokens.length !== old.words.length || tokens.some((t, i) => t.display !== old.words[i].display)) {
	throw new Error('Token tampilan naskah berbeda dari timeline lama; pakai `npm run voice` saja.');
}

const decode = (file: string) => {
	const pcm = execFileSync(FF, ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(RATE), '-f', 'f32le', '-'], {maxBuffer: 1 << 28});
	return new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
};
const cut = (pcm: Float32Array, a: number, b: number) => {
	const s = pcm.slice(Math.round(a * RATE), Math.round(b * RATE));
	const f = Math.round(FADE * RATE);
	for (let i = 0; i < f && i < s.length; i++) {
		s[i] *= i / f;
		s[s.length - 1 - i] *= i / f;
	}
	return s;
};

const segText = ttsText([segments[k]]);
const context = {
	previous: k > 0 ? ttsText(segments.slice(Math.max(0, k - 2), k)) : undefined,
	next: k + 1 < segments.length ? ttsText([segments[k + 1]]) : undefined,
};
console.log(`Segmen "${segId}": ${segText}`);
let speech;
try {
	speech = await tts(voice.voiceId, segText, voice, context);
} catch (err) {
	if (!/previous_text|next_text/i.test(String(err))) throw err;
	console.log('  (model menolak konteks previous/next_text, dicoba tanpa konteks)');
	speech = await tts(voice.voiceId, segText, voice);
}
mkdirSync(path.join('out', 'probe'), {recursive: true});
const tmpNew = path.join('out', 'probe', `ganti-${slug}-${segId}.mp3`);
writeFileSync(tmpNew, speech.audio);

const segTokens = tokens.map((t, i) => ({t, i})).filter((x) => x.t.segment === k);
const segSpoken = segTokens.flatMap((x) => x.t.spoken);
const newTimes = mapSpokenTimes(segSpoken, speech.words);

const oldPcm = decode(path.join(dir, 'voice.mp3'));
const newPcm = decode(tmpNew);
const QUIET = -45;
const levelAt = (pcm: Float32Array, t: number) => {
	const i0 = Math.max(0, Math.round(t * RATE));
	const w = Math.round(0.01 * RATE);
	let s = 0;
	for (let j = i0; j < i0 + w && j < pcm.length; j++) s += pcm[j] * pcm[j];
	return 10 * Math.log10(s / w + 1e-12);
};
const seek = (pcm: Float32Array, from: number, to: number) => {
	const step = from < to ? 0.01 : -0.01;
	for (let t = from; step > 0 ? t < to : t > to; t += step) if (levelAt(pcm, t) < QUIET) return t;
	return null;
};
const oldSeg = old.words.filter((w) => w.segment === k);
const prevLast = old.words.filter((w) => w.segment === k - 1).at(-1);
const nextFirst = old.words.find((w) => w.segment === k + 1);
const cutA = seek(oldPcm, oldSeg[0].start - PAD_BEFORE, prevLast ? prevLast.start + 0.2 : 0);
const cutB = seek(oldPcm, oldSeg[oldSeg.length - 1].end + PAD_AFTER, nextFirst ? nextFirst.start - 0.05 : oldPcm.length / RATE);
if (cutA === null || cutB === null) throw new Error('Tidak ada jeda sunyi di tepi segmen; sambungan tidak aman.');
const a = Math.max(0, newTimes[0].start - PAD_BEFORE);
const b = newTimes[newTimes.length - 1].end + PAD_AFTER;
const delta = b - a - (cutB - cutA);

const parts = [cut(oldPcm, 0, cutA), cut(newPcm, a, Math.min(b, newPcm.length / RATE)), cut(oldPcm, cutB, oldPcm.length / RATE)];
const total = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
let o = 0;
for (const p of parts) {
	total.set(p, o);
	o += p.length;
}
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backup = path.join(dir, `arsip-${stamp}`);
mkdirSync(backup, {recursive: true});
copyFileSync(path.join(dir, 'voice.mp3'), path.join(backup, 'voice.mp3'));
copyFileSync(timelineFile, path.join(backup, 'timeline.generated.json'));
const rawFile = path.join('out', 'probe', `ganti-${slug}.f32`);
writeFileSync(rawFile, Buffer.from(total.buffer));
execFileSync(FF, ['-v', 'error', '-y', '-f', 'f32le', '-ar', String(RATE), '-ac', '1', '-i', rawFile, '-c:a', 'libmp3lame', '-b:a', '128k', path.join(dir, 'voice.mp3')]);

const shift = (w: WordTime, d: number): WordTime => ({start: w.start + d, end: w.end + d});
const tokenTimes: WordTime[] = old.words.map((w, i) => {
	if (tokens[i].segment < k) return {start: w.start, end: w.end};
	if (tokens[i].segment > k) return shift(w, delta);
	return {start: 0, end: 0};
});
let si = 0;
for (const {t, i} of segTokens) {
	const first = newTimes[si];
	const last = newTimes[si + t.spoken.length - 1];
	si += t.spoken.length;
	tokenTimes[i] = shift({start: first.start, end: last.end}, cutA - a);
}
const spokenTimes: WordTime[] = tokens.flatMap((t, i) => {
	const {start, end} = tokenTimes[i];
	const n = t.spoken.length;
	return t.spoken.map((_, j) => ({start: start + ((end - start) * j) / n, end: start + ((end - start) * (j + 1)) / n}));
});
const lastEnd = tokenTimes[tokenTimes.length - 1].end;
const timeline = buildTimeline({
	segments,
	tokens,
	spokenTimes,
	audioDuration: lastEnd + 0.35,
	fps: FPS,
	audio: old.audio,
	estimated: false,
	tail,
});
writeFileSync(timelineFile, JSON.stringify(timeline, null, '\t') + '\n');

const oldWords = JSON.parse(readFileSync(path.join(dir, 'words.json'), 'utf8')) as AlignedWord[];
const words = [
	...oldWords.filter((w) => w.end <= cutA),
	...speech.words.filter((w) => w.start >= a && w.end <= b).map((w) => ({...w, start: w.start - a + cutA, end: w.end - a + cutA})),
	...oldWords.filter((w) => w.start >= cutB).map((w) => ({...w, start: w.start + delta, end: w.end + delta})),
];
writeFileSync(path.join(dir, 'words.json'), JSON.stringify(words));

mkdirSync(path.join('out', 'sampel-suara'), {recursive: true});
const listen = path.join('out', 'sampel-suara', `ganti-${slug}-${segId}.mp3`);
execFileSync(FF, ['-v', 'error', '-y', '-ss', String(Math.max(0, cutA - 1)), '-to', String(cutA + (b - a) + 1), '-i', path.join(dir, 'voice.mp3'), '-c:a', 'libmp3lame', '-q:a', '2', listen]);

console.log(`Disambung: ${cutA.toFixed(2)}-${cutB.toFixed(2)} dtk lama -> ${(b - a).toFixed(2)} dtk baru (geser ${delta >= 0 ? '+' : ''}${delta.toFixed(2)} dtk).`);
console.log(`Durasi video ${(old.durationInFrames / FPS).toFixed(1)} -> ${(timeline.durationInFrames / FPS).toFixed(1)} dtk`);
console.log(`Dengar ulang: ${listen} | arsip: ${backup}`);

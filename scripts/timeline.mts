// Bangun ulang timeline.generated.json dari public/voice/<slug>/words.json TANPA API (tanpa kredit).
// Dipakai saat hanya tampilan caption `{tampil|ucap}` yang diubah sementara teks ucapan tetap sama.
//   npm run timeline -- kertas-a4
//   npm run timeline -- kertas-a4 --tulis

import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {tokenize, type Segment} from '../src/lib/narration.ts';
import {buildTimeline, mapSpokenTimes, type Timeline} from '../src/lib/timeline.ts';

const slug = process.argv[2];
if (!slug || slug.startsWith('--')) {
	throw new Error('Pakai: npm run timeline -- <slug-video> [--tulis]');
}
const {segments, tail} = (await import(`../src/videos/${slug}/script.ts`)) as {segments: Segment[]; tail?: number};
const words = JSON.parse(readFileSync(path.join('public', 'voice', slug, 'words.json'), 'utf8')) as {
	text: string;
	start: number;
	end: number;
}[];
const file = path.join('src', 'videos', slug, 'timeline.generated.json');
const old = JSON.parse(readFileSync(file, 'utf8')) as Timeline;

const tokens = tokenize(segments);
const spokenTimes = mapSpokenTimes(
	tokens.flatMap((t) => t.spoken),
	words,
);
const next = buildTimeline({
	segments,
	tokens,
	spokenTimes,
	audioDuration: old.audioDuration,
	fps: 30,
	audio: old.audio,
	estimated: false,
	tail,
});

const sameShape =
	next.words.length === old.words.length &&
	next.durationInFrames === old.durationInFrames &&
	JSON.stringify(next.segments) === JSON.stringify(old.segments);
const timingMoved =
	sameShape &&
	next.words.some((w, i) => w.start !== old.words[i].start || w.end !== old.words[i].end || w.segment !== old.words[i].segment);
const changed = sameShape
	? next.words.flatMap((w, i) => (w.display !== old.words[i].display ? [`  ${old.words[i].display} -> ${w.display}`] : []))
	: [];

if (!sameShape || timingMoved) {
	throw new Error('Jumlah kata/segmen/timing berubah: teks ucapan tidak sama dengan suara yang ada. Jalankan ulang `npm run voice`.');
}
console.log(`${changed.length} kata berubah tampilan:\n${changed.join('\n') || '  (tidak ada)'}`);
if (process.argv.includes('--tulis')) {
	writeFileSync(file, JSON.stringify(next, null, '\t') + '\n');
	console.log(`ditulis: ${file}`);
}

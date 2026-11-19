// Narasi + timeline per video.
//   npm run voice -- kertas-a4                      narasi penuh ElevenLabs + timeline
//   npm run voice -- kertas-a4 --sample Abysa,Andi  sampel 3 segmen pertama per suara
//   npm run voice -- kertas-a4 --estimate           timeline estimasi tanpa API (gratis, untuk desain)

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {elevenJson, postJson} from './lib/eleven.mts';
import {tts, type AlignedWord, type Speech, type VoiceConfig} from './lib/tts.mts';
import {alignmentText, normalizeWord, tokenize, ttsText, type Segment} from '../src/lib/narration.ts';
import {
	buildTimeline,
	estimateSpokenTimes,
	mapSpokenTimes,
	type Timeline,
} from '../src/lib/timeline.ts';

const FPS = 30;

type SharedVoice = {voice_id: string; public_owner_id: string; name: string};
type SttWord = {text: string; type: 'word' | 'spacing' | 'audio_event'; start: number; end: number};
type Stt = {text: string; words: SttWord[]; audio_duration_secs?: number};

const slug = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!slug) {
	throw new Error('Pakai: npm run voice -- <slug-video> [--sample A,B] [--estimate]  (atau: npm run estimate <slug-video>)');
}
const flag = (name: string) => {
	const i = process.argv.indexOf(name);
	return i === -1 ? null : (process.argv[i + 1] ?? '');
};

const {segments, voice, tail} = (await import(`../src/videos/${slug}/script.ts`)) as {
	segments: Segment[];
	voice: VoiceConfig;
	tail?: number;
};

const blob = (audio: Buffer) => new Blob([new Uint8Array(audio)], {type: 'audio/mpeg'});

const library = (): SharedVoice[] => {
	if (!existsSync('out/voices.json')) {
		throw new Error('out/voices.json belum ada. Jalankan dulu: npm run voices -- --json');
	}
	return JSON.parse(readFileSync('out/voices.json', 'utf8')) as SharedVoice[];
};

const speak = async (v: {voiceId: string; name: string}, text: string, cfg: VoiceConfig) => {
	try {
		return await tts(v.voiceId, text, cfg);
	} catch (err) {
		if (!existsSync('out/voices.json')) throw err;
		const shared = library().find((x) => x.voice_id === v.voiceId);
		if (!shared || !/voice/i.test(String(err))) {
			throw err;
		}
		console.log(`  (menambahkan ${v.name} ke My Voices...)`);
		const added = await elevenJson<{voice_id: string}>(
			`/v1/voices/add/${shared.public_owner_id}/${shared.voice_id}`,
			postJson({new_name: v.name}),
		);
		return tts(added.voice_id, text, cfg);
	}
};

let sttUnavailable = false;

const transcribe = async (audio: Buffer): Promise<Stt | null> => {
	if (sttUnavailable) return null;
	const form = new FormData();
	form.append('model_id', 'scribe_v2');
	form.append('file', blob(audio), 'voice.mp3');
	form.append('language_code', 'id');
	form.append('tag_audio_events', 'true');
	form.append('timestamps_granularity', 'word');
	try {
		return await elevenJson<Stt>('/v1/speech-to-text', {method: 'POST', body: form});
	} catch (err) {
		if (String(err).includes('missing_permissions')) {
			sttUnavailable = true;
			console.log('  (QA transkrip dilewati: API key belum punya izin Speech to Text)');
			return null;
		}
		throw err;
	}
};

const forceAlign = async (audio: Buffer, text: string) => {
	const form = new FormData();
	form.append('file', blob(audio), 'voice.mp3');
	form.append('text', text);
	const res = await elevenJson<{words: AlignedWord[]}>('/v1/forced-alignment', {
		method: 'POST',
		body: form,
	});
	return res.words;
};

const editDistance = (a: string[], b: string[]) => {
	const row = Array.from({length: b.length + 1}, (_, j) => j);
	for (let i = 1; i <= a.length; i++) {
		let prev = row[0];
		row[0] = i;
		for (let j = 1; j <= b.length; j++) {
			const tmp = row[j];
			row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
			prev = tmp;
		}
	}
	return row[b.length];
};

const report = (label: string, spoken: string[], speech: Speech, stt: Stt | null) => {
	const w = speech.words;
	const talk = w.length > 1 ? w[w.length - 1].end - w[0].start : 0;
	const gaps = w.slice(1).map((x, i) => x.start - w[i].end);
	console.log(
		`\n[${label}] bicara ${talk.toFixed(1)} dtk | tempo ${(spoken.length / Math.max(talk, 0.001)).toFixed(2)} kata/dtk | ` +
			`jeda >0,6 dtk: ${gaps.filter((g) => g > 0.6).length} | jeda terpanjang ${Math.max(0, ...gaps).toFixed(2)} dtk`,
	);
	if (!stt) return;
	const expected = spoken.map(normalizeWord).filter(Boolean);
	const got = stt.words
		.filter((x) => x.type === 'word')
		.map((x) => normalizeWord(x.text))
		.filter(Boolean);
	const accuracy = 1 - editDistance(expected, got) / expected.length;
	const events = stt.words.filter((x) => x.type === 'audio_event').map((x) => x.text);
	const leaked = /\b(pause|inhales?|exhales?|sighs?|casual|breath)\b/i.test(stt.text);
	console.log(
		`  akurasi ucapan ${(accuracy * 100).toFixed(1)}% | tag terbaca: ${leaked ? 'YA (!)' : 'tidak'} | event: ${events.join(', ') || '-'}`,
	);
	console.log(`  transkrip: ${stt.text}`);
};

const writeTimeline = (timeline: Timeline) => {
	const file = path.join('src', 'videos', slug, 'timeline.generated.json');
	writeFileSync(file, JSON.stringify(timeline, null, '\t') + '\n');
	console.log(
		`\nTimeline: ${file} (${(timeline.durationInFrames / FPS).toFixed(1)} detik, ${timeline.words.length} kata${timeline.estimated ? ', ESTIMASI' : ''})`,
	);
};

const credits = async () => {
	try {
		const s = await elevenJson<{character_count: number; character_limit: number}>('/v1/user/subscription');
		console.log(`Kredit terpakai: ${s.character_count} / ${s.character_limit}`);
	} catch {
		// Dilewati jika API key tidak memiliki hak akses user_read
	}
};

if (process.argv.includes('--estimate')) {
	const tokens = tokenize(segments);
	const {times, duration} = estimateSpokenTimes(tokens);
	writeTimeline(
		buildTimeline({
			segments,
			tokens,
			spokenTimes: times,
			audioDuration: duration,
			fps: FPS,
			audio: null,
			estimated: true,
			tail,
		}),
	);
} else if (flag('--sample') !== null) {
	const names = (flag('--sample') || voice.name).split(',').map((s) => s.trim());
	const sampleSegments = segments.slice(0, 3);
	const text = ttsText(sampleSegments);
	const spoken = tokenize(sampleSegments).flatMap((t) => t.spoken);
	mkdirSync('out/sampel-suara', {recursive: true});
	for (const name of names) {
		const shared = library().find((v) => v.name.toLowerCase().startsWith(name.toLowerCase()));
		if (!shared) {
			console.log(`\n[${name}] tidak ditemukan di out/voices.json`);
			continue;
		}
		const speech = await speak({voiceId: shared.voice_id, name}, text, voice);
		const file = `out/sampel-suara/${name.toLowerCase()}.mp3`;
		writeFileSync(file, speech.audio);
		report(`${name} -> ${file}`, spoken, speech, await transcribe(speech.audio));
	}
	await credits();
} else {
	const tokens = tokenize(segments);
	const spoken = tokens.flatMap((t) => t.spoken);
	const text = ttsText(segments);
	console.log(`Membuat narasi: ${voice.name} / ${voice.model} (${text.length} karakter)`);
	const speech = await speak(voice, text, voice);
	const rel = `voice/${slug}/voice.mp3`;
	mkdirSync(path.join('public', 'voice', slug), {recursive: true});
	writeFileSync(path.join('public', rel), speech.audio);
	writeFileSync(path.join('public', 'voice', slug, 'words.json'), JSON.stringify(speech.words));

	const stt = await transcribe(speech.audio);
	report(voice.name, spoken, speech, stt);

	const aligned = speech.words.length ? speech.words : await forceAlign(speech.audio, alignmentText(tokens));
	const spokenTimes = mapSpokenTimes(spoken, aligned);
	const lastEnd = spokenTimes[spokenTimes.length - 1].end;
	writeTimeline(
		buildTimeline({
			segments,
			tokens,
			spokenTimes,
			audioDuration: stt?.audio_duration_secs ?? lastEnd + 0.35,
			fps: FPS,
			audio: rel,
			estimated: false,
			tail,
		}),
	);
	await credits();
}

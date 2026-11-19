// Text-to-speech ElevenLabs dengan timing per karakter -> kata.
import {elevenJson, postJson} from './eleven.mts';

export type VoiceConfig = {
	name: string;
	voiceId: string;
	model: string;
	stability: number;
	similarity: number;
	seed: number;
};

type Alignment = {
	characters: string[];
	character_start_times_seconds: number[];
	character_end_times_seconds: number[];
};

export type AlignedWord = {text: string; start: number; end: number};

export type Speech = {audio: Buffer; words: AlignedWord[]};

export const wordsFromAlignment = (al: Alignment): AlignedWord[] => {
	const words: AlignedWord[] = [];
	let cur: AlignedWord | null = null;
	let inTag = false;
	const flush = () => {
		if (cur) {
			words.push(cur);
			cur = null;
		}
	};
	al.characters.forEach((ch, i) => {
		if (ch === '[') inTag = true;
		if (inTag || /\s/.test(ch)) {
			if (ch === ']') inTag = false;
			flush();
			return;
		}
		const start = al.character_start_times_seconds[i];
		const end = al.character_end_times_seconds[i];
		if (cur) {
			cur.text += ch;
			cur.end = end;
		} else {
			cur = {text: ch, start, end};
		}
	});
	flush();
	return words;
};

export const tts = async (
	voiceId: string,
	text: string,
	cfg: VoiceConfig,
	context?: {previous?: string; next?: string},
): Promise<Speech> => {
	const res = await elevenJson<{audio_base64: string; alignment: Alignment | null}>(
		`/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
		postJson({
			text,
			model_id: cfg.model,
			language_code: 'id',
			voice_settings: {stability: cfg.stability, similarity_boost: cfg.similarity},
			seed: cfg.seed,
			...(context?.previous ? {previous_text: context.previous} : {}),
			...(context?.next ? {next_text: context.next} : {}),
		}),
	);
	return {
		audio: Buffer.from(res.audio_base64, 'base64'),
		words: res.alignment ? wordsFromAlignment(res.alignment) : [],
	};
};

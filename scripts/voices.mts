// Cek kuota ElevenLabs + cari suara berbahasa Indonesia di Voice Library.
//   npm run voices            -> ringkasan akun, model, dan kandidat suara
//   npm run voices -- --json  -> simpan daftar lengkap ke out/voices.json

import {mkdirSync, writeFileSync} from 'node:fs';
import {elevenJson} from './lib/eleven.mts';

type Subscription = {
	tier: string;
	character_count: number;
	character_limit: number;
	status?: string;
};

type Model = {
	model_id: string;
	name: string;
	can_do_text_to_speech: boolean;
	languages?: {language_id: string; name: string}[];
};

type SharedVoice = {
	public_owner_id: string;
	voice_id: string;
	name: string;
	accent: string;
	gender: string;
	age: string;
	descriptive: string;
	use_case: string;
	category: string;
	language: string | null;
	locale: string | null;
	description: string | null;
	preview_url: string | null;
	usage_character_count_1y: number;
	cloned_by_count: number;
	free_users_allowed?: boolean;
};

const sub = await elevenJson<Subscription>('/v1/user/subscription');
console.log(
	`Akun: tier=${sub.tier}, karakter terpakai ${sub.character_count.toLocaleString('id-ID')} / ${sub.character_limit.toLocaleString('id-ID')}`,
);

const models = await elevenJson<Model[]>('/v1/models');
console.log('\nModel TTS yang mendukung bahasa Indonesia:');
for (const m of models) {
	const id = m.languages?.some((l) => l.language_id === 'id' || l.language_id === 'ind');
	if (m.can_do_text_to_speech && id) {
		console.log(`  - ${m.model_id} (${m.name})`);
	}
}

const gender = process.argv.find((a) => a.startsWith('--gender='))?.split('=')[1];
const seen = new Map<string, SharedVoice>();
for (const sort of ['usage_character_count_1y', 'cloned_by_count', 'trending']) {
	const params = new URLSearchParams({
		language: 'id',
		...(gender ? {gender} : {}),
		page_size: '50',
		sort,
	});
	const res = await elevenJson<{voices: SharedVoice[]}>(`/v1/shared-voices?${params}`);
	for (const v of res.voices) {
		seen.set(v.voice_id, v);
	}
}

const voices = [...seen.values()].sort((a, b) => b.usage_character_count_1y - a.usage_character_count_1y);

console.log(`\nKandidat suara Indonesia: ${voices.length}`);
for (const v of voices.slice(0, 25)) {
	const desc = (v.description ?? '').replace(/\s+/g, ' ').slice(0, 90);
	console.log(
		`- ${v.name} (${v.gender}) | ${v.voice_id} | owner=${v.public_owner_id} | ${v.age}, ${v.accent}, ${v.descriptive} | ` +
			`pakai1th=${v.usage_character_count_1y.toLocaleString('id-ID')} free=${v.free_users_allowed ?? '?'}\n    ${desc}`,
	);
}

if (process.argv.includes('--json')) {
	mkdirSync('out', {recursive: true});
	writeFileSync('out/voices.json', JSON.stringify(voices, null, 2));
	console.log('\nDaftar lengkap disimpan ke out/voices.json');
}

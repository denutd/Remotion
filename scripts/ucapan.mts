// Uji ejaan ucapan satu kata/singkatan dengan suara video sebelum membuat ulang seluruh narasi.
//   npm run ucapan -- kertas-a4 "Standar internasional {X} diterbitkan tahun seribu sembilan ratus tujuh puluh lima." "ai es o dua satu enam" "iso dua ratus enam belas"

import {mkdirSync, writeFileSync} from 'node:fs';
import {elevenJson, postJson} from './lib/eleven.mts';

const [slug, template, ...variants] = process.argv.slice(2);
if (!slug || !template?.includes('{X}') || variants.length === 0) {
	throw new Error('Pakai: npm run ucapan -- <slug> "<kalimat dengan {X}>" "<varian 1>" "<varian 2>" ...');
}
const {voice} = (await import(`../src/videos/${slug}/script.ts`)) as {
	voice: {voiceId: string; model: string; stability: number; similarity: number; seed: number};
};

mkdirSync('out/sampel-suara', {recursive: true});
const lines: string[] = [];
for (const [i, v] of variants.entries()) {
	const text = template.replace('{X}', v);
	const res = await elevenJson<{audio_base64: string}>(
		`/v1/text-to-speech/${voice.voiceId}/with-timestamps?output_format=mp3_44100_128`,
		postJson({
			text,
			model_id: voice.model,
			language_code: 'id',
			voice_settings: {stability: voice.stability, similarity_boost: voice.similarity},
			seed: voice.seed,
		}),
	);
	const file = `out/sampel-suara/ucapan-${slug}-${i + 1}.mp3`;
	writeFileSync(file, Buffer.from(res.audio_base64, 'base64'));
	lines.push(`${i + 1}. "${v}" -> ${file}`);
	console.log(lines[lines.length - 1]);
}
writeFileSync(`out/sampel-suara/ucapan-${slug}.txt`, `${template}\n${lines.join('\n')}\n`);

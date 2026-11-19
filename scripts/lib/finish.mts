// Langkah akhir sesudah render -> SATU file final out/<slug>.mp4:
// video disalin tanpa re-encode (CRF 15), audio dinormalkan dua-pass ke -14 LUFS (AAC 320 kbps),
// metadata sumber & kredit ditanam di dalam file MP4.

import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, rmSync} from 'node:fs';
import path from 'node:path';
import {FF} from './ffmpeg.mts';

export const rawPath = (slug: string) => path.join('out', `${slug}-mentah.mp4`);
export const finalPath = (slug: string) => path.join('out', `${slug}.mp4`);

export const finish = async (slug: string) => {
	const raw = rawPath(slug);
	const final = finalPath(slug);
	if (!existsSync(raw)) throw new Error(`${raw} tidak ada — render dulu: npm run final -- ${slug}`);
	const {sources, credits} = (await import(`../../src/videos/${slug}/script.ts`)) as {sources: string[]; credits?: string[]};
	const description = [...sources, ...(credits ?? [])].join(' | ');

	// Pass 1: ukur kenyaringan audio (JSON loudnorm tercetak di stderr).
	const TARGET = 'I=-14:TP=-1.5:LRA=11';
	const p1 = spawnSync(FF, ['-hide_banner', '-i', raw, '-af', `loudnorm=${TARGET}:print_format=json`, '-f', 'null', '-'], {encoding: 'utf8'});
	const m = JSON.parse(p1.stderr.slice(p1.stderr.lastIndexOf('{'), p1.stderr.lastIndexOf('}') + 1)) as Record<string, string>;
	console.log(`terukur: ${m.input_i} LUFS, true peak ${m.input_tp} dBTP, LRA ${m.input_lra}`);

	// Pass 2: normalisasi linier tanpa menyentuh stream video.
	const af = `loudnorm=${TARGET}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
	execFileSync(FF, [
		'-v', 'error', '-y', '-i', raw,
		'-map', '0', '-c:v', 'copy',
		'-af', af, '-c:a', 'aac', '-b:a', '320k', '-ar', '48000',
		'-map_metadata', '0', '-metadata', `description=${description}`,
		'-movflags', '+faststart', final,
	]);

	const p3 = spawnSync(FF, ['-hide_banner', '-i', final, '-af', 'ebur128=peak=true', '-f', 'null', '-'], {encoding: 'utf8'});
	console.log(
		p3.stderr
			.slice(p3.stderr.lastIndexOf('Summary:'))
			.split('\n')
			.filter((l) => /I:|Peak:|LRA:/.test(l))
			.join('\n'),
	);
	rmSync(raw);
	console.log(`file final: ${final}`);
};

export const extractCover = (slug: string, second: string) => {
	const out = path.join('out', `${slug}-cover.jpg`);
	execFileSync(FF, ['-v', 'error', '-y', '-ss', second, '-i', finalPath(slug), '-frames:v', '1', '-q:v', '2', out]);
	console.log(`sampul: ${out} (detik ${second})`);
};

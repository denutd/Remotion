// Render video final (MP4) dengan WebGL ANGLE, frame PNG CRF 15, lalu normalisasi audio -14 LUFS.
//   npm run final -- kertas-a4
//   npm run final -- cahaya-matahari --frames=0-90 --concurrency=1

import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {channel} from '../src/brand/theme.ts';
import {tungguGiliran} from './lib/antre.mts';
import {finish, rawPath} from './lib/finish.mts';
import {hapusBundle, sapuTemp} from './lib/temp.mts';

const VIDEOS: Record<string, {id: string; title: string; script: string}> = {
	'kertas-a4': {
		id: 'KertasA4',
		title: 'Kenapa Ukuran Kertas A4 210 × 297 mm?',
		script: '../src/videos/kertas-a4/script.ts',
	},
	'cahaya-matahari': {
		id: 'CahayaMatahari',
		title: 'Cahaya Matahari Butuh 8 Menit 19 Detik ke Bumi',
		script: '../src/videos/cahaya-matahari/script.ts',
	},
	'kulit-eksim': {
		id: 'KulitEksim',
		title: 'Kenapa Kulit Eksim Sering Kambuh Padahal Sudah Diobati?',
		script: '../src/videos/kulit-eksim/script.ts',
	},
	'apa-itu-eksim': {
		id: 'ApaItuEksim',
		title: 'Apa Itu Eksim Sebenarnya?',
		script: '../src/videos/apa-itu-eksim/script.ts',
	},
	'gatal-eksim': {
		id: 'GatalEksim',
		title: 'Awalnya Cuma Gatal Sedikit, Tapi Sekali Digaruk Malah Susah Berhenti!',
		script: '../src/videos/gatal-eksim/script.ts',
	},
	'eksim-kambuh': {
		id: 'EksimKambuh',
		title: 'Kenapa Kulit Eksim Sering Kambuh Padahal Sudah Diobati?',
		script: '../src/videos/eksim-kambuh/script.ts',
	},
	'eksim-luka': {
		id: 'EksimLuka',
		title: 'Eksim Sampai Luka? Jangan Tunggu Makin Parah!',
		script: '../src/videos/eksim-luka/script.ts',
	},
	'eksim-skincare': {
		id: 'EksimSkincare',
		title: 'Sudah Ganti Berbagai Macam Skincare Tapi Eksim Masih Kambuh?',
		script: '../src/videos/eksim-skincare/script.ts',
	},
};

const [slug, ...rest] = process.argv.slice(2);
const video = VIDEOS[slug];
if (!video) {
	throw new Error(`Pakai: npm run final -- <${Object.keys(VIDEOS).join('|')}> [--frames=a-b] [--concurrency=n] [--cache=MB]`);
}
const opt = (name: string) => rest.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const frames = opt('frames')?.split('-').map(Number) as [number, number] | undefined;
const concurrency = Number(opt('concurrency') ?? 1);
const cacheBytes = Number(opt('cache') ?? 1024) * 1024 * 1024;
const output = frames ? path.join('out', `${slug}-preview.mp4`) : rawPath(slug);
const {sources, credits} = (await import(video.script)) as {sources: string[]; credits?: string[]};

mkdirSync('out', {recursive: true});
await tungguGiliran(`${slug}${frames ? ' (pratinjau)' : ''}`);
const t0 = Date.now();
sapuTemp();
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const chromiumOptions = {gl: 'angle' as const};
const inputProps = {debug: false};

let last = -1;
try {
	const composition = await selectComposition({
		serveUrl,
		id: video.id,
		inputProps,
		chromiumOptions,
		timeoutInMilliseconds: 120000,
	});
	await renderMedia({
		serveUrl,
		composition,
		inputProps,
		chromiumOptions,
		codec: 'h264',
		crf: 15,
		x264Preset: 'slow',
		imageFormat: 'png',
		concurrency,
		offthreadVideoCacheSizeInBytes: cacheBytes,
		frameRange: frames,
		timeoutInMilliseconds: 120000,
		outputLocation: output,
		metadata: {
			title: `${video.title} — ${channel.name}`,
			artist: channel.name,
			album_artist: channel.name,
			copyright: `© ${channel.copyrightYear} ${channel.handle}`,
			comment: `Dibuat dengan starter kit Remotion — ${channel.handle}`,
			description: [...sources, ...(credits ?? [])].join(' | '),
			date: channel.copyrightYear,
		},
		onProgress: ({progress}) => {
			const pct = Math.floor(progress * 100);
			if (pct !== last && pct % 5 === 0) {
				last = pct;
				const min = (Date.now() - t0) / 60000;
				console.log(`${pct}% (${min.toFixed(1)} mnt)`);
			}
		},
	});
} finally {
	hapusBundle(serveUrl);
}
console.log(`render selesai: ${output} (${((Date.now() - t0) / 60000).toFixed(1)} mnt)`);
if (!frames) await finish(slug);

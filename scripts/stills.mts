// QA visual: render frame tertentu (detik) sebagai PNG untuk diperiksa.
//   npm run stills -- KertasA4 0 3.5 8.0
//   npm run stills -- KertasA4 0 --debug --scale=1
//   npm run stills -- CahayaMatahari 2.5

import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {hapusBundle, sapuTemp} from './lib/temp.mts';

const [id, ...rest] = process.argv.slice(2);
if (!id) {
	throw new Error('Pakai: npm run stills -- <CompositionId> <detik...> [--debug] [--scale=0.5] [--props=JSON] [--tag=nama] [--verbose]');
}
const opt = (name: string) => rest.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const debug = rest.includes('--debug');
const verbose = rest.includes('--verbose');
const scale = Number(opt('scale') ?? 0.5);
const extra = opt('props') ? JSON.parse(opt('props') as string) : {};
const tag = opt('tag');
const times = rest.filter((a) => !a.startsWith('--')).map(Number);
if (times.length === 0) times.push(0);
const logLevel = verbose ? 'verbose' : 'info';

let t0 = Date.now();
sapuTemp();
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
console.log(`bundle: ${((Date.now() - t0) / 1000).toFixed(1)} dtk`);
const browser = await openBrowser('chrome', {chromiumOptions: {gl: 'angle'}, logLevel});
const inputProps = {debug, ...extra};
const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser, logLevel});
mkdirSync(path.join('out', 'stills'), {recursive: true});

for (const t of times) {
	t0 = Date.now();
	const frame = Math.min(composition.durationInFrames - 1, Math.round(t * composition.fps));
	const output = path.join('out', 'stills', `${id}-${String(frame).padStart(4, '0')}${tag ? `-${tag}` : ''}.png`);
	await renderStill({
		composition,
		serveUrl,
		output,
		frame,
		inputProps,
		scale,
		imageFormat: 'png',
		puppeteerInstance: browser,
		logLevel,
		timeoutInMilliseconds: 120000,
	});
	console.log(`${t.toFixed(2)} dtk -> ${output} (${((Date.now() - t0) / 1000).toFixed(1)} dtk)`);
}
await browser.close({silent: true});
hapusBundle(serveUrl);

// Generator footage demo sintetis 1080x1920 30fps (tanpa download stok video).
// Berguna untuk mencoba komponen <Rekaman> atau <FootagePlane> secara offline.
//   npm run demo-footage

import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {FF} from './lib/ffmpeg.mts';

const outDir = path.join('public', 'footage', 'demo');
mkdirSync(outDir, {recursive: true});
const out = path.join(outDir, 'latar-demo.mp4');

// Buat klip 6 detik 30fps dengan gradien bergerak halus (tidak diam > 0.5 detik) dan blur lembut.
execFileSync(FF, [
	'-v', 'error', '-y',
	'-f', 'lavfi',
	'-i', 'testsrc2=size=540x960:rate=30:duration=6',
	'-vf', 'scale=1080:1920:flags=bicubic,gblur=sigma=28,eq=brightness=-0.22:saturation=0.55,format=yuv420p',
	'-c:v', 'libx264', '-crf', '18', '-an',
	out,
], {stdio: 'inherit'});

console.log(`Demo footage siap: ${out} (1080x1920, 30 fps, 180 frame)`);

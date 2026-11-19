// Langkah akhir manual jika audio normalisasi perlu diulang atau ingin ekstrak sampul dari video final.
//   npm run finish -- <slug>
//   npm run finish -- <slug> --cover=1.5

import {existsSync} from 'node:fs';
import {extractCover, finish, rawPath} from './lib/finish.mts';

const [slug, ...rest] = process.argv.slice(2);
if (!slug) throw new Error('Pakai: npm run finish -- <slug> [--cover=detik]');
const cover = rest.find((a) => a.startsWith('--cover='))?.slice('--cover='.length);

if (existsSync(rawPath(slug))) await finish(slug);
else if (!cover) console.log(`tidak ada ${rawPath(slug)} — file final sudah jadi (atau jalankan: npm run final -- ${slug})`);
if (cover) extractCover(slug, cover);

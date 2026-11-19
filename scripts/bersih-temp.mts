// Hapus sisa render Remotion di folder Temp OS.
//   npm run bersih-temp
//   npm run bersih-temp -- --jam=1

import {sapuTemp} from './lib/temp.mts';

const jam = Number(process.argv.find((a) => a.startsWith('--jam='))?.slice('--jam='.length) ?? 6);
const t0 = Date.now();
sapuTemp(jam);
console.log(`selesai (${((Date.now() - t0) / 1000).toFixed(0)} dtk)`);

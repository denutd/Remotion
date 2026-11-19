// Lokasi ffmpeg lengkap (harus punya filter loudnorm, ebur128, minterpolate, blackdetect).
// Urutan cari: env FFMPEG -> shim Chocolatey (Windows) -> `ffmpeg` di PATH.
import {existsSync} from 'node:fs';

const CHOCO = 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe';

export const FF = process.env.FFMPEG || (existsSync(CHOCO) ? CHOCO : 'ffmpeg');

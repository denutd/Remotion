// Pembersih sisa bundle & render Remotion di folder Temp OS agar disk tidak menumpuk.
import {readdirSync, rmSync, statSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PREFIXES = ['remotion-webpack-bundle-', 'remotion-v4', 'react-motion-render'];

const hapus = (dir: string) => {
	try {
		rmSync(dir, {recursive: true, force: true, maxRetries: 2});
		return true;
	} catch {
		return false;
	}
};

export const sapuTemp = (hours = 6) => {
	const tmp = os.tmpdir();
	const batas = Date.now() - hours * 3600_000;
	let n = 0;
	for (const name of readdirSync(tmp)) {
		if (!PREFIXES.some((p) => name.startsWith(p))) continue;
		const dir = path.join(tmp, name);
		try {
			if (statSync(dir).mtimeMs > batas) continue;
		} catch {
			continue;
		}
		if (hapus(dir)) n++;
	}
	if (n > 0) console.log(`temp: ${n} folder sisa render lama dihapus`);
};

export const hapusBundle = (serveUrl: string) => {
	const dir = path.resolve(serveUrl);
	if (path.dirname(dir) !== path.resolve(os.tmpdir()) || !path.basename(dir).startsWith(PREFIXES[0])) return;
	hapus(dir);
};

import {readFileSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Antrean render: hanya SATU `npm run final` berjalan di satu waktu supaya RAM tidak habis.
const LOCK = path.join(os.tmpdir(), 'ooohgt-tutorial-render.lock');

const hidup = (pid: number) => {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
};

export const tungguGiliran = async (label: string) => {
	let dikabari = false;
	for (;;) {
		try {
			writeFileSync(LOCK, JSON.stringify({pid: process.pid, label, mulai: new Date().toISOString()}), {flag: 'wx'});
			process.on('exit', () => {
				try {
					if ((JSON.parse(readFileSync(LOCK, 'utf8')) as {pid: number}).pid === process.pid) rmSync(LOCK);
				} catch {
					// kunci sudah dilepas
				}
			});
			return;
		} catch {
			let holder: {pid: number; label: string; mulai: string} | null = null;
			try {
				holder = JSON.parse(readFileSync(LOCK, 'utf8'));
			} catch {
				// kunci baru saja dihapus
			}
			if (holder && !hidup(holder.pid)) {
				rmSync(LOCK, {force: true});
				continue;
			}
			if (holder && !dikabari) {
				console.log(`antre: menunggu render "${holder.label}" (pid ${holder.pid}, mulai ${holder.mulai}) selesai...`);
				dikabari = true;
			}
			await new Promise((r) => setTimeout(r, 15_000));
		}
	}
};

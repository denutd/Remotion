// Klien kecil untuk API ElevenLabs. Membaca `.env` secara aman jika tersedia
// (tanpa mewajibkan file `.env` saat menjalankan mode gratis `--estimate`), dan tidak pernah mencetak key.

import {existsSync, readFileSync} from 'node:fs';

const BASE = 'https://api.elevenlabs.io';

const loadLocalEnv = () => {
	if (!existsSync('.env')) return;
	for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
		const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
		if (!m || m[1].startsWith('#')) continue;
		const val = m[2].replace(/^['"]|['"]$/g, '').trim();
		if (!(m[1] in process.env) && val) process.env[m[1]] = val;
	}
};

export const getApiKey = (): string => {
	loadLocalEnv();
	const key = process.env.ELEVENLABS_API_KEY?.trim();
	if (!key) {
		throw new Error(
			'ELEVENLABS_API_KEY belum diisi. Salin .env.example menjadi .env lalu tempel key dari elevenlabs.io.',
		);
	}
	return key;
};

const request = async (path: string, init: RequestInit = {}): Promise<Response> => {
	const res = await fetch(`${BASE}${path}`, {
		...init,
		headers: {'xi-api-key': getApiKey(), ...init.headers},
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`ElevenLabs ${init.method ?? 'GET'} ${path} -> ${res.status}: ${body}`);
	}
	return res;
};

export const elevenJson = async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
	const res = await request(path, init);
	return (await res.json()) as T;
};

export const elevenBinary = async (path: string, init: RequestInit = {}): Promise<Buffer> => {
	const res = await request(path, init);
	return Buffer.from(await res.arrayBuffer());
};

export const postJson = (body: unknown): RequestInit => ({
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify(body),
});

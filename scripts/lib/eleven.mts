// Klien kecil untuk API ElevenLabs dengan dukungan Multi-Key Auto Failover.
// Membaca `.env` secara aman jika tersedia (tanpa pernah mencetak isi key).

import {existsSync, readFileSync} from 'node:fs';

const BASE = 'https://api.elevenlabs.io';

let envLoaded = false;
let activeKeyIndex = 0;
let cachedKeys: string[] | null = null;

const loadLocalEnv = () => {
	if (envLoaded) return;
	envLoaded = true;
	if (!existsSync('.env')) return;
	for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
		const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
		if (!m || m[1].startsWith('#')) continue;
		const val = m[2].replace(/^['"]|['"]$/g, '').trim();
		if (!(m[1] in process.env) && val) process.env[m[1]] = val;
	}
};

export const getApiKeys = (): string[] => {
	if (cachedKeys) return cachedKeys;
	loadLocalEnv();
	const keys: string[] = [];

	// 1. Cek ELEVENLABS_API_KEYS (plural, bisa dipisah koma)
	if (process.env.ELEVENLABS_API_KEYS) {
		const parts = process.env.ELEVENLABS_API_KEYS.split(',').map((k) => k.trim()).filter(Boolean);
		keys.push(...parts);
	}

	// 2. Cek ELEVENLABS_API_KEY (tunggal atau dipisah koma)
	if (process.env.ELEVENLABS_API_KEY) {
		const parts = process.env.ELEVENLABS_API_KEY.split(',').map((k) => k.trim()).filter(Boolean);
		keys.push(...parts);
	}

	// 3. Cek pola berindeks: ELEVENLABS_API_KEY_1 s/d ELEVENLABS_API_KEY_20
	for (let i = 1; i <= 20; i++) {
		const k = process.env[`ELEVENLABS_API_KEY_${i}`]?.trim();
		if (k) keys.push(k);
	}

	// Hilangkan duplikasi dan filter key yang valid
	const uniqueKeys = Array.from(new Set(keys.filter((k) => k.length >= 10)));
	if (uniqueKeys.length === 0) {
		throw new Error(
			'ELEVENLABS_API_KEY belum diisi. Salin .env.example menjadi .env lalu tempel key dari elevenlabs.io.',
		);
	}

	cachedKeys = uniqueKeys;
	return uniqueKeys;
};

export const getApiKey = (): string => {
	const keys = getApiKeys();
	return keys[activeKeyIndex] ?? keys[0];
};

export const getActiveKeyIndex = (): number => activeKeyIndex;

const isFailoverCandidate = (status: number, body: string): boolean => {
	// Status HTTP atau error detail yang umum saat kuota habis, kredit 0, rate-limit, atau key bermasalah
	if (status === 401 || status === 402 || status === 429) return true;
	const lower = body.toLowerCase();
	return (
		lower.includes('quota') ||
		lower.includes('credit') ||
		lower.includes('limit_exceeded') ||
		lower.includes('paid_plan_required') ||
		lower.includes('unusual_activity')
	);
};

const request = async (path: string, init: RequestInit = {}): Promise<Response> => {
	const keys = getApiKeys();

	while (activeKeyIndex < keys.length) {
		const currentKey = keys[activeKeyIndex];
		const res = await fetch(`${BASE}${path}`, {
			...init,
			headers: {'xi-api-key': currentKey, ...init.headers},
		});

		if (res.ok) {
			return res;
		}

		const body = await res.text();

		// Jika error terindikasi kuota habis/limit dan masih ada key cadangan
		if (isFailoverCandidate(res.status, body) && activeKeyIndex + 1 < keys.length) {
			const oldIndex = activeKeyIndex + 1;
			activeKeyIndex++;
			console.warn(
				`\n⚠️ [ElevenLabs] API Key #${oldIndex} bermasalah / kuota habis (HTTP ${res.status}). ` +
					`Otomatis beralih ke API Key #${activeKeyIndex + 1} (tersisa ${keys.length - activeKeyIndex} key cadangan)...`,
			);
			continue;
		}

		throw new Error(
			`ElevenLabs ${init.method ?? 'GET'} ${path} -> ${res.status}: ${body}` +
				(keys.length > 1 ? ` (Gagal setelah mencoba key #${activeKeyIndex + 1} dari ${keys.length} key)` : ''),
		);
	}

	throw new Error(`Semua (${keys.length}) API key ElevenLabs telah dicoba dan kehabisan kuota.`);
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

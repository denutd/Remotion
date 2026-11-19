import type {Segment} from '../../lib/narration';

// Video Tutorial #2 (3D WebGL Three.js + GLSL + PostFX): "Cahaya Matahari butuh 8 menit 19 detik ke Bumi"
// Semua objek 3D (Matahari plasma, Bumi prosedural, bintang, aliran foton) dirender murni oleh shader GLSL
// tanpa file tekstur/model eksternal.

export const slug = 'cahaya-matahari';

export const tail = 0.5;

export const voice = {
	name: 'Abysa',
	voiceId: 'WXmGNP5rvPWuO0RYTqfP',
	model: 'eleven_v4',
	stability: 0.45,
	similarity: 0.75,
	seed: 7,
};

export const segments: Segment[] = [
	{
		id: 'hook',
		say: '[casual] Cahaya Matahari yang baru menyentuh wajahmu itu... ternyata berangkat delapan menit yang lalu.',
	},
	{
		id: 'speed',
		say: 'Padahal cahaya itu hal tercepat di alam semesta — hampir {300|tiga ratus} ribu kilometer tiap detik.',
	},
	{
		id: 'distance',
		say: '[inhales] Jarak rata-rata Bumi ke Matahari sekitar {149,6|seratus empat puluh sembilan koma enam} juta kilometer. Waktu tempuhnya: {499|empat ratus sembilan puluh sembilan} detik, atau {8|delapan} menit {19|sembilan belas} detik.',
	},
	{
		id: 'meaning',
		say: 'Jadi setiap menatap Matahari, kita sebenarnya melihat keadaannya delapan menit di masa lalu.',
	},
	{
		id: 'outro',
		say: 'Oh... gitu ternyata.',
	},
];

export const sources = [
	'IAU 2012 Resolution B2 — definisi baku 1 Satuan Astronomi (AU) = 149.597.870.700 meter.',
	'BIPM / Sistem Satuan Internasional (SI) — kecepatan cahaya di ruang hampa c = 299.792.458 m/detik.',
	'Waktu tempuh rata-rata = 1 AU ÷ c ≈ 499,0 detik (8 menit 19 detik).',
];

export const credits = [
	'Visualisasi 3D (Matahari, planet, aliran foton, bintang): shader GLSL prosedural Three.js.',
	'Efek suara: kit sintesis lokal (sfx-kit).',
];

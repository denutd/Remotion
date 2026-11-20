import type {Segment} from '../../lib/narration';

// Video Iklan & Edukasi: "Eksim Sampai Luka? Jangan Tunggu Makin Parah!"
// Voice: Bagas (Native Indonesian Male, tegas, empatik, meyakinkan)

export const slug = 'eksim-luka';

export const tail = 0.5;

export const voice = {
	name: 'Bagas',
	voiceId: 'aJiaMo73BheNakP6EPev',
	model: 'eleven_multilingual_v2',
	stability: 0.65,
	similarity: 0.8,
	seed: 123,
};

export const segments: Segment[] = [
	{
		id: 'hook',
		say: 'Kulit eksim sampai lecet karena terus digaruk? Ini bukan masalah yang boleh dianggap sepele!',
	},
	{
		id: 'tension',
		say: 'Garukan berulang bisa merusak permukaan kulit dan meningkatkan risiko infeksi.',
	},
	{
		id: 'medis',
		say: 'Kalau eksim sampai luka, bernanah, terasa nyeri, atau semakin meluas, segera periksakan ke dokter.',
	},
	{
		id: 'solusi',
		say: 'Untuk perawatan kelembapan kulit, kamu bisa mengenal Noekoella Skin Barrier.',
	},
	{
		id: 'cta',
		say: 'Rawat kulitmu dengan tepat. Cek produknya sekarang!',
	},
];

export const sources = [
	'National Eczema Association (NEA) — Infection Risks in Atopic Dermatitis.',
	'Perdoski — Panduan Diagnosis dan Penatalaksanaan Dermatitis Atopik di Indonesia.',
	'Noekoella Skin Barrier Care — Intensive Hydration Formula.',
];

export const credits = [
	'Footage & Brand Assets: Noekoella + Creator Collection',
];

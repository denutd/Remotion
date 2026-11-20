import type {Segment} from '../../lib/narration';

// Video Iklan & Edukasi: "Sudah Ganti Berbagai Macam Skincare Tapi Eksim Masih Kambuh?"
// Voice: Bagas (Bagas - Suara, Dalam & Rileks)
// Audio Source: ElevenLabs_2026-11-20T09_13_23_Bagas - Suara, Dalam & Rileks_pvc_s50_m2.mp3

export const slug = 'eksim-skincare';

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
		say: 'Sudah ganti berbagai macam skincare, tapi kulit masih sering gatal, merah, dan mengelupas?',
	},
	{
		id: 'edukasi',
		say: 'Perlu kamu tahu, eksim bukan sekadar masalah kosmetik.',
	},
	{
		id: 'peradangan',
		say: 'Ini merupakan kondisi peradangan kulit yang membutuhkan perawatan sesuai penyebab dan tingkat keparahannya.',
	},
	{
		id: 'barrier',
		say: 'Selain penanganan yang tepat, menjaga kelembapan dan {skin barrier|skin berier} juga penting.',
	},
	{
		id: 'solusi',
		say: 'Kenali Noekoella Skin Barrier untuk membantu merawat kulitmu.',
	},
	{
		id: 'cta',
		say: 'Cek detail produknya di keranjang kuning!',
	},
];

export const sources = [
	'National Eczema Association (NEA) — Not Just Cosmetic: Inflammatory Basis of Atopic Dermatitis.',
	'Perdoski — Panduan Tatalaksana Dermatitis Atopik Indonesia.',
	'Noekoella Skin Barrier Care — Intensive Hydration Formula.',
];

export const credits = [
	'Footage & Brand Assets: Noekoella + Creator Collection',
];

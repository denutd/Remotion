import type {Segment} from '../../lib/narration';

// Iklan Edukatif / Komersial: Noekoella Skin Barrier
// Judul: "Awalnya cuma gatal sedikit, tapi sekali digaruk malah susah berhenti!"

export const slug = 'gatal-eksim';

export const tail = 0.5;

export const voice = {
	name: 'Liam',
	voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
	model: 'eleven_multilingual_v2',
	stability: 0.5,
	similarity: 0.75,
	seed: 42,
};

export const segments: Segment[] = [
	{
		id: 'hook',
		say: 'Semakin digaruk, kok malah semakin enak? Tapi hati-hati! Kebiasaan ini justru bisa bikin kulit semakin iritasi.',
	},
	{
		id: 'problem',
		say: 'Buat kamu yang sering mengalami kulit kering, gatal, dan rentan eksim, jangan asal menggaruk atau memilih {skincare|skin ker}.',
	},
	{
		id: 'solution',
		say: 'Coba kenali Noekoella Skin Barrier, perawatan kulit yang dirancang untuk membantu menjaga kelembapan dan merawat skin barrier.',
	},
	{
		id: 'cta',
		say: 'Yuk, cek produknya sekarang. Jangan tunggu kulit makin tidak nyaman!',
	},
];

export const sources = [
	'National Eczema Association (NEA) — The Itch-Scratch Cycle in Atopic Dermatitis.',
	'Noekoella Skin Barrier Care — Formula hidrasi & perawatan sawar kulit.',
];

export const credits = [
	'Footage & Brand Assets: Noekoella + Creator Collection',
];

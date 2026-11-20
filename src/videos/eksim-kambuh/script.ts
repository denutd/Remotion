import type {Segment} from '../../lib/narration';

// Video Edukasi & Solusi: "Kenapa Kulit Eksim Sering Kambuh Padahal Sudah Diobati"
// Pacing: Cepat, Hook Kuat & Penasaran, Solusi Noekoella Skin Barrier.

export const slug = 'eksim-kambuh';

export const tail = 0.5;

// Suara Siti (penutur asli Indonesia, hangat, ramah, dan meyakinkan untuk edukasi skincare & kesehatan)
export const voice = {
	name: 'Siti',
	voiceId: 'WAotVoK2Yv2ufjocfYYs',
	model: 'eleven_multilingual_v2',
	stability: 0.65,
	similarity: 0.8,
	seed: 123,
};

export const segments: Segment[] = [
	{
		id: 'hook',
		say: 'Sudah oles salep sampai habis, tapi kenapa eksim selalu kambuh lagi di tempat yang sama?',
	},
	{
		id: 'tension',
		say: 'Banyak yang salah paham! Kebanyakan obat cuma meredakan radang sesaat, tapi tidak menambal lapisan pelindung kulitmu yang rusak.',
	},
	{
		id: 'sains',
		say: 'Ibarat dinding bata yang semennya hilang, air kulit menguap dan kuman gampang masuk lagi. Makanya begitu salep berhenti, gatal langsung balik!',
	},
	{
		id: 'solusi',
		say: 'Kuncinya adalah memperbaiki lapisan pelindung kulit. Kenali Noekoella Skin Barrier Care, dengan Ceramide Complex untuk mengunci kelembapan dan memperkuat {skin barrier|skin berier} secara mendalam.',
	},
	{
		id: 'cta',
		say: 'Hentikan siklus kambuhnya dari akar. Cek Noekoella sekarang dan kembalikan kenyamanan kulitmu!',
	},
];

export const sources = [
	'National Eczema Association (NEA) — Skin Barrier Function in Atopic Dermatitis.',
	'Elias PM. — The Brick and Mortar Model of Epidermal Barrier.',
	'Noekoella Skin Barrier Care — Ceramide Complex Hydration Formula.',
];

export const credits = [
	'Footage & Brand Assets: Noekoella + Creator Collection',
];

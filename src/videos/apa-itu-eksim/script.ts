import type {Segment} from '../../lib/narration';

// Video Awareness: "Apa Itu Eksim?"
// Menghapus stigma penyakit menular, menjelaskan siklus gatal-garuk, dan sains dasar sawar kulit.

export const slug = 'apa-itu-eksim';

export const tail = 0.5;

export const voice = {
	name: 'Liam',
	voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
	model: 'eleven_multilingual_v2',
	stability: 0.5,
	similarity: 0.75,
	seed: 7,
};

export const segments: Segment[] = [
	{
		id: 'hook',
		say: 'Sering dikira penyakit menular atau sekadar alergi biasa... sebenarnya apa sih itu eksim?',
	},
	{
		id: 'tension',
		say: 'Banyak yang mengira rasa gatalnya bisa selesai cuma dengan digaruk. Padahal semakin kamu garuk, lapisan pelindung kulitmu makin rusak dan memicu alarm radang yang jauh lebih parah.',
	},
	{
		id: 'sawar',
		say: 'Secara medis, eksim atau dermatitis atopik adalah kondisi peradangan kronis di mana benteng pertahanan kulit melemah. Akibatnya, air mudah menguap dan kulit jadi super reaktif terhadap debu, cuaca kering, atau sabun keras.',
	},
	{
		id: 'lega',
		say: 'Dan yang paling penting: eksim itu sama sekali tidak menular. Ini adalah faktor genetik dan sistem imun yang bereaksi berlebihan, bukan karena kamu jorok atau kurang bersih.',
	},
	{
		id: 'outro',
		say: 'Kuncinya bukan menahan gatal dengan digaruk, tapi rutin menenangkan dan mengunci hidrasi barier kulitmu.',
	},
];

export const sources = [
	'National Eczema Association (NEA) — What is Eczema and Atopic Dermatitis.',
	'Sidbury R, et al. (2023) — Guidelines of care for the management of atopic dermatitis. JAAD.',
	'World Health Organization (WHO) — Atopic Eczema global prevalence and non-communicable status.',
];

export const credits = [
	'Foto & B-roll visual: AI Generated + Unsplash License (Community Free)',
];

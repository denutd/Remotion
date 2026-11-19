import type {Segment} from '../../lib/narration';

// Video: "Kenapa Kulit Eksim Sering Kambuh Padahal Sudah Diobati"
// Penjelasan sains sawar kulit (Skin Barrier), Brick & Mortar Model (Elias, 1983),
// defisiensi Filaggrin/Ceramide, dan pentingnya terapi proaktif.
// VISUAL: Murni diagram penampang seluler mikroskopis geometris & grafik editorial (TANPA makhluk bernyawa).

export const slug = 'kulit-eksim';

/** Ekor 0,5 dtk sesudah "ternyata" agar EndCard tidak meninggalkan layar diam terlalu lama. */
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
		// HOOK (0–3 dtk): langsung tampil utuh di frame 0
		id: 'hook',
		say: 'Kenapa eksim selalu kambuh lagi... padahal salepnya baru saja bikin kulit kelihatan mulus?',
	},
	{
		// TENSION: salep meredakan radang, tapi sawar kulit tetap bocor
		id: 'tension',
		say: 'Banyak yang mengira sudah sembuh total, padahal obat salep itu cuma memadamkan alarm kebakaran, bukan membangun kembali benteng pertahanan kulit.',
	},
	{
		// PAYOFF 1: Elias (1983) - Brick & Mortar Model
		id: 'model',
		say: 'Tahun {1983,|seribu sembilan ratus delapan puluh tiga,} dermatolog Peter Elias merumuskan model bata dan semen untuk lapisan terluar kulit kita.',
	},
	{
		// PAYOFF 2: Defisiensi Filaggrin, Ceramide & TEWL
		id: 'barrier',
		say: 'Sel kulit adalah batu batanya, sedangkan ceramide adalah semennya. Pada penderita eksim, ada mutasi gen filaggrin yang bikin semennya keropos, air menguap keluar, dan kuman mudah masuk kembali.',
	},
	{
		// PAYOFF 3: Solusi ilmiah - Perawatan proaktif (barier konsisten)
		id: 'solusi',
		say: 'Itulah kenapa begitu salep berhenti, radang datang lagi kalau semennya tidak ditambal setiap hari dengan pelembap pelindung barier.',
	},
	{
		// OUTRO
		id: 'outro',
		say: 'Rawat barier kulitmu setiap hari agar eksim tidak gampang kambuh lagi.',
	},
];

export const sources = [
	'Elias PM (1983) — Epidermal lipids, barrier function, and desquamation. J Invest Dermatol.',
	'Palmer CN, et al. (2006) — Common loss-of-function variants of filaggrin in atopic dermatitis. Nature Genetics.',
	'Sidbury R, et al. (2023) — Guidelines of care for the management of atopic dermatitis. J Am Acad Dermatol (JAAD).',
];

export const credits = [
	'Dermatology skin barrier diagram concept based on Elias Brick-and-Mortar model (1983)',
];

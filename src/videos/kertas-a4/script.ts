import type {Segment} from '../../lib/narration';

// Video Tutorial #1 (Editorial 2D + SVG): "Kenapa ukuran kertas A4 210 × 297 mm?"
// Contoh lengkap struktur HTPC (Hook -> Tension -> Payoff -> Call to Value / Outro) dengan
// markup {tampil|ucap}, audio tag [casual]/[inhales], dan sitasi sumber primer di setiap klaim.

export const slug = 'kertas-a4';

/** Ekor 0,5 dtk sesudah "ternyata" agar EndCard tidak meninggalkan layar diam terlalu lama. */
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
		// HOOK: langsung tampil utuh di frame 0 (klaim spesifik + angka nyata).
		id: 'hook',
		say: '[casual] Kenapa kertas {A4|a empat} ukurannya nggak bulat — malah {210|dua ratus sepuluh} kali {297|dua ratus sembilan puluh tujuh} milimeter?',
	},
	{
		// TENSION: tunjukkan apa yang rusak kalau angkanya dibulatkan (200 x 300).
		id: 'tension',
		say: 'Kalau dibulatkan jadi {200|dua ratus} kali {300|tiga ratus}, begitu dilipat dua, perbandingan panjang dan lebarnya langsung rusak.',
	},
	{
		// PAYOFF 1: Lichtenberg (1786) & rasio 1 : akar 2.
		id: 'lichtenberg',
		say: '[inhales] Tahun {1786,|seribu tujuh ratus delapan puluh enam,} fisikawan Jerman Georg Christoph Lichtenberg menemukan rasio satu banding akar dua.',
	},
	{
		// PAYOFF 2: Porstmann (DIN 476, 1922 -> ISO 216) menetapkan A0 = 1 m² lalu dibagi dua berulang.
		id: 'lipat',
		say: 'Lalu tahun {1922,|seribu sembilan ratus dua puluh dua,} Walter Porstmann menetapkan {A0|a nol} seluas tepat satu meter persegi. Dilipat empat kali, jadilah {A4.|a empat.}',
	},
	{
		// PAYOFF 3: dampak nyata di dunia sehari-hari (potong tanpa sisa & fotokopi 2 halaman A5 ke 1 A4).
		id: 'manfaat',
		say: 'Hasilnya, pabrik memotong kertas nyaris tanpa sisa, dan dua halaman {A5|a lima} pas difotokopi ke selembar {A4.|a empat.}',
	},
	{
		// OUTRO: penutup ringkas di atas visual yang tetap bergerak.
		id: 'outro',
		say: 'Oh... gitu ternyata.',
	},
];

export const sources = [
	'ISO 216:2007 — Writing paper and certain classes of printed matter — Trimmed sizes — A and B series.',
	'DIN 476 (18 Agustus 1922), dirumuskan Walter Porstmann — sistem seri A dengan luas A0 = 1 m².',
	'Georg Christoph Lichtenberg, surat kepada Johann Beckmann (25 Oktober 1786) — rasio aspek 1 : √2.',
];

export const credits = [
	'Diagram lipatan kertas & perbandingan rasio: ilustrasi prosedural SVG.',
	'Efek suara: kit sintesis lokal (sfx-kit).',
];

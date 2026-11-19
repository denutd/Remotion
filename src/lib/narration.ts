// Markup naskah (dipakai bersama oleh Remotion dan skrip suara):
//   {tampil|ucap}  caption menampilkan "tampil", narator mengucapkan "ucap"
//                  contoh: {2017|dua ribu tujuh belas}, {ISO|ai es o}
//   [tag]          audio tag ElevenLabs v4 (mis. [casual], [inhales]); tidak tampil dan tidak di-align

export type Segment = {
	id: string;
	say: string;
};

export type Token = {
	/** Teks yang tampil di caption, boleh berisi spasi ("210 mm"). */
	display: string;
	/** Kata-kata yang diucapkan narator untuk token ini. */
	spoken: string[];
	/** Indeks segmen naskah tempat token ini berada. */
	segment: number;
};

const SUB = /\{([^|{}]+)\|([^{}]+)\}/g;
const TAG = /\[[^\]]*\]/g;
const PLACEHOLDER = /\u0000(\d+)\u0000/g;

const collapse = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Teks yang dikirim ke text-to-speech (audio tag ikut dikirim). */
export const ttsText = (segments: Segment[]): string =>
	segments
		.map((s) => collapse(s.say.replace(SUB, (_m, _d: string, spoken: string) => spoken.trim())))
		.join('\n');

export const tokenize = (segments: Segment[]): Token[] => {
	const tokens: Token[] = [];
	segments.forEach((seg, segment) => {
		const subs: {display: string; spoken: string}[] = [];
		const text = seg.say.replace(TAG, ' ').replace(SUB, (_m, display: string, spoken: string) => {
			subs.push({display: display.trim(), spoken: spoken.trim()});
			return `\u0000${subs.length - 1}\u0000`;
		});
		for (const raw of collapse(text).split(' ')) {
			if (!raw) {
				continue;
			}
			const expand = (pick: 'display' | 'spoken') =>
				raw.replace(PLACEHOLDER, (_m, i: string) => subs[Number(i)][pick]);
			tokens.push({display: expand('display'), spoken: expand('spoken').split(/\s+/), segment});
		}
	});
	return tokens;
};

/** Transkrip tanpa tag, persis kata-kata yang diucapkan; dipakai untuk forced alignment. */
export const alignmentText = (tokens: Token[]): string => tokens.flatMap((t) => t.spoken).join(' ');

/** Normalisasi kata untuk pencocokan: huruf kecil, tanpa tanda baca/diakritik. */
export const normalizeWord = (w: string): string =>
	w
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]/g, '');

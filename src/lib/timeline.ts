import {normalizeWord, type Segment, type Token} from './narration';

export type TimelineWord = {
	display: string;
	/** detik */
	start: number;
	/** detik */
	end: number;
	segment: number;
};

export type Timeline = {
	fps: number;
	/** true = durasi kata masih tebakan (belum ada audio asli). */
	estimated: boolean;
	/** Path audio relatif terhadap folder public/, atau null. */
	audio: string | null;
	audioDuration: number;
	durationInFrames: number;
	segments: {id: string; start: number; end: number}[];
	words: TimelineWord[];
};

export type WordTime = {start: number; end: number};

// Visual pindah sedikit sebelum kalimat baru diucapkan, supaya gambar sudah siap saat kata terdengar.
const SEGMENT_LEAD = 0.2;
// Napas ekstra sesudah narasi selesai. Video dengan EndCard ringkas memakai tail = 0.5 di script.ts
// agar tidak ada ruang kosong lama setelah konten berakhir (menjaga retensi tonton).
export const TAIL = 1.6;

export const buildTimeline = ({
	segments,
	tokens,
	spokenTimes,
	audioDuration,
	fps,
	audio,
	estimated,
	tail = TAIL,
}: {
	segments: Segment[];
	tokens: Token[];
	/** Satu entri per kata yang diucapkan (urut sesuai tokens[].spoken). */
	spokenTimes: WordTime[];
	audioDuration: number;
	fps: number;
	audio: string | null;
	estimated: boolean;
	/** Detik sesudah narasi selesai; default TAIL. */
	tail?: number;
}): Timeline => {
	let k = 0;
	const words: TimelineWord[] = tokens.map((t) => {
		const first = spokenTimes[k];
		const last = spokenTimes[k + t.spoken.length - 1];
		k += t.spoken.length;
		return {display: t.display, start: first.start, end: last.end, segment: t.segment};
	});

	const total = audioDuration + tail;
	const starts = segments.map((_, i) => {
		if (i === 0) {
			return 0;
		}
		const firstWord = words.find((w) => w.segment === i);
		const prevWords = words.filter((w) => w.segment === i - 1);
		const prevEnd = prevWords.length ? prevWords[prevWords.length - 1].end : 0;
		if (!firstWord) {
			return prevEnd;
		}
		return Math.max(prevEnd + 0.05, firstWord.start - SEGMENT_LEAD);
	});

	return {
		fps,
		estimated,
		audio,
		audioDuration,
		durationInFrames: Math.ceil(total * fps),
		segments: segments.map((s, i) => ({
			id: s.id,
			start: starts[i],
			end: i + 1 < segments.length ? starts[i + 1] : total,
		})),
		words,
	};
};

/** Tebakan durasi bicara (tanpa API audio) untuk merancang animasi lebih dulu. */
export const estimateSpokenTimes = (tokens: Token[]): {times: WordTime[]; duration: number} => {
	const times: WordTime[] = [];
	let t = 0.25;
	tokens.forEach((token, i) => {
		token.spoken.forEach((w, j) => {
			const syllables = Math.max(1, (w.toLowerCase().match(/[aiueo]+/g) ?? []).length);
			const d = 0.08 + syllables * 0.15;
			times.push({start: t, end: t + d});
			t += d + 0.04;
			const isLast = j === token.spoken.length - 1;
			if (isLast && /[.?!]$/.test(w)) {
				t += 0.42;
			} else if (isLast && /[,;:]$/.test(w)) {
				t += 0.2;
			}
		});
		const next = tokens[i + 1];
		if (next && next.segment !== token.segment) {
			t += 0.24;
		}
	});
	return {times, duration: t + 0.3};
};

/**
 * Petakan kata-kata naskah ke hasil forced alignment menggunakan DP edit distance
 * agar tahan terhadap perbedaan tokenisasi tanda baca/angka.
 */
export const mapSpokenTimes = (
	spoken: string[],
	aligned: {text: string; start: number; end: number}[],
): WordTime[] => {
	const a = spoken.map(normalizeWord);
	const bAll = aligned.map((w) => ({...w, n: normalizeWord(w.text)})).filter((w) => w.n);
	const b = bAll.map((w) => w.n);

	const n = a.length;
	const m = b.length;
	const cost: number[][] = Array.from({length: n + 1}, () => new Array<number>(m + 1).fill(0));
	for (let i = 0; i <= n; i++) cost[i][0] = i;
	for (let j = 0; j <= m; j++) cost[0][j] = j;
	for (let i = 1; i <= n; i++) {
		for (let j = 1; j <= m; j++) {
			const sub = cost[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
			cost[i][j] = Math.min(sub, cost[i - 1][j] + 1, cost[i][j - 1] + 1);
		}
	}

	const match = new Array<number>(n).fill(-1);
	let i = n;
	let j = m;
	while (i > 0 && j > 0) {
		const sub = cost[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
		if (cost[i][j] === sub) {
			match[i - 1] = j - 1;
			i--;
			j--;
		} else if (cost[i][j] === cost[i - 1][j] + 1) {
			i--;
		} else {
			j--;
		}
	}

	const times: (WordTime | null)[] = match.map((idx) =>
		idx >= 0 ? {start: bAll[idx].start, end: bAll[idx].end} : null,
	);
	// Kata yang tidak ketemu: isi dengan interpolasi dari tetangganya.
	for (let x = 0; x < times.length; x++) {
		if (times[x]) continue;
		const prev = times.slice(0, x).reverse().find(Boolean) ?? null;
		const nextIdx = times.findIndex((t, y) => y > x && t);
		const next = nextIdx >= 0 ? times[nextIdx] : null;
		const from = prev ? prev.end : 0;
		const to = next ? next.start : from + 0.4;
		const span = nextIdx >= 0 ? nextIdx - x + 1 : 1;
		const step = (to - from) / span;
		times[x] = {start: from + step * 0.1, end: from + step * 0.9};
	}
	return times as WordTime[];
};

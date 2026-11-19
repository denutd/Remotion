import type {FC} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, layout} from '../brand/theme';
import {easeOut, mix, prog} from '../lib/anim';
import type {TimelineWord} from '../lib/timeline';

type Page = {
	tokens: {text: string; start: number; end: number}[];
	start: number;
	end: number;
};

const MAX_TOKENS = 3;
const MAX_CHARS = 18;
const CHAR_TOLERANCE = 2;
// Jeda lebih panjang dari ini = caption hilang dulu, lalu halaman berikutnya muncul pelan.
const SILENCE = 0.6;
const STICKY = new Set(['di', 'ke', 'dari', 'yang', 'dan', 'si', 'sama', 'pakai', 'buat', 'sebuah', 'dengan', 'untuk', 'atau']);

// Caption tanpa titik/koma di ujung; tanda tanya tetap.
const clean = (s: string) => s.replace(/(\.\.\.|[.,;:!])+$/u, '');
const textLength = (ws: TimelineWord[]) => ws.reduce((n, w) => n + clean(w.display).length + 1, -1);

/** Akhir klausa bawaan: titik, koma, elipsis, tanda tanya/seru. */
export const CLAUSE_END = /(\.\.\.|[.,?!])$/;

/**
 * Pecah narasi per klausa (titik/koma/segmen), lalu bagi tiap klausa menjadi halaman yang
 * seimbang — 4 kata jadi 2+2, bukan 3+1 — supaya tidak ada kata yatim di layar.
 */
export const buildPages = (words: TimelineWord[], hiddenSegments: number[], clauseEnd: RegExp = CLAUSE_END): Page[] => {
	const clauses: TimelineWord[][] = [];
	let clause: TimelineWord[] = [];
	for (const w of words) {
		if (hiddenSegments.includes(w.segment)) {
			continue;
		}
		const prev = clause[clause.length - 1];
		if (prev && prev.segment !== w.segment) {
			clauses.push(clause);
			clause = [];
		}
		clause.push(w);
		if (clauseEnd.test(w.display)) {
			clauses.push(clause);
			clause = [];
		}
	}
	if (clause.length) {
		clauses.push(clause);
	}

	const pages: Page[] = [];
	for (const c of clauses) {
		for (const ch of splitClause(c)) {
			pages.push({
				tokens: ch.map((w) => ({text: clean(w.display), start: w.start, end: w.end})),
				start: ch[0].start,
				end: ch[ch.length - 1].end,
			});
		}
	}
	return pages;
};

/**
 * Pecah satu klausa menjadi halaman dengan dynamic programming (DP):
 * batas ≤ 3 kata & ≤ 20 huruf; penalti kata sambung menggantung & halaman 1 kata yatim.
 */
const splitClause = (c: TimelineWord[]): TimelineWord[][] => {
	const n = c.length;
	const limit = MAX_CHARS + CHAR_TOLERANCE;
	const pageCount = Math.max(Math.ceil(n / MAX_TOKENS), Math.ceil(textLength(c) / MAX_CHARS));
	const ideal = textLength(c) / pageCount;
	const best: number[] = new Array(n + 1).fill(Infinity);
	const from: number[] = new Array(n + 1).fill(-1);
	best[0] = 0;
	for (let i = 1; i <= n; i++) {
		for (let j = Math.max(0, i - MAX_TOKENS); j < i; j++) {
			if (best[j] === Infinity) continue;
			const page = c.slice(j, i);
			const len = textLength(page);
			if (len > limit && page.length > 1) continue;
			const last = clean(page[page.length - 1].display).toLowerCase();
			let cost = (len - ideal) ** 2 + 400;
			if (i < n && STICKY.has(last)) cost += 5000;
			if (page.length === 1 && n > 1) cost += 1500;
			if (best[j] + cost < best[i]) {
				best[i] = best[j] + cost;
				from[i] = j;
			}
		}
	}
	const chunks: TimelineWord[][] = [];
	for (let i = n; i > 0; i = from[i]) {
		chunks.unshift(c.slice(from[i], i));
	}
	return chunks;
};

/**
 * Caption per kata di atas zona aman bawah. `outline = true` menambahkan kontur gelap
 * agar terbaca di atas latar terang tanpa butuh kotak/pelat latar.
 */
export const Captions: FC<{words: TimelineWord[]; hiddenSegments: number[]; clauseEnd?: RegExp; outline?: boolean}> = ({
	words,
	hiddenSegments,
	clauseEnd,
	outline = false,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const pages = buildPages(words, hiddenSegments, clauseEnd);

	const idx = pages.findLastIndex((p) => p.start - 0.05 <= t);
	if (idx === -1) {
		return null;
	}
	const page = pages[idx];
	const next = pages[idx + 1];
	const prev = pages[idx - 1];
	const until = next && next.start - page.end < SILENCE ? next.start - 0.05 : page.end + 0.35;
	if (t > until) {
		return null;
	}

	const afterSilence = !prev || page.start - prev.end >= SILENCE;
	const local = frame - Math.round((page.start - 0.05) * fps);
	const e = prog(local, 0, 5, easeOut);

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: layout.captionY,
				display: 'flex',
				justifyContent: 'center',
				transform: `translateY(-50%) translateY(${mix(e, afterSilence ? 16 : 6, 0)}px) scale(${mix(e, 0.96, 1)})`,
				opacity: afterSilence ? e : 1,
			}}
		>
			<div
				style={{
					maxWidth: 840,
					textAlign: 'center',
					fontSize: 72,
					fontWeight: 800,
					lineHeight: 1.12,
					letterSpacing: '-0.01em',
					color: colors.ink,
					textShadow: '0 6px 26px rgba(4,6,14,0.9), 0 2px 6px rgba(4,6,14,0.7)',
					...(outline ? {WebkitTextStroke: '9px rgba(3,6,10,0.82)', paintOrder: 'stroke fill', textShadow: '0 4px 18px rgba(4,6,14,0.85), 0 1px 3px rgba(4,6,14,0.9)'} : {}),
				}}
			>
				{page.tokens.map((tok, i) => {
					const nextTok = page.tokens[i + 1];
					const active = t >= tok.start - 0.03 && (!nextTok || t < nextTok.start - 0.03);
					return (
						<span key={i} style={{color: active ? colors.aha : colors.ink}}>
							{tok.text}
							{nextTok ? ' ' : ''}
						</span>
					);
				})}
			</div>
		</div>
	);
};

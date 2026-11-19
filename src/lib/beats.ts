import {normalizeWord} from './narration';
import type {TimelineWord} from './timeline';

/** Frame (relatif ke awal scene) saat sebuah kata diucapkan; `nth` = kemunculan ke-n di scene. */
export type Beat = (word: string, nth?: number) => number;

export type SceneProps = {
	/** Durasi scene dalam frame, termasuk tumpang-tindih transisi. */
	dur: number;
	/** Frame saat kata mulai diucapkan. */
	beat: Beat;
	/** Frame saat kata selesai diucapkan. */
	beatEnd: Beat;
};

export const makeBeat =
	(words: TimelineWord[], sceneStartFrame: number, fps: number, edge: 'start' | 'end'): Beat =>
	(word, nth = 0) => {
		const target = normalizeWord(word);
		const exact = words.filter((w) => normalizeWord(w.display) === target);
		const hits = exact.length
			? exact
			: words.filter((w) => normalizeWord(w.display).startsWith(target));
		const hit = hits[nth];
		if (!hit) {
			throw new Error(`Kata "${word}" (#${nth}) tidak ada di scene ini`);
		}
		return Math.round(hit[edge] * fps) - sceneStartFrame;
	};

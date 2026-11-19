import {Easing, interpolate, spring} from 'remotion';
import {FPS} from '../brand/theme';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Satu bahasa gerak untuk semua video: keluar cepat lalu melambat halus.
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

/** Progres 0→1 antara frame a dan b. */
export const prog = (frame: number, a: number, b: number, easing: (t: number) => number = easeOut) =>
	interpolate(frame, [a, b], [0, 1], {...CLAMP, easing});

/** Masuk halus tanpa pantulan. */
export const enter = (frame: number, at: number, durationInFrames = 18) =>
	spring({frame: frame - at, fps: FPS, config: {damping: 200}, durationInFrames});

/** Masuk dengan sedikit pantulan, untuk angka/ikon yang "pop". */
export const pop = (frame: number, at: number) =>
	spring({frame: frame - at, fps: FPS, config: {damping: 13, stiffness: 170, mass: 0.7}});

export const mix = (t: number, a: number, b: number) => a + (b - a) * t;

/** Denyut singkat 1 → peak → 1, dimulai di frame `at`. */
export const pulse = (frame: number, at: number, peak = 1.3, length = 18) =>
	interpolate(frame, [at, at + length * 0.3, at + length], [1, peak, 1], {
		...CLAMP,
		easing: Easing.inOut(Easing.quad),
	});

import type {FC, ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {easeInOut, mix, prog} from '../lib/anim';

/** Lama crossfade antar scene (frame). Scene diperpanjang sebanyak ini supaya saling tumpang. */
export const TRANSITION = 10;

const SPLIT = 0.7;

export const SceneShell: FC<{
	dur: number;
	fadeIn: boolean;
	fadeOut: boolean;
	children: ReactNode;
}> = ({dur, fadeIn, fadeOut, children}) => {
	const frame = useCurrentFrame();
	const i = fadeIn ? prog(frame, TRANSITION * (1 - SPLIT), TRANSITION, easeInOut) : 1;
	const o = fadeOut ? prog(frame, dur - TRANSITION, dur - TRANSITION * (1 - SPLIT), easeInOut) : 0;
	return (
		<AbsoluteFill
			style={{
				opacity: i * (1 - o),
				transform: `scale(${mix(i, 1.025, 1) * mix(o, 1, 0.985)})`,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

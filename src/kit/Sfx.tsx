import {Audio} from '@remotion/media';
import type {FC} from 'react';
import {Sequence, staticFile, useVideoConfig} from 'remotion';

// Kit efek suara disintesis dari nol oleh `npm run sfx-kit` (bebas klaim hak cipta).
// Dipasang di dalam scene: <Sfx name="tick" at={bKata - 2} />. `at` = frame relatif scene.
export type SfxName = 'tick' | 'whoosh' | 'swish' | 'pop' | 'drip' | 'thud' | 'riser' | 'buzz' | 'chime-1' | 'chime-2' | 'chime-3';

const VOLUME: Record<SfxName, number> = {
	tick: 0.2,
	whoosh: 0.22,
	swish: 0.2,
	pop: 0.13,
	drip: 0.15,
	thud: 0.16,
	riser: 0.18,
	buzz: 0.12,
	'chime-1': 0.16,
	'chime-2': 0.15,
	'chime-3': 0.17,
};

const LENGTH: Record<SfxName, number> = {
	tick: 0.06,
	whoosh: 0.55,
	swish: 0.24,
	pop: 0.12,
	drip: 0.32,
	thud: 0.6,
	riser: 1.4,
	buzz: 0.95,
	'chime-1': 1.89,
	'chime-2': 1.89,
	'chime-3': 2.92,
};

export const Sfx: FC<{name: SfxName; at: number; volume?: number}> = ({name, at, volume}) => {
	const {fps} = useVideoConfig();
	if (!Number.isFinite(at) || at < 0) return null;
	return (
		<Sequence name={`sfx:${name}`} from={Math.round(at)} durationInFrames={Math.ceil(LENGTH[name] * fps) + 2} layout="none">
			<Audio src={staticFile(`sfx/${name}.wav`)} volume={volume ?? VOLUME[name]} />
		</Sequence>
	);
};

import {Audio} from '@remotion/media';
import type {FC} from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {colors} from '../../brand/theme';
import {Captions} from '../../components/Captions';
import {SafeZones} from '../../components/SafeZones';
import {Watermark} from '../../components/Watermark';
import {Sfx} from '../../kit/Sfx';
import {makeBeat, type SceneProps} from '../../lib/beats';
import type {Timeline} from '../../lib/timeline';
import {Cta} from './scenes/Cta';
import {Hook} from './scenes/Hook';
import {Medis} from './scenes/Medis';
import {Solusi} from './scenes/Solusi';
import {Tension} from './scenes/Tension';
import timelineJson from './timeline.generated.json';

export const timeline = timelineJson as Timeline;

const segIndex = (id: string) => timeline.segments.findIndex((s) => s.id === id);
const segStart = (id: string) => timeline.segments[segIndex(id)].start;

const SCENES: {name: string; from: number; Component: FC<SceneProps>}[] = [
	{name: 'hook', from: 0, Component: Hook},
	{name: 'tension', from: segStart('tension'), Component: Tension},
	{name: 'medis', from: segStart('medis'), Component: Medis},
	{name: 'solusi', from: segStart('solusi'), Component: Solusi},
	{name: 'cta', from: segStart('cta'), Component: Cta},
];

const OVERLAP = 2;
const CLAUSE_END = /(\.\.\.|…|[.,?!:;])$/;

export const EksimLuka: FC<{debug: boolean}> = ({debug}) => {
	const {fps, durationInFrames} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily, color: colors.ink, backgroundColor: '#070b17'}}>
			{/* Rangkaian Adegan Video */}
			{SCENES.map(({name, from: fromSec, Component}, i) => {
				const from = Math.round(fromSec * fps);
				const last = i === SCENES.length - 1;
				const to = last ? durationInFrames : Math.round(SCENES[i + 1].from * fps);
				const dur = to - from + (last ? 0 : OVERLAP);
				const words = timeline.words.filter((w) => w.start * fps >= from - 2 && w.start * fps < to + OVERLAP);

				return (
					<Sequence key={name} name={name} from={from} durationInFrames={dur}>
						<Component
							dur={dur}
							beat={makeBeat(words, from, fps, 'start')}
							beatEnd={makeBeat(words, from, fps, 'end')}
						/>
					</Sequence>
				);
			})}

			{/* Efek Suara Transisi Antar Adegan */}
			<Sfx name="whoosh" at={Math.round(segStart('tension') * fps) - 4} />
			<Sfx name="swish" at={Math.round(segStart('medis') * fps) - 4} />
			<Sfx name="chime-1" at={Math.round(segStart('solusi') * fps) - 2} />
			<Sfx name="chime-2" at={Math.round(segStart('cta') * fps) - 2} />

			{/* Subtitle Dinamis Kata per Kata */}
			<Captions words={timeline.words} hiddenSegments={[]} clauseEnd={CLAUSE_END} outline />

			{/* Branding / Watermark */}
			<Watermark />

			{/* Musik Latar Ambience Hangat (Membuat Video Tidak Sunyi/Hening) */}
			<Audio src={staticFile('sfx/bgm-ambient.wav')} volume={0.12} />

			{/* Suara Narasi Bagas (ElevenLabs) */}
			{timeline.audio ? <Audio src={staticFile(timeline.audio)} volume={1.0} /> : null}

			{/* Safe Zone Debugging */}
			{debug ? <SafeZones /> : null}
		</AbsoluteFill>
	);
};

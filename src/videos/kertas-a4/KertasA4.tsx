import {Audio} from '@remotion/media';
import type {FC} from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {colors} from '../../brand/theme';
import {Background} from '../../components/Background';
import {Captions} from '../../components/Captions';
import {SafeZones} from '../../components/SafeZones';
import {Watermark} from '../../components/Watermark';
import {makeBeat, type SceneProps} from '../../lib/beats';
import type {Timeline} from '../../lib/timeline';
import {Hook} from './scenes/Hook';
import {Lichtenberg} from './scenes/Lichtenberg';
import {Lipat} from './scenes/Lipat';
import {Manfaat} from './scenes/Manfaat';
import {Penutup} from './scenes/Penutup';
import {Tension} from './scenes/Tension';
import timelineJson from './timeline.generated.json';

export const timeline = timelineJson as Timeline;

const segIndex = (id: string) => timeline.segments.findIndex((s) => s.id === id);
const segStart = (id: string) => timeline.segments[segIndex(id)].start;

const SCENES: {name: string; from: number; Component: FC<SceneProps>}[] = [
	{name: 'hook', from: 0, Component: Hook},
	{name: 'tension', from: segStart('tension'), Component: Tension},
	{name: 'lichtenberg', from: segStart('lichtenberg'), Component: Lichtenberg},
	{name: 'lipat', from: segStart('lipat'), Component: Lipat},
	{name: 'manfaat', from: segStart('manfaat'), Component: Manfaat},
	{name: 'outro', from: segStart('outro'), Component: Penutup},
];

const HIDDEN = [segIndex('outro')];
const OVERLAP = 2;
const CLAUSE_END = /(\.\.\.|…|[.,?!:;])$/;

export const KertasA4: FC<{debug: boolean}> = ({debug}) => {
	const {fps, durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill style={{fontFamily, color: colors.ink}}>
			<Background />
			{SCENES.map(({name, from: fromSec, Component}, i) => {
				const from = Math.round(fromSec * fps);
				const last = i === SCENES.length - 1;
				const to = last ? durationInFrames : Math.round(SCENES[i + 1].from * fps);
				const dur = to - from + (last ? 0 : OVERLAP);
				const words = timeline.words.filter((w) => w.start * fps >= from - 2 && w.start * fps < to + OVERLAP);
				return (
					<Sequence key={name} name={name} from={from} durationInFrames={dur}>
						<Component dur={dur} beat={makeBeat(words, from, fps, 'start')} beatEnd={makeBeat(words, from, fps, 'end')} />
					</Sequence>
				);
			})}
			<Captions words={timeline.words} hiddenSegments={HIDDEN} clauseEnd={CLAUSE_END} outline />
			<Watermark />
			{timeline.audio ? <Audio src={staticFile(timeline.audio)} /> : null}
			{debug ? <SafeZones /> : null}
		</AbsoluteFill>
	);
};

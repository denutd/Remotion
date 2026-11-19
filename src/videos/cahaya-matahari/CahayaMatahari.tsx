import {Audio} from '@remotion/media';
import type {FC} from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {colors} from '../../brand/theme';
import {Background} from '../../components/Background';
import {Captions} from '../../components/Captions';
import {SafeZones} from '../../components/SafeZones';
import {SceneShell, TRANSITION} from '../../components/SceneShell';
import {Watermark} from '../../components/Watermark';
import {makeBeat, type SceneProps} from '../../lib/beats';
import type {Timeline} from '../../lib/timeline';
import {Hook3D} from './scenes3d/Hook3D';
import {Penutup3D} from './scenes3d/Penutup3D';
import {Perjalanan3D} from './scenes3d/Perjalanan3D';
import timelineJson from './timeline.generated.json';

export const timeline = timelineJson as Timeline;

// Contoh arsitektur multi-segmen dalam satu adegan 3D kontinu (`SceneShell` crossfade).
const SCENES: {segments: string[]; Component: FC<SceneProps>}[] = [
	{segments: ['hook'], Component: Hook3D},
	{segments: ['speed', 'distance', 'meaning'], Component: Perjalanan3D},
	{segments: ['outro'], Component: Penutup3D},
];

const OUTRO = timeline.segments.findIndex((s) => s.id === 'outro');

export const CahayaMatahari: FC<{debug: boolean}> = ({debug}) => {
	const {fps, durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill style={{fontFamily, color: colors.ink}}>
			<Background />
			{SCENES.map(({segments, Component}, i) => {
				const idx = timeline.segments.flatMap((s, k) => (segments.includes(s.id) ? [k] : []));
				const from = Math.round(timeline.segments[idx[0]].start * fps);
				const to = Math.round(timeline.segments[idx[idx.length - 1]].end * fps);
				const last = i === SCENES.length - 1;
				const dur = (last ? durationInFrames : to) - from + (last ? 0 : TRANSITION);
				const words = timeline.words.filter((w) => idx.includes(w.segment));
				return (
					<Sequence key={segments.join('+')} name={segments.join(' + ')} from={from} durationInFrames={dur}>
						<SceneShell dur={dur} fadeIn={i > 0} fadeOut={!last}>
							<Component
								dur={dur}
								beat={makeBeat(words, from, fps, 'start')}
								beatEnd={makeBeat(words, from, fps, 'end')}
							/>
						</SceneShell>
					</Sequence>
				);
			})}
			<Captions words={timeline.words} hiddenSegments={[OUTRO]} outline />
			<Watermark />
			{timeline.audio ? <Audio src={staticFile(timeline.audio)} /> : null}
			{debug ? <SafeZones /> : null}
		</AbsoluteFill>
	);
};

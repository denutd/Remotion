import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, Sfx, VideoBackground} from '../ui';

export const Hook: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const cardFrame = Math.max(15, beat('lecet'));

	return (
		<AbsoluteFill>
			{/* Footage video garukan */}
			<VideoBackground
				assetName="Man_scratching_itchy_ankle_1dd97f93.mp4"
				startFrom={0}
				playbackRate={1}
				overlayOpacity={0.42}
			/>

			{/* Audio SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="whoosh.wav" volume={0.3} />
			</Sequence>
			<Sequence from={cardFrame} durationInFrames={40}>
				<Sfx src="thud.wav" volume={0.4} />
			</Sequence>

			{/* Badge Top */}
			<EditorialBadge
				tag="⚠️ JANGAN DIANGGAP SEPELE"
				headline="Eksim Sampai Lecet & Terbuka?"
				accentColor="#f87171"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="🚨"
				title="BAHAYA GARUKAN EKSTREM"
				body="Garukan kencang merobek kulit dan membuka jalan bagi kuman berbahaya!"
				accentColor="#f87171"
				bottom={250}
				delay={cardFrame}
			/>
		</AbsoluteFill>
	);
};

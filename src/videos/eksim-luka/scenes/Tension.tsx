import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, Sfx, VideoBackground} from '../ui';

export const Tension: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const cardFrame = Math.max(12, beat('merusak'));

	return (
		<AbsoluteFill>
			{/* Video footage 3D skin barrier breakdown */}
			<VideoBackground
				assetName="Human_skin_barrier_comparison_vi…_8c11e50f.mp4"
				startFrom={30}
				playbackRate={1}
				overlayOpacity={0.45}
			/>

			{/* SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="swish.wav" volume={0.3} />
			</Sequence>
			<Sequence from={cardFrame} durationInFrames={40}>
				<Sfx src="buzz.wav" volume={0.35} />
			</Sequence>

			{/* Badge Top */}
			<EditorialBadge
				tag="🔬 ANCAMAN INFEKSI KULIT"
				headline="Permukaan Kulit Robek & Rusak"
				accentColor="#fb923c"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="🦠"
				title="RISIKO INFEKSI TINGGI"
				body="Benteng alami kulit jebol, memicu peradangan bernanah dan infeksi meluas!"
				accentColor="#fb923c"
				bottom={250}
				delay={cardFrame}
			/>
		</AbsoluteFill>
	);
};

import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, HexShieldGrid, Sfx, VideoBackground} from '../ui';

export const Barrier: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const shieldFrame = Math.max(15, beat('kelembapan'));
	const cardFrame = Math.max(shieldFrame + 15, beat('skin barrier'));

	return (
		<AbsoluteFill>
			{/* Penampang lapisan skin barrier mikroskopis */}
			<VideoBackground
				assetName="Skin_cross-section_showing_weake…_096e8683.mp4"
				startFrom={0}
				playbackRate={1}
				overlayOpacity={0.42}
			/>

			{/* Motion Graphic: Hexagonal Shield Grid */}
			<HexShieldGrid delay={shieldFrame} />

			{/* SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="swish.wav" volume={0.3} />
			</Sequence>
			<Sequence from={shieldFrame} durationInFrames={30}>
				<Sfx src="pop.wav" volume={0.4} />
			</Sequence>
			<Sequence from={cardFrame} durationInFrames={50}>
				<Sfx src="chime-1.wav" volume={0.35} />
			</Sequence>

			{/* Editorial Badge */}
			<EditorialBadge
				tag="🛡️ BENTENG PERTAHANAN KULIT"
				headline="Kunci Utama: Rawat Skin Barrier"
				accentColor="#38bdf8"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="💧"
				title="JAGA KELEMBAPAN INTENSIF"
				body="Skin barrier yang kuat mengunci air di dalam dan menahan alergen luar agar tidak masuk!"
				accentColor="#38bdf8"
				bottom={250}
				delay={cardFrame}
			/>
		</AbsoluteFill>
	);
};

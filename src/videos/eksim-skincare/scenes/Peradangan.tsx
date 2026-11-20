import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, Sfx, VideoBackground} from '../ui';

export const Peradangan: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const cardFrame = Math.max(15, beat('peradangan'));

	return (
		<AbsoluteFill>
			{/* Animasi 3D peradangan dan pembengkakan sel kulit */}
			<VideoBackground
				assetName="3d_animation_atopik_dermatitis_e…_b00244b0.mp4"
				startFrom={15}
				playbackRate={1}
				overlayOpacity={0.45}
			/>

			{/* SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="whoosh.wav" volume={0.3} />
			</Sequence>
			<Sequence from={cardFrame} durationInFrames={40}>
				<Sfx src="buzz.wav" volume={0.35} />
			</Sequence>

			{/* Editorial Badge */}
			<EditorialBadge
				tag="🔬 PATOFISIOLOGI EKSIM"
				headline="Kondisi Peradangan Kulit Mendalam"
				accentColor="#ef4444"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="🔥"
				title="RADANG DI BAWAH KULIT"
				body="Butuh perawatan terarah sesuai tingkat keparahannya, jangan asal coba sembarang skincare!"
				accentColor="#ef4444"
				bottom={250}
				delay={cardFrame}
			/>
		</AbsoluteFill>
	);
};

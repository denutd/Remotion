import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, PhotoKenBurns, ScannerHUD, Sfx, VideoBackground} from '../ui';

export const Hook: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const cardFrame = Math.max(15, beat('kulit'));

	return (
		<AbsoluteFill>
			{/* Part 1: Rak produk skincare yang banyak */}
			<Sequence from={0} durationInFrames={cardFrame}>
				<PhotoKenBurns
					assetName="Skincare_items_on_bathroom_counter_8e949899.jpg"
					overlayOpacity={0.45}
					direction="zoom-in"
				/>
			</Sequence>

			{/* Part 2: Garukan kulit pergelangan tangan */}
			<Sequence from={cardFrame}>
				<VideoBackground
					assetName="Woman_scratching_wrist_with_eczema_3be3e590.mp4"
					startFrom={0}
					playbackRate={1}
					overlayOpacity={0.42}
				/>
			</Sequence>

			{/* Motion Graphic: Scanner HUD */}
			<ScannerHUD delay={10} />

			{/* Audio SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="whoosh.wav" volume={0.3} />
			</Sequence>
			<Sequence from={cardFrame} durationInFrames={40}>
				<Sfx src="thud.wav" volume={0.4} />
			</Sequence>

			{/* Editorial Badge */}
			<EditorialBadge
				tag="🔍 BINGUNG MEMILIH SKINCARE?"
				headline="Sudah Ganti Skincare, Kulit Masih Gatal & Merah?"
				accentColor="#f59e0b"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="🧴"
				title="SKINCARE TIDAK COCOK?"
				body="Kulit tetap gatal, merah, dan mengelupas meski sudah bolak-balik coba produk!"
				accentColor="#f59e0b"
				bottom={250}
				delay={cardFrame}
			/>
		</AbsoluteFill>
	);
};

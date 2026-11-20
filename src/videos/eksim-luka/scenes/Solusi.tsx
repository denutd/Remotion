import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, Sfx, VideoBackground} from '../ui';

export const Solusi: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const productFrame = Math.max(25, beat('mengenal'));

	return (
		<AbsoluteFill>
			{/* Part 1: Aplikasi serum ke kulit */}
			<Sequence from={0} durationInFrames={productFrame}>
				<VideoBackground
					assetName="Applying_serum_to_eczema_wound_afe9f176.mp4"
					startFrom={0}
					playbackRate={1}
					overlayOpacity={0.42}
				/>
			</Sequence>

			{/* Part 2: Showcase Produk Noekoella */}
			<Sequence from={productFrame}>
				<VideoBackground
					assetName="Professional_product_showcase_wi…_8424247b.mp4"
					startFrom={0}
					playbackRate={1}
					overlayOpacity={0.42}
				/>
			</Sequence>

			{/* SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="whoosh.wav" volume={0.3} />
			</Sequence>
			<Sequence from={15} durationInFrames={30}>
				<Sfx src="drip.wav" volume={0.4} />
			</Sequence>
			<Sequence from={productFrame} durationInFrames={50}>
				<Sfx src="chime-3.wav" volume={0.35} />
			</Sequence>

			{/* Badge Top */}
			<EditorialBadge
				tag="🌿 PERAWATAN KELEMBAPAN"
				headline="Noekoella Skin Barrier"
				accentColor="#38bdf8"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="💧"
				title="RAWAT SKIN BARRIER"
				body="Menjaga kelembapan intensif & merawat lapisan pertahanan kulit yang rentan."
				accentColor="#38bdf8"
				bottom={250}
				delay={productFrame}
			/>
		</AbsoluteFill>
	);
};

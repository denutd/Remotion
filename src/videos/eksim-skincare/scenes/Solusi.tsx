import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, Sfx, VideoBackground} from '../ui';

export const Solusi: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const productFrame = Math.max(15, beat('Noekoella'));

	return (
		<AbsoluteFill>
			{/* Part 1: Showcase Produk Noekoella */}
			<Sequence from={0} durationInFrames={productFrame + 25}>
				<VideoBackground
					assetName="Professional_product_showcase_wi…_8424247b.mp4"
					startFrom={0}
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* Part 2: Aplikasi serum ke kulit eksim */}
			<Sequence from={productFrame + 25}>
				<VideoBackground
					assetName="Applying_serum_to_eczema_wound_afe9f176.mp4"
					startFrom={0}
					playbackRate={1}
					overlayOpacity={0.42}
				/>
			</Sequence>

			{/* SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="whoosh.wav" volume={0.3} />
			</Sequence>
			<Sequence from={productFrame} durationInFrames={50}>
				<Sfx src="chime-3.wav" volume={0.4} />
			</Sequence>
			<Sequence from={productFrame + 25} durationInFrames={30}>
				<Sfx src="drip.wav" volume={0.4} />
			</Sequence>

			{/* Editorial Badge */}
			<EditorialBadge
				tag="🌿 PERAWATAN TERBAIK"
				headline="Noekoella Skin Barrier"
				accentColor="#4ade80"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="✨"
				title="FORMULASI KHUSUS EKSIM"
				body="Dirancang untuk menenangkan kulit reaktif, mengunci hidrasi, & memperbaiki skin barrier."
				accentColor="#4ade80"
				bottom={250}
				delay={productFrame}
			/>
		</AbsoluteFill>
	);
};

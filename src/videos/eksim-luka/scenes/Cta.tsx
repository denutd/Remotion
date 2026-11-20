import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, Sfx, VideoBackground} from '../ui';

export const Cta: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const ctaFrame = Math.max(20, beat('Cek'));

	return (
		<AbsoluteFill>
			{/* Part 1: Model tersenyum memegang produk */}
			<Sequence from={0} durationInFrames={ctaFrame}>
				<VideoBackground
					assetName="Indonesian_man_holding_product_s…_37877a42.mp4"
					startFrom={0}
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* Part 2: Animasi Ending Ads */}
			<Sequence from={ctaFrame}>
				<VideoBackground
					assetName="ending_ads_9a387b95.mp4"
					startFrom={0}
					playbackRate={1}
					overlayOpacity={0.35}
				/>
			</Sequence>

			{/* SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="whoosh.wav" volume={0.3} />
			</Sequence>
			<Sequence from={ctaFrame} durationInFrames={50}>
				<Sfx src="chime-1.wav" volume={0.4} />
			</Sequence>

			{/* Badge Top */}
			<EditorialBadge
				tag="✨ KEMBALIKAN KENYAMANAN"
				headline="Rawat Kulitmu Dengan Tepat"
				accentColor="#4ade80"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="🛒"
				title="CEK PRODUK SEKARANG"
				body="Jangan tunggu kulit makin parah. Dapatkan Noekoella Skin Barrier sekarang!"
				accentColor="#4ade80"
				bottom={250}
				delay={ctaFrame}
			/>
		</AbsoluteFill>
	);
};

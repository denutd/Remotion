import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, KeranjangKuningWidget, Sfx, VideoBackground} from '../ui';

export const Cta: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const cartFrame = Math.max(12, beat('keranjang'));

	return (
		<AbsoluteFill>
			{/* Footage model wanita tersenyum memegang produk */}
			<VideoBackground
				assetName="Hijab_woman_holding_product_smiling_6763af1d.mp4"
				startFrom={0}
				playbackRate={1}
				overlayOpacity={0.38}
			/>

			{/* SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="whoosh.wav" volume={0.3} />
			</Sequence>
			<Sequence from={cartFrame} durationInFrames={50}>
				<Sfx src="chime-2.wav" volume={0.45} />
			</Sequence>

			{/* Editorial Badge */}
			<EditorialBadge
				tag="⚡ PROMO SPESIAL HARI INI"
				headline="Dapatkan Noekoella Sekarang"
				accentColor="#eab308"
				delay={5}
			/>

			{/* Motion Graphic: Keranjang Kuning Widget */}
			<KeranjangKuningWidget delay={cartFrame} />
		</AbsoluteFill>
	);
};

import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, PhotoKenBurns, Sfx} from '../ui';

export const Medis: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const cardFrame = Math.max(15, beat('bernanah'));

	return (
		<AbsoluteFill>
			{/* Dokter memeriksa kulit */}
			<PhotoKenBurns
				assetName="Dermatologist_examining_forearm_…_cba297eb.jpg"
				overlayOpacity={0.48}
				direction="zoom-in"
			/>

			{/* SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="whoosh.wav" volume={0.3} />
			</Sequence>
			<Sequence from={cardFrame} durationInFrames={30}>
				<Sfx src="pop.wav" volume={0.4} />
			</Sequence>

			{/* Badge Top */}
			<EditorialBadge
				tag="👨‍⚕️ KONSULTASI MEDIS"
				headline="Kapan Harus Segera ke Dokter?"
				accentColor="#ef4444"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="🏥"
				title="TANDA BAHAYA EKSIM"
				body="Jika eksim luka, bernanah, atau sangat nyeri, wajib periksakan ke dokter medis!"
				accentColor="#ef4444"
				bottom={250}
				delay={cardFrame}
			/>
		</AbsoluteFill>
	);
};

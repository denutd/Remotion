import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EditorialBadge, FloatingCard, PhotoKenBurns, Sfx} from '../ui';

export const Edukasi: FC<{beat: (w: string, nth?: number) => number}> = ({beat}) => {
	const cardFrame = Math.max(12, beat('bukan'));

	return (
		<AbsoluteFill>
			{/* Perbandingan kulit kering vs eksim */}
			<PhotoKenBurns
				assetName="Comparing_dry_skin_and_eczema_7d30496b.jpg"
				overlayOpacity={0.46}
				direction="zoom-in"
			/>

			{/* Audio SFX */}
			<Sequence from={0} durationInFrames={30}>
				<Sfx src="swish.wav" volume={0.3} />
			</Sequence>
			<Sequence from={cardFrame} durationInFrames={35}>
				<Sfx src="pop.wav" volume={0.4} />
			</Sequence>

			{/* Editorial Badge */}
			<EditorialBadge
				tag="💡 FAKTA PENTING MEDIS"
				headline="Eksim Bukan Masalah Kosmetik!"
				accentColor="#38bdf8"
				delay={5}
			/>

			{/* Floating Callout Card */}
			<FloatingCard
				icon="⚠️"
				title="BUKAN HANYA KULIT KERING"
				body="Eksim melibatkan peradangan imun di bawah permukaan kulit, bukan sekadar riasan luar."
				accentColor="#38bdf8"
				bottom={250}
				delay={cardFrame}
			/>
		</AbsoluteFill>
	);
};

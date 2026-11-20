import type {FC} from 'react';
import {AbsoluteFill} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {EditorialBadge, FloatingCard, PhotoKenBurns} from './ui';

export const EksimLukaCover: FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0a0d14', fontFamily}}>
			{/* Foto dramatis dokter memeriksa kulit eksim */}
			<PhotoKenBurns
				assetName="Dermatologist_examining_forearm_…_cba297eb.jpg"
				overlayOpacity={0.45}
				direction="zoom-in"
			/>

			{/* Badge Headline Kuat */}
			<EditorialBadge
				tag="⚠️ JANGAN DIANGGAP SEPELE"
				headline="Eksim Sampai Luka & Lecet?"
				accentColor="#f87171"
				animated={false}
			/>

			{/* Floating Callout Card Prominen */}
			<FloatingCard
				icon="🚨"
				title="BAHAYA INFEKSI KULIT"
				body="Garukan berulang merusak kulit! Jangan tunggu sampai infeksi makin parah."
				accentColor="#f87171"
				bottom={260}
				animated={false}
			/>
		</AbsoluteFill>
	);
};

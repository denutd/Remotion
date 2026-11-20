import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {SceneProps} from '../../../lib/beats';
import {EditorialBadge, FloatingCard, VideoBackground} from '../ui';

export const Solusi: FC<SceneProps> = ({dur, beat}) => {
	const splitFrame = 180;

	return (
		<AbsoluteFill>
			{/* Part 1: Showcase Botol Noekoella Barrier Care Serum */}
			<Sequence from={0} durationInFrames={splitFrame}>
				<VideoBackground
					assetName="Professional_product_showcase_wi…_8424247b.mp4"
					playbackRate={1}
					overlayOpacity={0.35}
				/>
			</Sequence>

			{/* Part 2: Pengolesan Serum Lembut Meresap */}
			<Sequence from={splitFrame} durationInFrames={dur - splitFrame}>
				<VideoBackground
					assetName="Applying_serum_to_eczema_wound_afe9f176.mp4"
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* Header */}
			<EditorialBadge
				tag="🌿 Solusi Utama"
				headline="Noekoella Skin Barrier: Tambal Lapisan Pelindung Kulit"
				accentColor="#10b981"
				delay={0}
			/>

			{/* Benefit Card */}
			<FloatingCard
				delay={beat('ceramide')}
				top={520}
				borderColor="#10b981"
			>
				<div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<span style={{fontSize: 34}}>🛡️</span>
						<span style={{color: '#34d399', fontSize: 32, fontWeight: 700}}>
							Ceramide Complex: Perkuat Skin Barrier
						</span>
					</div>
					<div
						style={{
							height: 1.5,
							backgroundColor: 'rgba(255,255,255,0.15)',
							width: '100%',
						}}
					/>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<span style={{fontSize: 34}}>💧</span>
						<span style={{color: '#ffffff', fontSize: 32, fontWeight: 700}}>
							Mengunci Kelembapan & Hidrasi Mendalam
						</span>
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

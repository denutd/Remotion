import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {SceneProps} from '../../../lib/beats';
import {EditorialBadge, FloatingCard, VideoBackground} from '../ui';

export const Solution: FC<SceneProps> = ({dur, beat}) => {
	const splitFrame = 110;

	return (
		<AbsoluteFill>
			{/* Part 1: Hero Showcase Noekoella Skin Barrier */}
			<Sequence from={0} durationInFrames={splitFrame}>
				<VideoBackground
					assetName="Professional_product_showcase_wi…_8424247b.mp4"
					playbackRate={1}
					overlayOpacity={0.35}
				/>
			</Sequence>

			{/* Part 2: Pengolesan Lembut ke Kulit */}
			<Sequence from={splitFrame} durationInFrames={dur - splitFrame}>
				<VideoBackground
					assetName="Applying_serum_to_eczema_wound_af06d3e0.mp4"
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* Brand & Benefit Header */}
			<EditorialBadge
				tag="🌿 Solusi Tepat Sawar Kulit"
				headline="Noekoella Skin Barrier: Formula Khusus Mengunci Kelembapan"
				accentColor="#10b981"
				delay={0}
			/>

			{/* Benefit Card */}
			<FloatingCard
				delay={beat('perawatan')}
				top={520}
				borderColor="#10b981"
			>
				<div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<span style={{fontSize: 34}}>💧</span>
						<span style={{color: '#ffffff', fontSize: 32, fontWeight: 700}}>
							Mengunci Hidrasi & Meredakan Rasa Kering
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
						<span style={{fontSize: 34}}>🛡️</span>
						<span style={{color: '#34d399', fontSize: 32, fontWeight: 700}}>
							Mendukung Perbaikan Alami Skin Barrier
						</span>
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

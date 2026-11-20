import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {SceneProps} from '../../../lib/beats';
import {EditorialBadge, FloatingCard, VideoBackground} from '../ui';

export const Sains: FC<SceneProps> = ({dur, beat}) => {
	const splitFrame = 150;

	return (
		<AbsoluteFill>
			{/* Part 1: Visualisasi 3D Dinding Bata Sel Kulit */}
			<Sequence from={0} durationInFrames={splitFrame}>
				<VideoBackground
					assetName="Human_skin_barrier_comparison_vi…_8c11e50f.mp4"
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* Part 2: Animasi Kuman Masuk & Air Menguap */}
			<Sequence from={splitFrame} durationInFrames={dur - splitFrame}>
				<VideoBackground
					assetName="3d_animation_atopik_dermatitis_e…_b00244b0.mp4"
					playbackRate={1}
					overlayOpacity={0.45}
				/>
			</Sequence>

			{/* Header */}
			<EditorialBadge
				tag="🧱 Model Dinding Bata"
				headline="Semen Lipid Hilang: Air Menguap & Kuman Mudah Menyerang"
				accentColor="#38bdf8"
				delay={0}
			/>

			{/* Callout Poin Kunci */}
			<FloatingCard
				delay={beat('dinding')}
				top={520}
				borderColor="#38bdf8"
			>
				<div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<span style={{fontSize: 34}}>💧</span>
						<span style={{color: '#ffffff', fontSize: 32, fontWeight: 700}}>
							Air Menguap Cepat: Kulit Kering & Rapuh
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
						<span style={{fontSize: 34}}>🛑</span>
						<span style={{color: '#f87171', fontSize: 32, fontWeight: 700}}>
							Kuman Masuk: Memicu Gatal Kambuh Lagi
						</span>
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

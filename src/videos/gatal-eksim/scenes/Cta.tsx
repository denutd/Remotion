import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {SceneProps} from '../../../lib/beats';
import {EditorialBadge, FloatingCard, VideoBackground} from '../ui';

export const Cta: FC<SceneProps> = ({dur, beat}) => {
	const splitFrame = 80;

	return (
		<AbsoluteFill>
			{/* Part 1: Model tersenyum puas bersama produk */}
			<Sequence from={0} durationInFrames={splitFrame}>
				<VideoBackground
					assetName="Hijab_woman_holding_product_smiling_6763af1d.mp4"
					playbackRate={1}
					overlayOpacity={0.35}
				/>
			</Sequence>

			{/* Part 2: Product Ending Showcase */}
			<Sequence from={splitFrame} durationInFrames={dur - splitFrame}>
				<VideoBackground
					assetName="_animationproduct_cf81dc29.mp4"
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* CTA Header */}
			<EditorialBadge
				tag="✨ Rawat Kulitmu Sekarang"
				headline="Kembalikan Rasa Nyaman & Kelembapan Alami Kulitmu"
				accentColor="#f59e0b"
				delay={0}
			/>

			{/* Clean High-Converting Action Card */}
			<FloatingCard
				delay={beat('sekarang')}
				top={520}
				borderColor="#f59e0b"
			>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10}}>
					<div
						style={{
							backgroundColor: '#f59e0b',
							color: '#0f172a',
							fontWeight: 800,
							fontSize: 26,
							padding: '14px 36px',
							borderRadius: 40,
							boxShadow: '0 6px 24px rgba(245, 158, 11, 0.45)',
							letterSpacing: 0.5,
						}}
					>
						Coba Noekoella Skin Barrier
					</div>
					<div style={{color: '#e2e8f0', fontSize: 20, fontWeight: 500, marginTop: 4}}>
						Jangan tunggu kulit semakin kering & teriritasi!
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

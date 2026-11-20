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
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14}}>
					<div
						style={{
							backgroundColor: '#f59e0b',
							color: '#0f172a',
							fontWeight: 900,
							fontSize: 34,
							padding: '18px 46px',
							borderRadius: 50,
							boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)',
							letterSpacing: 0.5,
						}}
					>
						Coba Noekoella Skin Barrier
					</div>
					<div style={{color: '#f8fafc', fontSize: 26, fontWeight: 600, marginTop: 4}}>
						Jangan tunggu kulit semakin kering & teriritasi!
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

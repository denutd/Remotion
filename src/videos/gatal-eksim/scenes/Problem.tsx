import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {SceneProps} from '../../../lib/beats';
import {EditorialBadge, FloatingCard, VideoBackground} from '../ui';

export const Problem: FC<SceneProps> = ({dur, beat}) => {
	const splitFrame = 120; // ~4 detik

	return (
		<AbsoluteFill>
			{/* Part 1: Visual comparison skin barrier rusak vs normal */}
			<Sequence from={0} durationInFrames={splitFrame}>
				<VideoBackground
					assetName="Human_skin_barrier_comparison_vi…_8c11e50f.mp4"
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* Part 2: Video model cewek menggaruk kulit eksim */}
			<Sequence from={splitFrame} durationInFrames={dur - splitFrame}>
				<VideoBackground
					assetName="Woman_scratching_itchy_ankle_1f9ac36c.mp4"
					playbackRate={1}
					overlayOpacity={0.45}
				/>
			</Sequence>

			{/* Editorial Badge */}
			<EditorialBadge
				tag="Kondisi Sensitif"
				headline="Kulit Kering, Gatal, & Rentan Eksim Butuh Perawatan Khusus"
				accentColor="#38bdf8"
				delay={0}
			/>

			{/* Alert Card ketika kata 'skincare' muncul */}
			<FloatingCard
				delay={beat('skincare')}
				top={520}
				borderColor="#38bdf8"
			>
				<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						<span style={{fontSize: 34}}>🛑</span>
						<span style={{color: '#f59e0b', fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2}}>
							Hindari Kesalahan Fatal:
						</span>
					</div>
					<div style={{color: '#ffffff', fontSize: 32, fontWeight: 600, lineHeight: 1.35}}>
						Jangan pakai skincare beralkohol, pewangi keras, atau scrub yang mengikis lapisan pelindung kulit!
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

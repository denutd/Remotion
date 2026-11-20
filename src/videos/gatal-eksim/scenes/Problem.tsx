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
				<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<span style={{color: '#f59e0b', fontSize: 26}}>🛑</span>
						<span style={{color: '#f8fafc', fontSize: 22, fontWeight: 800, textTransform: 'uppercase'}}>
							Hindari Kesalahan Fatal:
						</span>
					</div>
					<div style={{color: '#cbd5e1', fontSize: 21, fontWeight: 500, lineHeight: 1.4}}>
						Jangan pakai produk berkandungan alkohol tinggi, pewangi menyengat, atau scrub kasar yang mengikis lapisan pelindung kulit.
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

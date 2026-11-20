import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {SceneProps} from '../../../lib/beats';
import {EditorialBadge, FloatingCard, VideoBackground} from '../ui';

export const Hook: FC<SceneProps> = ({dur, beat}) => {
	const splitFrame = 110; // ~3.6 detik switch ke visual skin cross section

	return (
		<AbsoluteFill>
			{/* Bagian 1: Video Menggaruk Eksim Intens (Real footage) */}
			<Sequence from={0} durationInFrames={splitFrame}>
				<VideoBackground
					assetName="Menggaruk_pergelengan_kaki_eksim_6d05f8b3.mp4"
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* Bagian 2: Video 3D Cross-section Skin Barrier Melemah */}
			<Sequence from={splitFrame} durationInFrames={dur - splitFrame}>
				<VideoBackground
					assetName="Skin_cross-section_showing_weake…_096e8683.mp4"
					startFrom={30}
					playbackRate={1}
					overlayOpacity={0.45}
				/>
			</Sequence>

			{/* Header Hook */}
			<EditorialBadge
				tag="⚠️ Siklus Gatal-Garuk"
				headline="Makin digaruk makin enak? Justru bikin kulit makin iritasi!"
				accentColor="#f59e0b"
				delay={0}
			/>

			{/* Callout Warning ketika kata 'hati-hati' terucap */}
			<FloatingCard
				delay={beat('hati-hati')}
				top={520}
				borderColor="#ef4444"
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<div
						style={{
							fontSize: 38,
							padding: '12px 16px',
							borderRadius: 16,
							backgroundColor: 'rgba(239, 68, 68, 0.2)',
							border: '1px solid #ef4444',
						}}
					>
						🚨
					</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
						<span style={{color: '#f87171', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1}}>
							Bahaya Garukan Berulang
						</span>
						<span style={{color: '#f8fafc', fontSize: 24, fontWeight: 600, lineHeight: 1.3}}>
							Sawar kulit robek, memicu infeksi dan alarm radang lebih parah!
						</span>
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

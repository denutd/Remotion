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
				<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
					<div
						style={{
							fontSize: 48,
							padding: '16px 20px',
							borderRadius: 20,
							backgroundColor: 'rgba(239, 68, 68, 0.25)',
							border: '2px solid #ef4444',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
						}}
					>
						🚨
					</div>
					<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
						<span style={{color: '#f87171', fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5}}>
							Bahaya Garukan Berulang
						</span>
						<span style={{color: '#ffffff', fontSize: 34, fontWeight: 700, lineHeight: 1.3}}>
							Sawar kulit robek, memicu infeksi dan alarm radang lebih parah!
						</span>
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

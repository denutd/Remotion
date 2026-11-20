import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {SceneProps} from '../../../lib/beats';
import {EditorialBadge, FloatingCard, PhotoKenBurns, VideoBackground} from '../ui';

export const Tension: FC<SceneProps> = ({dur, beat}) => {
	const splitFrame = 140;

	return (
		<AbsoluteFill>
			{/* Part 1: Video 3D Cross-section Lapisan Pelindung Rusak */}
			<Sequence from={0} durationInFrames={splitFrame}>
				<VideoBackground
					assetName="Skin_cross-section_showing_weake…_096e8683.mp4"
					startFrom={20}
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			{/* Part 2: Perbandingan Nyata Kulit Eksim */}
			<Sequence from={splitFrame} durationInFrames={dur - splitFrame}>
				<PhotoKenBurns
					assetName="Comparing_dry_skin_and_eczema_7d30496b.jpg"
					overlayOpacity={0.45}
					direction="zoom-in"
				/>
			</Sequence>

			{/* Header */}
			<EditorialBadge
				tag="⚠️ Mitos Pengobatan"
				headline="Obat Cuma Meredakan Radang, Tapi Tidak Menambal Pelindung Kulit!"
				accentColor="#f87171"
				delay={0}
			/>

			{/* Callout Alert */}
			<FloatingCard
				delay={beat('obat')}
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
							Salah Kaprah Umum
						</span>
						<span style={{color: '#ffffff', fontSize: 34, fontWeight: 700, lineHeight: 1.3}}>
							Salep meredakan merah sesaat, tapi tidak menambal pelindung yang jebol!
						</span>
					</div>
				</div>
			</FloatingCard>
		</AbsoluteFill>
	);
};

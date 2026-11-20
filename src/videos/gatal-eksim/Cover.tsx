import type {FC} from 'react';
import {AbsoluteFill} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {colors} from '../../brand/theme';
import {Watermark} from '../../components/Watermark';
import {EditorialBadge, FloatingCard, PhotoKenBurns} from './ui';

export const GatalEksimCover: FC = () => (
	<AbsoluteFill style={{fontFamily, color: colors.ink}}>
		<PhotoKenBurns assetName="_ugcproduct_a766f19a.jpg" overlayOpacity={0.4} />
		<EditorialBadge
			tag="⚠️ Eksim & Skin Barrier"
			headline="Awalnya Cuma Gatal Sedikit, Sekali Digaruk Malah Susah Berhenti!"
			accentColor="#f59e0b"
			animated={false}
		/>
		<FloatingCard bottom={380} borderColor="#10b981" animated={false}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8}}>
				<span style={{color: '#10b981', fontSize: 22, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5}}>
					Solusi Sawar Kulit
				</span>
				<span style={{color: '#ffffff', fontSize: 30, fontWeight: 800}}>
					Noekoella Skin Barrier Care
				</span>
				<span style={{color: '#94a3b8', fontSize: 20, fontWeight: 500}}>
					Mengunci Kelembapan & Meredakan Rasa Gatal
				</span>
			</div>
		</FloatingCard>
		<Watermark />
	</AbsoluteFill>
);

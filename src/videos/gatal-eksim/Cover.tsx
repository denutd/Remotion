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
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10}}>
				<span style={{color: '#10b981', fontSize: 26, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5}}>
					Solusi Sawar Kulit
				</span>
				<span style={{color: '#ffffff', fontSize: 38, fontWeight: 900}}>
					Noekoella Skin Barrier Care
				</span>
				<span style={{color: '#cbd5e1', fontSize: 26, fontWeight: 600}}>
					Mengunci Kelembapan & Meredakan Rasa Gatal
				</span>
			</div>
		</FloatingCard>
		<Watermark />
	</AbsoluteFill>
);

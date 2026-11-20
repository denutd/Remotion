import type {FC} from 'react';
import {AbsoluteFill} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {EditorialBadge, KeranjangKuningWidget, PhotoKenBurns} from './ui';

export const EksimSkincareCover: FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0a0d14', fontFamily}}>
			{/* Perbandingan kulit eksim & skincare */}
			<PhotoKenBurns
				assetName="Comparing_dry_skin_and_eczema_7d30496b.jpg"
				overlayOpacity={0.45}
				direction="zoom-in"
			/>

			{/* Badge Headline Kuat */}
			<EditorialBadge
				tag="🔍 BINGUNG PILIH SKINCARE?"
				headline="Sudah Ganti Skincare, Eksim Masih Kambuh?"
				accentColor="#f59e0b"
				animated={false}
			/>

			{/* Widget Keranjang Kuning Prominen */}
			<KeranjangKuningWidget animated={false} />
		</AbsoluteFill>
	);
};

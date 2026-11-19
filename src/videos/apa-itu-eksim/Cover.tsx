import type {FC} from 'react';
import {AbsoluteFill} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {colors} from '../../brand/theme';
import {Watermark} from '../../components/Watermark';
import {Foto, HookTitle, P_HOOK} from './ui';

export const ApaItuEksimCover: FC = () => (
	<AbsoluteFill style={{fontFamily, color: colors.ink}}>
		<Foto photo={P_HOOK} zoom={1.02} focus={[0.5, 0.45]} dim={0.2} scrim={0.8} />
		<HookTitle y={250} sorotMenular={1} sorotEksim={1} sampul />
		<Watermark />
	</AbsoluteFill>
);

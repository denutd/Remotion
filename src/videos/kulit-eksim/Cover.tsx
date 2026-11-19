import type {FC} from 'react';
import {AbsoluteFill} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {colors} from '../../brand/theme';
import {Watermark} from '../../components/Watermark';
import {Kanvas, LatarDiagram} from '../../kit/Editorial';
import {HookTitle, SkinBarrierDiagram} from './ui';

// Sampul video (Still `KulitEksimCover`): susunan bersih untuk thumbnail feed / Shorts.
export const KulitEksimCover: FC = () => (
	<AbsoluteFill style={{fontFamily, color: colors.ink}}>
		<LatarDiagram frame={24} id="cover" />
		<Kanvas>
			<SkinBarrierDiagram cx={540} cy={1140} status="kering_retak" frame={24} p={1} />
		</Kanvas>
		<HookTitle y={250} sorotKambuh={1} sorotMulus={1} sampul />
		<Watermark />
	</AbsoluteFill>
);

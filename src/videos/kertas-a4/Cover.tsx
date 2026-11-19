import type {FC} from 'react';
import {AbsoluteFill} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {colors} from '../../brand/theme';
import {Watermark} from '../../components/Watermark';
import {Kanvas, LatarDiagram} from '../../kit/Editorial';
import {HookTitle, LembarA4} from './ui';

// Sampul video (Still `KertasA4Cover`): susunan bersih untuk thumbnail feed / Shorts.
export const KertasA4Cover: FC = () => (
	<AbsoluteFill style={{fontFamily, color: colors.ink}}>
		<LatarDiagram frame={24} id="cover" />
		<Kanvas>
			<LembarA4 cx={460} cy={1120} w={320} h={453} p={1} frame={24} lipat={1} />
		</Kanvas>
		<HookTitle y={252} sorot210={1} sorot297={1} sampul />
		<Watermark />
	</AbsoluteFill>
);

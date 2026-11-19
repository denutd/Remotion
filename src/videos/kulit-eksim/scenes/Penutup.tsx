import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {Kanvas, LatarDiagram} from '../../../kit/Editorial';
import {EndCard} from '../../../kit/EndCard';
import type {SceneProps} from '../../../lib/beats';
import {SkinBarrierDiagram} from '../ui';

const SUMBER_RINGKAS = [
	'Elias PM (J Invest Dermatol, 1983)',
	'Palmer CN, et al. (Nature Genetics, 2006)',
	'Sidbury R, et al. (JAAD Guidelines, 2023)',
];

export const Penutup: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	return (
		<>
			<LatarDiagram frame={frame} id="penutup" />
			<Kanvas opacity={0.16}>
				<SkinBarrierDiagram cx={540} cy={950} status="proaktif" frame={frame} p={1} />
			</Kanvas>
			<EndCard
				beat={beat}
				y={750}
				sources={SUMBER_RINGKAS}
				credit="Konsep diagram ilmiah berdasar Brick-and-Mortar Model Elias (1983)"
			/>
		</>
	);
};

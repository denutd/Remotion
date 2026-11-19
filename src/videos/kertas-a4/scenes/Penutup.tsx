import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {Kanvas, LatarDiagram} from '../../../kit/Editorial';
import {EndCard} from '../../../kit/EndCard';
import type {SceneProps} from '../../../lib/beats';
import {LembarA4} from '../ui';

const SUMBER_RINGKAS = ['ISO 216:2007', 'DIN 476 (Walter Porstmann, 1922)', 'Lichtenberg (1786)'];

// Segmen 6 (Outro): kertas A4 tetap bergerak pelan di belakang EndCard (tanpa potong ke layar hitam).
export const Penutup: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	return (
		<>
			<LatarDiagram frame={frame} id="penutup" />
			<Kanvas opacity={0.14}>
				<LembarA4 cx={540} cy={880} w={360} h={509} p={1} frame={frame} lipat={1} />
			</Kanvas>
			<EndCard
				beat={beat}
				y={760}
				sources={SUMBER_RINGKAS}
				credit="Ilustrasi SVG & audio SFX dibuat 100% secara prosedural"
			/>
		</>
	);
};

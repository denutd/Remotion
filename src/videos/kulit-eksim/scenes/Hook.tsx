import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {Kanvas, LatarDiagram, ramp} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {HookTitle, SkinBarrierDiagram} from '../ui';

// Segmen 1 (Hook): Klaim utuh tampil di frame 0 agar penonton langsung paham dalam <= 1 detik.
export const Hook: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const bKambuh = beat('kambuh');
	const bMulus = beat('mulus?');

	const sKambuh = ramp(frame, bKambuh - 2, bKambuh + 10);
	const sMulus = ramp(frame, bMulus - 2, bMulus + 10);

	return (
		<>
			<LatarDiagram frame={frame} id="hook" />
			<HookTitle sorotKambuh={sKambuh} sorotMulus={sMulus} />
			<Kanvas>
				<SkinBarrierDiagram cx={540} cy={1020} status="sembuh_salep" frame={frame} p={1} />
			</Kanvas>
			<Sfx name="whoosh" at={0} />
			<Sfx name="tick" at={bKambuh} />
			<Sfx name="pop" at={bMulus} />
		</>
	);
};

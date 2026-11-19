import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {Kanvas, LatarDiagram, ramp} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {HookTitle, LembarA4} from '../ui';

// Segmen 1 (Hook): klaim utuh tampil sejak frame 0 agar penonton paham topik dalam <= 1 detik.
export const Hook: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const b210 = beat('210');
	const b297 = beat('297');

	const s210 = ramp(frame, b210 - 2, b210 + 10);
	const s297 = ramp(frame, b297 - 2, b297 + 10);

	return (
		<>
			<LatarDiagram frame={frame} id="hook" />
			<HookTitle sorot210={s210} sorot297={s297} />
			<Kanvas>
				<LembarA4 cx={460} cy={920} w={300} h={424} p={1} frame={frame} />
			</Kanvas>
			<Sfx name="tick" at={b210} />
			<Sfx name="tick" at={b297} />
		</>
	);
};

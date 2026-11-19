import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {ramp} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {Foto, HookTitle, P_HOOK} from '../ui';

export const Hook: FC<SceneProps> = ({dur, beat}) => {
	const frame = useCurrentFrame();

	const bMenular = beat('menular');
	const bEksim = beat('eksim?');

	const sMenular = ramp(frame, bMenular - 2, bMenular + 10);
	const sEksim = ramp(frame, bEksim - 2, bEksim + 10);

	const zoom = 1 + 0.05 * (frame / dur);

	return (
		<>
			<Foto photo={P_HOOK} zoom={zoom} focus={[0.5, 0.45]} dim={0.2} scrim={0.8} />
			<HookTitle sorotMenular={sMenular} sorotEksim={sEksim} />
			<Sfx name="whoosh" at={0} />
			<Sfx name="tick" at={bMenular} />
			<Sfx name="pop" at={bEksim} />
		</>
	);
};

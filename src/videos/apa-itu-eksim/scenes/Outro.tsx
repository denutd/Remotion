import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {EndCard} from '../../../kit/EndCard';
import type {SceneProps} from '../../../lib/beats';
import {Foto, P_OUTRO} from '../ui';

const SUMBER_RINGKAS = [
	'National Eczema Association (NEA)',
	'JAAD Guidelines of Care (2023)',
	'World Health Organization (WHO)',
];

export const Outro: FC<SceneProps> = ({dur, beat}) => {
	const frame = useCurrentFrame();
	const zoom = 1 + 0.04 * (frame / dur);

	return (
		<>
			<Foto photo={P_OUTRO} zoom={zoom} focus={[0.5, 0.5]} dim={0.5} scrim={0.9} />
			<EndCard
				beat={beat}
				y={750}
				sources={SUMBER_RINGKAS}
				credit="Visual: AI Generated + Unsplash License"
			/>
		</>
	);
};

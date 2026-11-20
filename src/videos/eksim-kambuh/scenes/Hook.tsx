import type {FC} from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {SceneProps} from '../../../lib/beats';
import {EditorialBadge, VideoBackground} from '../ui';

export const Hook: FC<SceneProps> = ({dur}) => {
	return (
		<AbsoluteFill>
			<Sequence from={0} durationInFrames={dur}>
				<VideoBackground
					assetName="Man_scratching_wrist_with_eczema_619e16fe.mp4"
					playbackRate={1}
					overlayOpacity={0.4}
				/>
			</Sequence>

			<EditorialBadge
				tag="❓ Pertanyaan Besar"
				headline="Sudah Oles Salep Sampai Habis, Tapi Kenapa Eksim Selalu Kambuh Lagi?"
				accentColor="#f59e0b"
				delay={0}
			/>
		</AbsoluteFill>
	);
};

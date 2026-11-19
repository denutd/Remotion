import type {FC} from 'react';
import {AbsoluteFill} from 'remotion';
import {fontFamily} from '../../brand/fonts';
import {colors} from '../../brand/theme';
import {Watermark} from '../../components/Watermark';
import {CameraRig} from '../../three/CameraRig';
import {PostFX} from '../../three/PostFX';
import {Stage} from '../../three/Stage';
import {StarField} from '../../three/StarField';
import {Streaks3D} from '../../three/Streaks3D';
import {Sun3D} from '../../three/Sun3D';
import {HookTitle3D} from './scenes3d/Hook3D';

// Sampul video 3D (`CahayaMatahariCover`): menggunakan Stage WebGL ANGLE.
export const CahayaMatahariCover: FC = () => (
	<AbsoluteFill style={{fontFamily, color: colors.ink, background: '#010206'}}>
		<Stage>
			<color attach="background" args={['#010206']} />
			<CameraRig position={[0.4, -1.3, 10.4]} lookAt={[0, 0.65, 0]} fov={38} />
			<StarField count={1800} opacity={0.85} />
			<Sun3D position={[0, -1.35, 0]} radius={2.75} time={40} intensity={1.8} glow={0.4} />
			<Streaks3D
				id="cover-photons"
				count={55}
				dir={[0.15, 0.2, 1]}
				center={[0, -0.4, 4]}
				spread={[2.5, 3.2]}
				span={10}
				speed={[0.14, 0.22]}
				length={[0.7, 1.4]}
				width={[0.008, 0.015]}
				color={[2.6, 1.4, 0.4]}
				headColor={[4.2, 3.0, 1.2]}
				time={45}
			/>
			<PostFX bloom={0.85} bloomThreshold={1.0} bloomRadius={0.75} grain={0.22} vignette={0.6} toneMapping="aces" />
		</Stage>
		<HookTitle3D sorot8={1} />
		<Watermark />
	</AbsoluteFill>
);

import type {FC} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {EndCard} from '../../../kit/EndCard';
import {mix, prog} from '../../../lib/anim';
import type {SceneProps} from '../../../lib/beats';
import {CameraRig} from '../../../three/CameraRig';
import {Planet3D} from '../../../three/Planet3D';
import {PostFX} from '../../../three/PostFX';
import {Stage} from '../../../three/Stage';
import {StarField} from '../../../three/StarField';
import type {Vec3} from '../../../three/Streaks3D';
import {Sun3D} from '../../../three/Sun3D';

const SUN_POS: Vec3 = [1.45, 2.35, 0];
const EARTH_POS: Vec3 = [0.95, -2.05, 0];
const SUN_DIR = new THREE.Vector3(...SUN_POS).sub(new THREE.Vector3(...EARTH_POS)).normalize();

const SUMBER_RINGKAS = ['IAU 2012 Resolution B2 (1 AU)', 'BIPM / SI (c = 299.792.458 m/s)'];

// Segmen 5 (Outro): kamera perlahan menjauh dari Bumi & Matahari, EndCard muncul di atas adegan 3D yang tetap hidup.
export const Penutup3D: FC<SceneProps> = ({dur, beat}) => {
	const frame = useCurrentFrame();
	const u = prog(frame, 0, dur, (t) => t);
	const camPos: Vec3 = [mix(u, -3.8, -5.6), mix(u, -0.9, -0.4), mix(u, 15.4, 18.2)];

	return (
		<AbsoluteFill style={{background: '#010206'}}>
			<Stage>
				<color attach="background" args={['#010206']} />
				<CameraRig position={camPos} lookAt={[0.2, -0.2, 0]} fov={35} />
				<StarField count={2000} opacity={0.75} />
				<Sun3D position={SUN_POS} radius={1.28} time={frame + 400} intensity={1.4} glow={0.28} />
				<Planet3D
					position={EARTH_POS}
					radius={0.96}
					sunDir={SUN_DIR.toArray() as Vec3}
					spin={3.0 + frame * 0.008}
					cloudShift={1.2 + frame * 0.003}
					sun={2.4}
				/>
				<PostFX bloom={0.7} bloomThreshold={1.05} bloomRadius={0.75} grain={0.22} vignette={0.62} toneMapping="aces" />
			</Stage>
			<EndCard
				beat={beat}
				y={780}
				sources={SUMBER_RINGKAS}
				credit="Visualisasi 3D prosedural Three.js + GLSL · tanpa tekstur eksternal"
			/>
		</AbsoluteFill>
	);
};

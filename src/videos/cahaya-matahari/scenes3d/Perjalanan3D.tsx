import type {FC} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {colors} from '../../../brand/theme';
import {MONO, OK, ramp, riseIn, SHADOW, SolidTag} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import {mix, prog} from '../../../lib/anim';
import type {SceneProps} from '../../../lib/beats';
import {CameraRig} from '../../../three/CameraRig';
import {camPath, projector, type CamKey} from '../../../three/camPath';
import {Planet3D} from '../../../three/Planet3D';
import {PostFX} from '../../../three/PostFX';
import {Stage} from '../../../three/Stage';
import {StarField} from '../../../three/StarField';
import {Streaks3D, type Vec3} from '../../../three/Streaks3D';
import {Sun3D} from '../../../three/Sun3D';
import {Trail} from '../../../three/Trail';

// Matahari digeser ke kanan atas, Bumi di kanan bawah -> ruang gelap kiri tetap bersih sepanjang orbit kamera.
const SUN_POS: Vec3 = [1.45, 2.35, 0];
const EARTH_POS: Vec3 = [0.95, -2.05, 0];
const SUN_V = new THREE.Vector3(...SUN_POS);
const EARTH_V = new THREE.Vector3(...EARTH_POS);
const SUN_DIR = SUN_V.clone().sub(EARTH_V).normalize();
const FLOW = SUN_DIR.clone().negate().toArray() as Vec3;
const MID = SUN_V.clone().lerp(EARTH_V, 0.5).toArray() as Vec3;

// Segmen 2-4 (Speed -> Distance -> Meaning): satu shot kamera 3D kontinu mengorbit sistem Matahari-Bumi.
export const Perjalanan3D: FC<SceneProps> = ({dur, beat}) => {
	const frame = useCurrentFrame();
	const b300 = beat('300');
	const b149 = beat('149,6');
	const b499 = beat('499');
	const b8 = beat('8');

	const keys: CamKey[] = [
		{f: 0, pos: [4.8, 0.8, 15.8], look: [0.2, 0.1, 0], fov: 36},
		{f: Math.round(dur * 0.48), pos: [0.8, -0.1, 16.5], look: [0.2, 0.0, 0], fov: 35},
		{f: dur, pos: [-3.8, -0.9, 15.4], look: [0.2, -0.2, 0], fov: 35},
	];
	const cam = camPath(frame, keys, 35);
	const project = projector(cam);
	const sunPt = project([SUN_POS[0], SUN_POS[1] - 1.45, SUN_POS[2]]);
	const earthPt = project([EARTH_POS[0], EARTH_POS[1] + 1.15, EARTH_POS[2]]);

	// Paket foton utama yang meluncur dari permukaan Matahari menuju Bumi.
	const travelT = prog(frame, b149, b499 + 12, (t) => t);
	const photonPos = SUN_V.clone().lerp(EARTH_V, mix(travelT, 0.25, 0.82)).toArray() as Vec3;

	const pSpeed = ramp(frame, 0, 12);
	const pDist = ramp(frame, b149 - 3, b149 + 10);
	const pTime = ramp(frame, b499 - 3, b8 + 14);

	return (
		<AbsoluteFill style={{background: '#010206'}}>
			<Stage>
				<color attach="background" args={['#010206']} />
				<CameraRig position={cam.pos} lookAt={cam.look} fov={cam.fov} />
				<StarField count={2200} opacity={0.85} />

				<Sun3D position={SUN_POS} radius={1.28} time={frame} intensity={1.65} glow={0.32} />
				<Planet3D
					position={EARTH_POS}
					radius={0.96}
					sunDir={SUN_DIR.toArray() as Vec3}
					spin={1.4 + frame * 0.008}
					cloudShift={frame * 0.003}
					sun={2.8}
				/>

				<Streaks3D
					id="sun-earth-photons"
					count={90}
					dir={FLOW}
					center={MID}
					spread={[0.55, 0.55]}
					span={3.6}
					speed={[0.11, 0.16]}
					length={[0.55, 0.95]}
					width={[0.007, 0.013]}
					color={[2.8, 1.7, 0.45]}
					headColor={[4.6, 3.6, 1.4]}
					stop={{center: EARTH_POS, radius: 0.99}}
					opacity={0.78}
				/>

				{travelT > 0 && travelT < 1 ? (
					<Trail
						head={[photonPos[0], photonPos[1], photonPos[2] + 0.2]}
						dir={FLOW}
						length={1.15}
						width={0.028}
						color={[3.4, 2.5, 0.7]}
						headColor={[6.0, 5.5, 3.0]}
						opacity={Math.min(1, travelT * 5) * (1 - prog(travelT, 0.88, 1))}
					/>
				) : null}

				<PostFX bloom={0.75} bloomThreshold={1.05} bloomRadius={0.75} grain={0.22} vignette={0.58} toneMapping="aces" />
			</Stage>

			{sunPt.visible ? (
				<div
					style={{
						position: 'absolute',
						left: sunPt.x,
						top: sunPt.y,
						transform: 'translate(-50%, 0)',
						fontFamily: MONO,
						fontSize: 24,
						fontWeight: 700,
						color: colors.sun,
						textShadow: SHADOW,
						pointerEvents: 'none',
					}}
				>
					MATAHARI · t = 0 dtk
				</div>
			) : null}

			{earthPt.visible ? (
				<div
					style={{
						position: 'absolute',
						left: earthPt.x,
						top: earthPt.y,
						transform: 'translate(-50%, -100%)',
						fontFamily: MONO,
						fontSize: 24,
						fontWeight: 700,
						color: colors.neutrino,
						textShadow: SHADOW,
						pointerEvents: 'none',
					}}
				>
					BUMI · 1 AU
				</div>
			) : null}

			<div style={{position: 'absolute', left: 64, width: 470, top: 270, textShadow: SHADOW, pointerEvents: 'none'}}>
				<SolidTag p={pSpeed} color={colors.aha} size={23}>
					KECEPATAN CAHAYA (c)
				</SolidTag>
				{pSpeed > 0.01 ? (
					<div style={{marginTop: 10, fontFamily: MONO, fontSize: 42, fontWeight: 700, color: colors.ink, ...riseIn(pSpeed, 8)}}>
						299.792 <span style={{fontSize: 26, color: 'rgba(244,241,234,0.82)'}}>km/dtk</span>
					</div>
				) : null}

				{pDist > 0.01 ? (
					<div style={{marginTop: 22, ...riseIn(pDist, 8)}}>
						<div style={{fontSize: 24, fontWeight: 700, color: 'rgba(244,241,234,0.78)'}}>JARAK RATA-RATA (1 AU)</div>
						<div style={{fontFamily: MONO, fontSize: 38, fontWeight: 700, color: colors.neutrino}}>149,6 juta km</div>
					</div>
				) : null}

				{pTime > 0.01 ? (
					<div style={{marginTop: 22, ...riseIn(pTime, 8)}}>
						<div style={{fontSize: 24, fontWeight: 700, color: 'rgba(244,241,234,0.78)'}}>WAKTU TEMPUH</div>
						<div style={{fontFamily: MONO, fontSize: 38, fontWeight: 700, lineHeight: 1.15, color: OK}}>
							499 detik
							<br />
							<span style={{fontSize: 34, color: colors.aha}}>= 8 mnt 19 dtk</span>
						</div>
					</div>
				) : null}
			</div>

			<Sfx name="tick" at={b300} />
			<Sfx name="whoosh" at={b149} />
			<Sfx name="pop" at={b499} />
		</AbsoluteFill>
	);
};

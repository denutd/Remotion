import type {FC} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {MONO, RESMI, SHADOW, SolidTag, Sorot} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import {easeInOut, mix, prog} from '../../../lib/anim';
import type {SceneProps} from '../../../lib/beats';
import {CameraRig} from '../../../three/CameraRig';
import {Dust} from '../../../three/Dust';
import {PostFX} from '../../../three/PostFX';
import {Stage} from '../../../three/Stage';
import {StarField} from '../../../three/StarField';
import {Streaks3D, type Vec3} from '../../../three/Streaks3D';
import {Sun3D} from '../../../three/Sun3D';

export const HookTitle3D: FC<{sorot8?: number}> = ({sorot8 = 0}) => (
	<div style={{position: 'absolute', left: 70, right: 130, top: 262, textShadow: SHADOW, pointerEvents: 'none'}}>
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
			<SolidTag p={1} color={colors.aha} size={26}>
				SAINS &amp; ANTARIKSA
			</SolidTag>
			<SolidTag p={1} color={RESMI} size={24}>
				IAU 2012 · SI
			</SolidTag>
		</div>
		<div
			style={{
				marginTop: 20,
				fontSize: 78,
				fontWeight: 800,
				lineHeight: 1.0,
				letterSpacing: '-0.03em',
				color: colors.ink,
			}}
		>
			CAHAYA MATAHARI
			<br />
			BUTUH{' '}
			<Sorot p={sorot8} color={colors.aha}>
				<span style={{color: colors.aha}}>8 MENIT 19 DETIK</span>
			</Sorot>
		</div>
		<div style={{marginTop: 14, fontFamily: MONO, fontSize: 32, fontWeight: 700, color: 'rgba(244,241,234,0.88)'}}>
			untuk menempuh jarak 149,6 juta km ke Bumi
		</div>
	</div>
);

// Segmen 1 (Hook 3D): Matahari bergejolak dekat kamera + partikel foton meluncur keluar.
export const Hook3D: FC<SceneProps> = ({dur, beat}) => {
	const frame = useCurrentFrame();
	const bDelapan = beat('delapan');
	const sorot = prog(frame, bDelapan - 3, bDelapan + 10);

	const u = prog(frame, 0, dur, easeInOut);
	const camPos: Vec3 = [mix(u, 0.8, -0.6), mix(u, -1.6, -1.1), mix(u, 11.4, 10.0)];
	const look: Vec3 = [0, 0.65, 0];

	return (
		<AbsoluteFill style={{background: '#010206'}}>
			<Stage>
				<color attach="background" args={['#010206']} />
				<CameraRig position={camPos} lookAt={look} fov={38} />
				<StarField count={1800} opacity={0.8} />
				<Sun3D position={[0, -1.35, 0]} radius={2.75} time={frame} intensity={1.75} glow={0.38} />
				<Dust id="hook-dust" count={140} center={[0, 0, 2]} box={[8, 12, 8]} color={[2.2, 1.4, 0.5]} time={frame} />
				<Streaks3D
					id="hook-photons"
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
					opacity={0.85}
				/>
				<PostFX bloom={0.85} bloomThreshold={1.0} bloomRadius={0.75} grain={0.22} vignette={0.6} toneMapping="aces" />
			</Stage>
			<HookTitle3D sorot8={sorot} />
			<Sfx name="riser" at={Math.max(0, bDelapan - 20)} volume={0.12} />
		</AbsoluteFill>
	);
};

import {type FC, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {texture} from './assets';

/** Opsional: muat panorama Bima Sakti kalau file ada di public/assets/sky/milkyway_4k.jpg. */
export const loadMilkyWay = () => texture('assets/sky/milkyway_4k.jpg');

const starVertex = /* glsl */ `
attribute float size;
attribute vec3 tint;
varying vec3 vTint;
void main() {
	vTint = tint;
	gl_PointSize = size;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const starFragment = /* glsl */ `
uniform float uOpacity;
varying vec3 vTint;
void main() {
	vec2 d = gl_PointCoord * 2.0 - 1.0;
	float r2 = dot(d, d);
	float a = exp(-r2 * 3.2) * (1.0 - smoothstep(0.8, 1.0, r2)) * uOpacity;
	gl_FragColor = vec4(vTint * a, a);
}`;

/**
 * Langit malam prosedural: bintang deterministik (tanpa tekstur eksternal) + opsional panorama Bima Sakti.
 */
export const StarField: FC<{
	count?: number;
	radius?: number;
	milkyWay?: THREE.Texture | null;
	milkyWayIntensity?: number;
	milkyWayRotation?: [number, number, number];
	opacity?: number;
}> = ({count = 2600, radius = 400, milkyWay = null, milkyWayIntensity = 0.2, milkyWayRotation = [0, 0, 0], opacity = 1}) => {
	const geometry = useMemo(() => {
		const pos = new Float32Array(count * 3);
		const size = new Float32Array(count);
		const tint = new Float32Array(count * 3);
		for (let i = 0; i < count; i++) {
			const z = random(`star-z-${i}`) * 2 - 1;
			const a = random(`star-a-${i}`) * Math.PI * 2;
			const r = Math.sqrt(1 - z * z);
			pos.set([Math.cos(a) * r * radius, z * radius, Math.sin(a) * r * radius], i * 3);
			const m = Math.pow(random(`star-m-${i}`), 6);
			size[i] = 1.6 + m * 5.5;
			const b = 0.35 + m * 2.6;
			const t = random(`star-t-${i}`);
			const c = t < 0.15 ? [1.0, 0.82, 0.62] : t < 0.35 ? [0.78, 0.86, 1.0] : [0.95, 0.96, 1.0];
			tint.set([c[0] * b, c[1] * b, c[2] * b], i * 3);
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
		g.setAttribute('size', new THREE.BufferAttribute(size, 1));
		g.setAttribute('tint', new THREE.BufferAttribute(tint, 3));
		return g;
	}, [count, radius]);
	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {uOpacity: {value: 1}},
				vertexShader: starVertex,
				fragmentShader: starFragment,
				transparent: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				premultipliedAlpha: true,
				toneMapped: false,
			}),
		[],
	);
	material.uniforms.uOpacity.value = opacity;
	return (
		<group>
			{milkyWay ? (
				<mesh rotation={milkyWayRotation} renderOrder={-20}>
					<sphereGeometry args={[radius * 1.2, 64, 32]} />
					<meshBasicMaterial
						map={milkyWay}
						side={THREE.BackSide}
						depthWrite={false}
						toneMapped={false}
						color={new THREE.Color().setScalar(milkyWayIntensity * opacity)}
					/>
				</mesh>
			) : null}
			<points geometry={geometry} material={material} frustumCulled={false} renderOrder={-19} />
		</group>
	);
};

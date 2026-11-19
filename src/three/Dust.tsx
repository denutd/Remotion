import {type FC, useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import type {Vec3} from './Streaks3D';

const vertex = /* glsl */ `
attribute vec4 seed;
uniform float uTime;
uniform vec3 uBox;
uniform vec3 uCenter;
uniform vec3 uDrift;
uniform float uSize;
varying float vAlpha;
void main() {
	vec3 p = (seed.xyz - 0.5) * uBox;
	p += uDrift * uTime + vec3(sin(uTime * 0.021 + seed.w * 31.0), cos(uTime * 0.017 + seed.w * 17.0), sin(uTime * 0.013 + seed.w * 7.0)) * 0.06 * uBox;
	p = mod(p + 0.5 * uBox, uBox) - 0.5 * uBox;
	vec4 mv = modelViewMatrix * vec4(p + uCenter, 1.0);
	gl_Position = projectionMatrix * mv;
	gl_PointSize = uSize * (0.5 + seed.w) * 300.0 / max(-mv.z, 0.1);
	float edge = 1.0 - smoothstep(0.38, 0.5, max(max(abs(p.x / uBox.x), abs(p.y / uBox.y)), abs(p.z / uBox.z)));
	vAlpha = edge * (0.55 + 0.45 * sin(uTime * 0.09 + seed.w * 40.0));
}`;

const fragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;
void main() {
	vec2 d = gl_PointCoord * 2.0 - 1.0;
	float r2 = dot(d, d);
	float a = exp(-r2 * 4.0) * (1.0 - smoothstep(0.7, 1.0, r2)) * vAlpha * uOpacity;
	gl_FragColor = vec4(uColor * a, a);
}`;

/** Partikel debu melayang deterministik per frame. */
export const Dust: FC<{
	id: string;
	count: number;
	center: Vec3;
	box: Vec3;
	drift?: Vec3;
	size?: number;
	color?: Vec3;
	opacity?: number;
	time: number;
}> = ({id, count, center, box, drift = [0.002, 0.004, 0], size = 0.05, color = [1.6, 1.3, 0.9], opacity = 1, time}) => {
	const geometry = useMemo(() => {
		const seeds = new Float32Array(count * 4);
		for (let i = 0; i < count; i++) {
			seeds.set([random(`${id}-x-${i}`), random(`${id}-y-${i}`), random(`${id}-z-${i}`), random(`${id}-w-${i}`)], i * 4);
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
		g.setAttribute('seed', new THREE.BufferAttribute(seeds, 4));
		return g;
	}, [id, count]);
	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {
					uTime: {value: 0},
					uBox: {value: new THREE.Vector3()},
					uCenter: {value: new THREE.Vector3()},
					uDrift: {value: new THREE.Vector3()},
					uSize: {value: 0.05},
					uColor: {value: new THREE.Color()},
					uOpacity: {value: 1},
				},
				vertexShader: vertex,
				fragmentShader: fragment,
				transparent: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				premultipliedAlpha: true,
				toneMapped: false,
			}),
		[],
	);
	const u = material.uniforms;
	u.uTime.value = time;
	u.uBox.value.set(...box);
	u.uCenter.value.set(...center);
	u.uDrift.value.set(...drift);
	u.uSize.value = size;
	u.uColor.value.setRGB(...color, THREE.LinearSRGBColorSpace);
	u.uOpacity.value = opacity;
	return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={5} />;
};

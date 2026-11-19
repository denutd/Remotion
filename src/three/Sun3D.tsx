import {type FC, useMemo} from 'react';
import * as THREE from 'three';
import {SAFE_POW, SIMPLEX_3D} from './glsl';
import type {Vec3} from './Streaks3D';

const sunVertex = /* glsl */ `
varying vec3 vPos;
varying vec3 vNormalV;
void main() {
	vPos = position;
	vNormalV = normalize(normalMatrix * normal);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const sunFragment = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
varying vec3 vPos;
varying vec3 vNormalV;
${SIMPLEX_3D}
${SAFE_POW}
void main() {
	vec3 p = normalize(vPos);
	float t = uTime * 0.003;
	vec3 q = vec3(fbm(p * 3.0 + vec3(t, 0.0, 0.0)), fbm(p * 3.0 + vec3(5.2, t, 1.3)), fbm(p * 3.0 + vec3(1.7, 9.2, t)));
	float swirl = fbm(p * 7.0 + q * 2.2 - vec3(t * 2.0));
	float grain = snoise(p * 70.0 + q * 4.0);
	float plasma = clamp(0.5 + 0.42 * swirl + 0.1 * grain, 0.0, 1.0);
	vec3 col = mix(vec3(0.5, 0.07, 0.0), vec3(1.0, 0.42, 0.05), smoothstep(0.12, 0.62, plasma));
	col = mix(col, vec3(1.0, 0.8, 0.4), smoothstep(0.66, 0.98, plasma));
	float mu = clamp(dot(normalize(vNormalV), vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
	col *= 0.3 + 0.7 * spow(mu, 0.5);
	gl_FragColor = vec4(col * uIntensity, 1.0);
}`;

const glowVertex = /* glsl */ `
varying vec2 vUv;
void main() {
	vUv = uv * 2.0 - 1.0;
	vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
	mv.xy += position.xy;
	gl_Position = projectionMatrix * mv;
}`;

const glowFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uInner;
varying vec2 vUv;
void main() {
	float r = length(vUv);
	float x = max(r - uInner, 0.0) / (1.0 - uInner);
	float g = (1.0 - smoothstep(0.0, 1.0, x));
	g = g * g * g * step(uInner * 0.98, r);
	gl_FragColor = vec4(uColor * g, g);
}`;

/** Matahari 3D prosedural (granulasi plasma + korona billboard), tanpa tekstur eksternal. */
export const Sun3D: FC<{
	position: Vec3;
	radius: number;
	time: number;
	intensity?: number;
	glow?: number;
}> = ({position, radius, time, intensity = 9, glow = 1}) => {
	const sun = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {uTime: {value: 0}, uIntensity: {value: 1}},
				vertexShader: sunVertex,
				fragmentShader: sunFragment,
			}),
		[],
	);
	const corona = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {uColor: {value: new THREE.Color()}, uInner: {value: 0.59}},
				vertexShader: glowVertex,
				fragmentShader: glowFragment,
				transparent: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				premultipliedAlpha: true,
				toneMapped: false,
			}),
		[],
	);
	sun.uniforms.uTime.value = time;
	sun.uniforms.uIntensity.value = intensity;
	corona.uniforms.uColor.value.setRGB(2.2 * glow, 0.9 * glow, 0.28 * glow, THREE.LinearSRGBColorSpace);
	return (
		<group position={position}>
			<mesh material={sun}>
				<sphereGeometry args={[radius, 128, 96]} />
			</mesh>
			<mesh material={corona} renderOrder={2}>
				<planeGeometry args={[radius * 3.4, radius * 3.4]} />
			</mesh>
		</group>
	);
};

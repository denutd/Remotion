import {type FC, useMemo} from 'react';
import {random, useCurrentFrame} from 'remotion';
import * as THREE from 'three';

export type Vec3 = [number, number, number];

const vertexShader = /* glsl */ `
attribute vec2 corner;
attribute vec4 seedA;
attribute vec4 seedB;
uniform float uTime;
uniform float uStart;
uniform vec3 uDir;
uniform vec3 uU;
uniform vec3 uV;
uniform vec3 uCenter;
uniform float uSpan;
uniform vec4 uStop;
varying vec2 vCorner;
varying float vBright;

void main() {
	float speed = seedA.w;
	float len = seedB.x;
	float total = uSpan + len;
	float travel = mod(uTime * speed + seedA.z * total, total);
	float born = uTime - travel / speed;
	vec3 entry = uCenter - uDir * (uSpan * 0.5) + uU * seedA.x + uV * seedA.y;
	float headD = travel;
	float tailD = travel - len;
	if (uStop.w > 0.0) {
		vec3 oc = entry - uStop.xyz;
		float b = dot(oc, uDir);
		float h = b * b - (dot(oc, oc) - uStop.w * uStop.w);
		if (h > 0.0) {
			float hit = -b - sqrt(h);
			if (hit > 0.0) {
				headD = min(headD, hit);
				tailD = min(tailD, hit);
			}
		}
	}
	tailD = max(tailD, 0.0);
	vec3 p = entry + uDir * mix(tailD, headD, corner.x);
	vec3 cr = cross(uDir, normalize(cameraPosition - p));
	float cl = length(cr);
	vec3 side = cl > 1e-5 ? cr / cl : uU;
	p += side * corner.y * seedB.y;
	float visible = headD - tailD > 1e-4 ? 1.0 : 0.0;
	vBright = seedB.z * visible * (born >= uStart ? 1.0 : 0.0);
	vCorner = corner;
	gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uHeadColor;
uniform float uOpacity;
uniform float uEven;
varying vec2 vCorner;
varying float vBright;

void main() {
	float along = clamp(vCorner.x, 0.0, 1.0);
	float across = 1.0 - clamp(abs(vCorner.y), 0.0, 1.0);
	float tail = along * along * along;
	float head = smoothstep(0.86, 1.0, along);
	float a = (tail * across * across + head * head * across * 1.5) * vBright * uOpacity;
	vec3 col = mix(uColor, uHeadColor, head);
	float even = smoothstep(0.0, 0.25, along) * smoothstep(1.0, 0.75, along) * across * vBright * uOpacity;
	a = mix(a, even, uEven);
	col = mix(col, uColor, uEven);
	gl_FragColor = vec4(col * a, a);
}`;

const CORNERS = new Float32Array([0, -1, 0, 1, 1, -1, 1, 1]);
const INDEX = [0, 2, 1, 2, 3, 1];
const UP = new THREE.Vector3(0, 1, 0);

export const makeStreakMaterial = (depthTest: boolean) =>
	new THREE.ShaderMaterial({
		uniforms: {
			uTime: {value: 0},
			uStart: {value: -1e9},
			uDir: {value: new THREE.Vector3(0, -1, 0)},
			uU: {value: new THREE.Vector3(1, 0, 0)},
			uV: {value: new THREE.Vector3(0, 0, 1)},
			uCenter: {value: new THREE.Vector3()},
			uSpan: {value: 1},
			uStop: {value: new THREE.Vector4(0, 0, 0, 0)},
			uColor: {value: new THREE.Color()},
			uHeadColor: {value: new THREE.Color()},
			uOpacity: {value: 1},
			uEven: {value: 0},
		},
		vertexShader,
		fragmentShader,
		side: THREE.DoubleSide,
		transparent: true,
		depthWrite: false,
		depthTest,
		blending: THREE.AdditiveBlending,
		premultipliedAlpha: true,
		toneMapped: false,
	});

export const makeStreakGeometry = (seeds: {a: number[]; b: number[]}[]) => {
	const g = new THREE.InstancedBufferGeometry();
	g.setAttribute('corner', new THREE.BufferAttribute(CORNERS, 2));
	g.setIndex(INDEX);
	g.setAttribute('seedA', new THREE.InstancedBufferAttribute(new Float32Array(seeds.flatMap((s) => s.a)), 4));
	g.setAttribute('seedB', new THREE.InstancedBufferAttribute(new Float32Array(seeds.flatMap((s) => s.b)), 4));
	g.instanceCount = seeds.length;
	return g;
};

export type Streaks3DProps = {
	id: string;
	count: number;
	dir: Vec3;
	center: Vec3;
	spread: [number, number];
	span: number;
	speed: [number, number];
	length: [number, number];
	width?: [number, number];
	color?: Vec3;
	headColor?: Vec3;
	opacity?: number;
	time?: number;
	startTime?: number;
	stop?: {center: Vec3; radius: number};
	depthTest?: boolean;
	profile?: 'comet' | 'even';
};

/** Aliran partikel (foton/hujan/partikel) 3D dalam satu draw call. */
export const Streaks3D: FC<Streaks3DProps> = ({
	id,
	count,
	dir,
	center,
	spread,
	span,
	speed,
	length,
	width = [0.006, 0.012],
	color = [0.5, 2.2, 3.2],
	headColor = [3, 5, 6],
	opacity = 1,
	time,
	startTime,
	stop,
	depthTest = true,
	profile = 'comet',
}) => {
	const frame = useCurrentFrame();
	const geometry = useMemo(
		() =>
			makeStreakGeometry(
				Array.from({length: count}, (_, i) => {
					const r = (k: string) => random(`${id}-${k}-${i}`);
					return {
						a: [
							(r('a') * 2 - 1) * spread[0],
							(r('b') * 2 - 1) * spread[1],
							r('p'),
							speed[0] + (speed[1] - speed[0]) * r('s'),
						],
						b: [
							length[0] + (length[1] - length[0]) * r('l'),
							width[0] + (width[1] - width[0]) * r('w'),
							0.3 + 0.7 * r('i') * r('i'),
							0,
						],
					};
				}),
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[id, count, spread[0], spread[1], speed[0], speed[1], length[0], length[1], width[0], width[1]],
	);
	const material = useMemo(() => makeStreakMaterial(depthTest), [depthTest]);

	const d = new THREE.Vector3(...dir).normalize();
	const u = new THREE.Vector3().crossVectors(d, Math.abs(d.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : UP).normalize();
	const v = new THREE.Vector3().crossVectors(d, u).normalize();
	const uni = material.uniforms;
	uni.uTime.value = time ?? frame;
	uni.uStart.value = startTime ?? -1e9;
	uni.uDir.value.copy(d);
	uni.uU.value.copy(u);
	uni.uV.value.copy(v);
	uni.uCenter.value.set(...center);
	uni.uSpan.value = span;
	uni.uStop.value.set(...(stop?.center ?? [0, 0, 0]), stop?.radius ?? 0);
	uni.uColor.value.setRGB(...color, THREE.LinearSRGBColorSpace);
	uni.uHeadColor.value.setRGB(...headColor, THREE.LinearSRGBColorSpace);
	uni.uOpacity.value = opacity;
	uni.uEven.value = profile === 'even' ? 1 : 0;

	return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={10} />;
};

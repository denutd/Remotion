import {type FC, useMemo} from 'react';
import * as THREE from 'three';
import {texture} from './assets';
import {SAFE_POW} from './glsl';
import type {Vec3} from './Streaks3D';

export type EarthTextures = {day: THREE.Texture; night: THREE.Texture; clouds: THREE.Texture};

/** Tekstur NASA opsional (taruh di public/assets/earth/day.jpg, night.jpg, clouds.jpg). */
export const loadEarth = async (): Promise<EarthTextures> => {
	const [day, night, clouds] = await Promise.all([
		texture('assets/earth/day.jpg'),
		texture('assets/earth/night.jpg'),
		texture('assets/earth/clouds.jpg', false),
	]);
	return {day, night, clouds};
};

const vertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
	vUv = uv;
	vNormalW = normalize(mat3(modelMatrix) * normal);
	vec4 w = modelMatrix * vec4(position, 1.0);
	vPosW = w.xyz;
	gl_Position = projectionMatrix * viewMatrix * w;
}`;

const fragment = /* glsl */ `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform vec3 uSunDir;
uniform float uSun;
uniform float uCity;
uniform float uOpacity;
uniform float uCloudShift;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
${SAFE_POW}
void main() {
	vec3 n = normalize(vNormalW);
	vec3 v = normalize(cameraPosition - vPosW);
	vec3 l = normalize(uSunDir);
	float ndl = dot(n, l);
	float lit = clamp(ndl, 0.0, 1.0);
	float dayMask = smoothstep(-0.08, 0.22, ndl);

	vec3 albedo = texture2D(uDay, vUv).rgb;
	float cloud = texture2D(uClouds, vUv + vec2(uCloudShift, 0.0)).r;
	cloud = smoothstep(0.18, 0.85, cloud) * smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
	float ocean = smoothstep(0.02, 0.12, albedo.b - max(albedo.r, albedo.g) * 0.9);

	vec3 surface = mix(albedo, vec3(0.92), cloud * 0.9);
	vec3 dusk = mix(vec3(1.0, 0.45, 0.2), vec3(1.0), smoothstep(0.0, 0.35, ndl));
	vec3 col = surface * lit * uSun * dusk;

	vec3 h = normalize(l + v);
	float spec = spow(clamp(dot(n, h), 0.0, 1.0), 90.0) * ocean * (1.0 - cloud) * lit;
	col += vec3(1.0, 0.92, 0.8) * spec * uSun * 1.6;

	vec3 nightTex = texture2D(uNight, vUv).rgb;
	float city = clamp((nightTex.r - 0.12) * 1.5, 0.0, 1.0);
	col += vec3(1.0, 0.68, 0.35) * city * city * uCity * (1.0 - dayMask) * (1.0 - cloud * 0.7);

	float rim = 1.0 - clamp(dot(n, v), 0.0, 1.0);
	float atmo = spow(rim, 2.6) * (0.08 + 0.92 * smoothstep(-0.25, 0.4, ndl));
	col += vec3(0.32, 0.6, 1.0) * atmo * uSun * 0.9;

	gl_FragColor = vec4(col * uOpacity, uOpacity);
}`;

const haloFragment = /* glsl */ `
uniform vec3 uSunDir;
uniform float uStrength;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
	vec3 n = normalize(vNormalW);
	vec3 v = normalize(cameraPosition - vPosW);
	float facing = clamp(-dot(n, v), 0.0, 1.0);
	float edge = smoothstep(0.0, 0.33, facing);
	edge *= edge * (1.0 - smoothstep(0.33, 0.6, facing));
	float day = smoothstep(-0.3, 0.4, dot(n, normalize(uSunDir)));
	float a = edge * (0.04 + 0.96 * day) * uStrength * 0.8;
	gl_FragColor = vec4(vec3(0.3, 0.58, 1.0) * a, a);
}`;

export const Earth3D: FC<{
	textures: EarthTextures;
	position?: Vec3;
	radius?: number;
	sunDir: Vec3;
	spin?: number;
	tilt?: Vec3;
	sun?: number;
	city?: number;
	opacity?: number;
	halo?: number;
	cloudShift?: number;
}> = ({textures, position = [0, 0, 0], radius = 1, sunDir, spin = 0, tilt = [0, 0, 0], sun = 3, city = 2.5, opacity = 1, halo: haloStrength, cloudShift = 0}) => {
	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {
					uDay: {value: textures.day},
					uNight: {value: textures.night},
					uClouds: {value: textures.clouds},
					uSunDir: {value: new THREE.Vector3()},
					uSun: {value: 1},
					uCity: {value: 1},
					uOpacity: {value: 1},
					uCloudShift: {value: 0},
				},
				vertexShader: vertex,
				fragmentShader: fragment,
				transparent: true,
				premultipliedAlpha: true,
			}),
		[textures],
	);
	const halo = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {uSunDir: {value: new THREE.Vector3()}, uStrength: {value: 1}},
				vertexShader: vertex,
				fragmentShader: haloFragment,
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				premultipliedAlpha: true,
			}),
		[],
	);
	const u = material.uniforms;
	u.uSunDir.value.set(...sunDir).normalize();
	u.uSun.value = sun;
	u.uCity.value = city;
	u.uOpacity.value = opacity;
	u.uCloudShift.value = cloudShift;
	material.depthWrite = opacity > 0.99;
	halo.uniforms.uSunDir.value.set(...sunDir).normalize();
	halo.uniforms.uStrength.value = haloStrength ?? opacity;
	return (
		<group position={position}>
			<group rotation={tilt}>
				<mesh material={material} rotation={[0, spin, 0]}>
					<sphereGeometry args={[radius, 128, 96]} />
				</mesh>
			</group>
			<mesh material={halo}>
				<sphereGeometry args={[radius * 1.06, 96, 64]} />
			</mesh>
		</group>
	);
};

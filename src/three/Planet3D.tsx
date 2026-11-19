import {type FC, useMemo} from 'react';
import * as THREE from 'three';
import {SAFE_POW, SIMPLEX_3D} from './glsl';
import type {Vec3} from './Streaks3D';

const vertex = /* glsl */ `
varying vec3 vPosL;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
	vPosL = position;
	vNormalW = normalize(mat3(modelMatrix) * normal);
	vec4 w = modelMatrix * vec4(position, 1.0);
	vPosW = w.xyz;
	gl_Position = projectionMatrix * viewMatrix * w;
}`;

const fragment = /* glsl */ `
uniform vec3 uSunDir;
uniform float uSun;
uniform float uCloudShift;
uniform float uOpacity;
varying vec3 vPosL;
varying vec3 vNormalW;
varying vec3 vPosW;
${SIMPLEX_3D}
${SAFE_POW}
void main() {
	vec3 p = normalize(vPosL);
	vec3 n = normalize(vNormalW);
	vec3 v = normalize(cameraPosition - vPosW);
	vec3 l = normalize(uSunDir);
	float ndl = dot(n, l);
	float lit = clamp(ndl, 0.0, 1.0);
	float dayMask = smoothstep(-0.08, 0.22, ndl);

	// Benua & samudra prosedural (tanpa tekstur eksternal).
	float cont = fbm(p * 2.1 + vec3(1.2, -0.6, 2.4));
	float detail = fbm(p * 7.5 + vec3(4.0));
	float landMask = smoothstep(0.06, 0.14, cont + detail * 0.15);
	float ice = smoothstep(0.78, 0.92, abs(p.y) + detail * 0.08);

	vec3 oceanCol = mix(vec3(0.04, 0.14, 0.42), vec3(0.08, 0.26, 0.62), smoothstep(-0.2, 0.08, cont));
	vec3 landCol = mix(vec3(0.14, 0.36, 0.20), vec3(0.45, 0.42, 0.28), smoothstep(0.15, 0.55, cont));
	vec3 albedo = mix(oceanCol, landCol, landMask);
	albedo = mix(albedo, vec3(0.88, 0.94, 0.98), ice);

	// Awan bergulung pelan.
	float cAngle = uCloudShift;
	mat2 rotC = mat2(cos(cAngle), -sin(cAngle), sin(cAngle), cos(cAngle));
	vec3 pc = p;
	pc.xz = rotC * pc.xz;
	float cloud = smoothstep(0.08, 0.52, fbm(pc * 4.2 + vec3(2.1, 0.3, -1.5)));
	vec3 surface = mix(albedo, vec3(0.95), cloud * 0.85);

	vec3 dusk = mix(vec3(1.0, 0.45, 0.2), vec3(1.0), smoothstep(0.0, 0.35, ndl));
	vec3 col = surface * lit * uSun * dusk;

	// Kilau Matahari di laut.
	vec3 h = normalize(l + v);
	float spec = spow(clamp(dot(n, h), 0.0, 1.0), 72.0) * (1.0 - landMask) * (1.0 - cloud) * lit;
	col += vec3(1.0, 0.92, 0.8) * spec * uSun * 1.4;

	// Sedikit lampu kota di sisi malam daratan.
	float cityNoise = snoise(p * 26.0);
	float city = smoothstep(0.45, 0.85, cityNoise) * landMask * (1.0 - ice);
	col += vec3(1.0, 0.72, 0.36) * city * 1.4 * (1.0 - dayMask) * (1.0 - cloud * 0.7);

	// Atmosfer biru di tepi bola.
	float rim = 1.0 - clamp(dot(n, v), 0.0, 1.0);
	float atmo = spow(rim, 2.6) * (0.08 + 0.92 * smoothstep(-0.25, 0.4, ndl));
	col += vec3(0.32, 0.6, 1.0) * atmo * uSun * 0.85;

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

/**
 * Planet mirip Bumi 100% prosedural (GLSL): tidak membutuhkan file tekstur eksternal.
 * Cocok untuk starter kit & eksperimen cepat; untuk tekstur NASA asli, gunakan Earth3D.
 */
export const Planet3D: FC<{
	position?: Vec3;
	radius?: number;
	sunDir: Vec3;
	spin?: number;
	sun?: number;
	opacity?: number;
	halo?: number;
	cloudShift?: number;
}> = ({position = [0, 0, 0], radius = 1, sunDir, spin = 0, sun = 2.8, opacity = 1, halo: haloStrength, cloudShift = 0}) => {
	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				uniforms: {
					uSunDir: {value: new THREE.Vector3()},
					uSun: {value: 1},
					uCloudShift: {value: 0},
					uOpacity: {value: 1},
				},
				vertexShader: vertex,
				fragmentShader: fragment,
				transparent: true,
				premultipliedAlpha: true,
			}),
		[],
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
	u.uCloudShift.value = cloudShift;
	u.uOpacity.value = opacity;
	material.depthWrite = opacity > 0.99;
	halo.uniforms.uSunDir.value.set(...sunDir).normalize();
	halo.uniforms.uStrength.value = haloStrength ?? opacity;

	return (
		<group position={position}>
			<mesh material={material} rotation={[0, spin, 0]}>
				<sphereGeometry args={[radius, 96, 64]} />
			</mesh>
			<mesh material={halo}>
				<sphereGeometry args={[radius * 1.06, 72, 48]} />
			</mesh>
		</group>
	);
};

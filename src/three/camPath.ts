import * as THREE from 'three';
import {easeInOut} from '../lib/anim';
import type {Vec3} from './Streaks3D';

export type CamKey = {f: number; pos: Vec3; look: Vec3; fov?: number};
export type CamState = {pos: Vec3; look: Vec3; fov: number};

const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/**
 * Jalur kamera dari beberapa keyframe. Posisi diinterpolasi dalam koordinat bola di sekitar
 * titik pandang supaya gerakan mengorbit tidak memotong ke dalam subjek.
 */
export const camPath = (frame: number, keys: CamKey[], defaultFov = 30): CamState => {
	if (frame <= keys[0].f) {
		return {pos: keys[0].pos, look: keys[0].look, fov: keys[0].fov ?? defaultFov};
	}
	for (let i = 0; i < keys.length - 1; i++) {
		const a = keys[i];
		const b = keys[i + 1];
		if (frame <= b.f) {
			const t = easeInOut((frame - a.f) / Math.max(1, b.f - a.f));
			const look = lerp3(a.look, b.look, t);
			const sa = new THREE.Spherical().setFromVector3(new THREE.Vector3(...a.pos).sub(new THREE.Vector3(...a.look)));
			const sb = new THREE.Spherical().setFromVector3(new THREE.Vector3(...b.pos).sub(new THREE.Vector3(...b.look)));
			let dTheta = sb.theta - sa.theta;
			if (dTheta > Math.PI) dTheta -= Math.PI * 2;
			if (dTheta < -Math.PI) dTheta += Math.PI * 2;
			const s = new THREE.Spherical(
				Math.exp(Math.log(sa.radius) + (Math.log(sb.radius) - Math.log(sa.radius)) * t),
				sa.phi + (sb.phi - sa.phi) * t,
				sa.theta + dTheta * t,
			);
			const pos = new THREE.Vector3().setFromSpherical(s).add(new THREE.Vector3(...look));
			const fa = a.fov ?? defaultFov;
			const fb = b.fov ?? defaultFov;
			return {pos: [pos.x, pos.y, pos.z], look, fov: fa + (fb - fa) * t};
		}
	}
	const last = keys[keys.length - 1];
	return {pos: last.pos, look: last.look, fov: last.fov ?? defaultFov};
};

/** Proyeksikan titik dunia 3D ke piksel layar (1080×1920) untuk menempelkan label HTML ke objek 3D. */
export const projector = (cam: CamState, width = 1080, height = 1920) => {
	const c = new THREE.PerspectiveCamera(cam.fov, width / height, 0.1, 5000);
	c.position.set(...cam.pos);
	c.lookAt(...cam.look);
	c.updateMatrixWorld();
	c.updateProjectionMatrix();
	return (p: Vec3) => {
		const v = new THREE.Vector3(...p).project(c);
		return {x: ((v.x + 1) / 2) * width, y: ((1 - v.y) / 2) * height, visible: v.z < 1};
	};
};

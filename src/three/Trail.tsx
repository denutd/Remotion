import {type FC, useMemo} from 'react';
import * as THREE from 'three';
import {makeStreakGeometry, makeStreakMaterial, type Vec3} from './Streaks3D';

/** Satu partikel jejak dengan posisi kepala `head` yang dikendalikan langsung dari React. */
export const Trail: FC<{
	head: Vec3;
	dir: Vec3;
	length: number;
	width: number;
	color?: Vec3;
	headColor?: Vec3;
	opacity?: number;
	depthTest?: boolean;
}> = ({head, dir, length, width, color = [0.5, 2.2, 3.2], headColor = [3, 5, 6], opacity = 1, depthTest = false}) => {
	const geometry = useMemo(() => makeStreakGeometry([{a: [0, 0, 0, 1], b: [length, width, 1, 0]}]), [length, width]);
	const material = useMemo(() => makeStreakMaterial(depthTest), [depthTest]);
	const d = new THREE.Vector3(...dir).normalize();
	const u = new THREE.Vector3().crossVectors(d, Math.abs(d.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)).normalize();
	const uni = material.uniforms;
	uni.uTime.value = length;
	uni.uStart.value = -1e9;
	uni.uSpan.value = 2 * length;
	uni.uDir.value.copy(d);
	uni.uU.value.copy(u);
	uni.uV.value.crossVectors(d, u).normalize();
	uni.uCenter.value.set(...head);
	uni.uStop.value.set(0, 0, 0, 0);
	uni.uColor.value.setRGB(...color, THREE.LinearSRGBColorSpace);
	uni.uHeadColor.value.setRGB(...headColor, THREE.LinearSRGBColorSpace);
	uni.uOpacity.value = opacity;
	return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={11} />;
};

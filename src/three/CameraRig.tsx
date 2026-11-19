import {useThree} from '@react-three/fiber';
import {type FC, useLayoutEffect} from 'react';
import type * as THREE from 'three';

type Vec3 = [number, number, number];

/** Kamera deklaratif: posisi/arah/fov dihitung dari frame, diterapkan sebelum frame dirender. */
export const CameraRig: FC<{position: Vec3; lookAt: Vec3; fov?: number; near?: number; far?: number}> = ({
	position,
	lookAt,
	fov,
	near,
	far,
}) => {
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	useLayoutEffect(() => {
		camera.position.set(...position);
		camera.lookAt(...lookAt);
		let dirty = false;
		if (fov !== undefined && camera.fov !== fov) {
			camera.fov = fov;
			dirty = true;
		}
		if (near !== undefined && camera.near !== near) {
			camera.near = near;
			dirty = true;
		}
		if (far !== undefined && camera.far !== far) {
			camera.far = far;
			dirty = true;
		}
		if (dirty) {
			camera.updateProjectionMatrix();
		}
	});
	return null;
};

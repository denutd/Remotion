import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';

// Aset dimuat sekali per tab browser, lalu dipakai ulang di setiap frame.
const cache = new Map<string, Promise<unknown>>();
const once = <T,>(key: string, load: () => Promise<T>): Promise<T> => {
	if (!cache.has(key)) {
		cache.set(key, load());
	}
	return cache.get(key) as Promise<T>;
};

export const texture = (path: string, srgb = true) =>
	once(`tex:${path}`, async () => {
		const t = await new THREE.TextureLoader().loadAsync(staticFile(path));
		t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
		t.anisotropy = 8;
		return t;
	});

export const hdr = (path: string) =>
	once(`hdr:${path}`, async () => {
		const t = await new HDRLoader().loadAsync(staticFile(path));
		t.mapping = THREE.EquirectangularReflectionMapping;
		return t;
	});

/**
 * Muat semua aset sebuah adegan sebelum <ThreeCanvas> dipasang. Render Remotion ditahan
 * (delayRender) sampai semuanya siap, jadi frame pertama pun sudah lengkap.
 */
export const useAssets = <T,>(load: () => Promise<T>): T | null => {
	const [assets, setAssets] = useState<T | null>(null);
	const [handle] = useState(() => delayRender('Memuat aset 3D'));
	useEffect(() => {
		load()
			.then((a) => setAssets(() => a))
			.catch((err) => cancelRender(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (assets) {
			continueRender(handle);
		}
	}, [assets, handle]);
	return assets;
};

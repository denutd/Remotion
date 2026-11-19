import {useThree} from '@react-three/fiber';
import {type FC, useLayoutEffect, useMemo, useRef} from 'react';
import {staticFile, useDelayRender, useRemotionEnvironment} from 'remotion';
import {NoReactInternals} from 'remotion/no-react';
import * as THREE from 'three';

type Vec3 = [number, number, number];

/**
 * Ambil satu frame footage sebagai tekstur Three.js.
 * Saat mode render, frame diambil dari server offthread Remotion agar slow motion & frame blending sinkron.
 */
export const useFootageFrame = (src: string | null, time: number, apply: (tex: THREE.Texture) => void) => {
	const {isRendering} = useRemotionEnvironment();
	const advance = useThree((s) => s.advance);
	const {delayRender, continueRender, cancelRender} = useDelayRender();
	const current = useRef<THREE.Texture | null>(null);

	const t = Math.max(0, (Math.floor(time * 1000 + 1e-6) + 1) / 1000);
	const url =
		isRendering && src
			? NoReactInternals.getOffthreadVideoSource({src: staticFile(src), currentTime: t, transparent: false, toneMapped: true})
			: null;

	useLayoutEffect(() => {
		if (!url) {
			return;
		}
		const handle = delayRender(`Frame footage ${src} @ ${t}s`);
		let cancelled = false;
		const load = async (attempt = 0): Promise<THREE.Texture> => {
			try {
				return await new THREE.TextureLoader().loadAsync(url);
			} catch (err) {
				if (attempt >= 4 || cancelled) throw err;
				await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
				return load(attempt + 1);
			}
		};
		load()
			.then((tex) => {
				if (cancelled) {
					tex.dispose();
					return;
				}
				tex.colorSpace = THREE.SRGBColorSpace;
				tex.anisotropy = 4;
				const old = current.current;
				current.current = tex;
				apply(tex);
				old?.dispose();
				advance(performance.now());
				continueRender(handle);
			})
			.catch((err) => cancelRender(err));
		return () => {
			cancelled = true;
			continueRender(handle);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url]);
};

/**
 * Rekaman video (footage) sebagai bidang di dalam adegan 3D agar bloom, grain, vignette,
 * dan objek 3D menyatu dalam satu lensa kamera.
 */
export const FootagePlane: FC<{
	src: string;
	time: number;
	distance: number;
	fov: number;
	zoom?: number;
	exposure?: number;
	tint?: Vec3;
	offset?: [number, number];
	fps?: number;
}> = ({src, time, distance, fov, zoom = 1, exposure = 1, tint = [1, 1, 1], offset = [0, 0], fps}) => {
	const material = useMemo(() => new THREE.MeshBasicMaterial({color: 0x000000, depthWrite: true}), []);
	const blendMaterial = useMemo(() => new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, depthWrite: false, depthTest: false}), []);
	for (const m of [material, blendMaterial]) {
		m.color.setRGB(tint[0] * exposure, tint[1] * exposure, tint[2] * exposure, THREE.LinearSRGBColorSpace);
	}

	const pos = fps ? Math.max(0, time) * fps : 0;
	const i0 = Math.floor(pos + 1e-6);
	const frac = fps ? Math.min(1, Math.max(0, pos - i0)) : 0;
	const blend = frac > 0.02 && frac < 0.98;
	const timeA = fps ? ((frac >= 0.98 ? i0 + 1 : i0) + 0.25) / fps : time;
	blendMaterial.opacity = frac;

	useFootageFrame(src, timeA, (tex) => {
		material.map = tex;
		material.needsUpdate = true;
	});
	useFootageFrame(blend && fps ? src : null, (i0 + 1.25) / (fps ?? 1), (tex) => {
		blendMaterial.map = tex;
		blendMaterial.needsUpdate = true;
	});

	const h = 2 * distance * Math.tan(((fov / 2) * Math.PI) / 180) * zoom;
	const w = (h * 9) / 16;
	return (
		<group position={[-offset[0] * w, -offset[1] * h, -distance]}>
			<mesh material={material} renderOrder={-40}>
				<planeGeometry args={[w, h]} />
			</mesh>
			{blend ? (
				<mesh material={blendMaterial} renderOrder={-39}>
					<planeGeometry args={[w, h]} />
				</mesh>
			) : null}
		</group>
	);
};

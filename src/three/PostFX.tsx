import {useFrame, useThree} from '@react-three/fiber';
import {
	BlendFunction,
	BloomEffect,
	ChromaticAberrationEffect,
	DepthOfFieldEffect,
	Effect,
	EffectComposer,
	EffectPass,
	HueSaturationEffect,
	NoiseEffect,
	RenderPass,
	ToneMappingEffect,
	ToneMappingMode,
	VignetteEffect,
} from 'postprocessing';
import {type FC, useEffect, useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';

type Vec3 = [number, number, number];

/**
 * Buang NaN/Inf sebelum bloom. Di GPU Intel (D3D lewat ANGLE), pow() dari angka negatif
 * menghasilkan NaN; bloom lalu menyebarkan satu piksel NaN sampai seluruh frame jadi hitam.
 */
class SanitizeEffect extends Effect {
	constructor() {
		super(
			'SanitizeEffect',
			/* glsl */ `
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec3 c = inputColor.rgb;
	if (any(isnan(c)) || any(isinf(c))) {
		c = vec3(0.0);
	}
	outputColor = vec4(clamp(c, 0.0, 48.0), clamp(inputColor.a, 0.0, 1.0));
}`,
		);
	}
}

export type PostFXProps = {
	bloom?: number;
	bloomThreshold?: number;
	bloomRadius?: number;
	focus?: Vec3;
	focusRange?: number;
	bokeh?: number;
	grain?: number;
	vignette?: number;
	aberration?: number;
	toneMapping?: 'agx' | 'aces';
	saturation?: number;
};

/**
 * Satu lensa kamera untuk semua adegan 3D: depth of field, bloom, aberasi, AgX/ACES, vignette, grain.
 * Dibuat sinkron via EffectComposer (bukan useEffect dari R3F) agar frame ke-0 Remotion tidak pernah kosong.
 */
export const PostFX: FC<PostFXProps> = ({
	bloom = 1.1,
	bloomThreshold = 0.82,
	bloomRadius = 0.72,
	focus,
	focusRange = 1.2,
	bokeh = 3,
	grain = 0.22,
	vignette = 0.62,
	aberration = 0,
	toneMapping = 'agx',
	saturation = 0,
}) => {
	const gl = useThree((s) => s.gl);
	const scene = useThree((s) => s.scene);
	const camera = useThree((s) => s.camera);
	const size = useThree((s) => s.size);
	const withDof = focus !== undefined;

	const fx = useMemo(() => {
		const composer = new EffectComposer(gl, {multisampling: 4, frameBufferType: THREE.HalfFloatType});
		composer.addPass(new RenderPass(scene, camera));
		composer.addPass(new EffectPass(camera, new SanitizeEffect()));
		const dof = withDof ? new DepthOfFieldEffect(camera, {focusRange: 1, bokehScale: 1}) : null;
		if (dof) {
			composer.addPass(new EffectPass(camera, dof));
		}
		const bloomFx = new BloomEffect({mipmapBlur: true, luminanceSmoothing: 0.25});
		const aberrationFx = new ChromaticAberrationEffect({
			offset: new THREE.Vector2(0, 0),
			radialModulation: true,
			modulationOffset: 0.35,
		});
		const vignetteFx = new VignetteEffect({offset: 0.28});
		const noiseFx = new NoiseEffect({blendFunction: BlendFunction.SOFT_LIGHT, premultiply: true});
		const toneFx = new ToneMappingEffect({mode: ToneMappingMode.AGX});
		const saturationFx = new HueSaturationEffect({saturation: 0});
		composer.addPass(
			new EffectPass(
				camera,
				bloomFx,
				aberrationFx,
				toneFx,
				saturationFx,
				vignetteFx,
				noiseFx,
			),
		);
		return {composer, dof, bloomFx, aberrationFx, toneFx, saturationFx, vignetteFx, noiseFx};
	}, [gl, scene, camera, withDof]);

	fx.bloomFx.intensity = bloom;
	fx.bloomFx.luminanceMaterial.threshold = bloomThreshold;
	fx.bloomFx.mipmapBlurPass.radius = bloomRadius;
	fx.aberrationFx.offset.set(aberration, aberration);
	fx.toneFx.mode = toneMapping === 'aces' ? ToneMappingMode.ACES_FILMIC : ToneMappingMode.AGX;
	fx.saturationFx.saturation = saturation;
	fx.vignetteFx.darkness = vignette;
	fx.noiseFx.blendMode.opacity.value = grain;
	if (fx.dof && focus) {
		fx.dof.target = new THREE.Vector3(...focus);
		fx.dof.cocMaterial.focusRange = focusRange;
		fx.dof.bokehScale = bokeh;
	}

	useLayoutEffect(() => {
		fx.composer.setSize(size.width, size.height);
	}, [fx, size.width, size.height]);

	useEffect(() => () => fx.composer.dispose(), [fx]);

	useFrame((_, delta) => fx.composer.render(delta), 1);
	return null;
};

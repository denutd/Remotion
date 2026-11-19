import type {CSSProperties, FC, ReactNode} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {monoFamily} from '../brand/fonts';
import {colors} from '../brand/theme';
import {mix} from '../lib/anim';
import {CameraRig} from '../three/CameraRig';
import {FootagePlane} from '../three/Footage';
import {PostFX} from '../three/PostFX';
import {Stage} from '../three/Stage';

// ---- Warna & gaya dasar editorial (tanpa pil bercahaya / "AI slop") ----

export const OK = '#7FE0A2';
export const NO = '#FF6A5A';
export const RESMI = 'rgba(244,241,234,0.92)';
export const MUTED = 'rgba(244,241,234,0.74)';
export const GARIS = 'rgba(244,241,234,0.9)';
export const MONO = monoFamily;
export const SHADOW = '0 1px 3px rgba(0,0,0,0.55), 0 6px 28px rgba(0,0,0,0.6)';
export const DIAGRAM_BG = 'radial-gradient(ellipse at 50% 46%, #121B30 0%, #080D19 62%, #04070E 100%)';
export const SCRIM =
	'linear-gradient(180deg, rgba(3,6,10,0.9) 0%, rgba(3,6,10,0.8) 14%, rgba(3,6,10,0.55) 27%, rgba(3,6,10,0.22) 38%, rgba(3,6,10,0.06) 48%, rgba(3,6,10,0.05) 60%, rgba(3,6,10,0.42) 78%, rgba(3,6,10,0.66) 100%)';

// ---- Kurva & fungsi gerak ----

export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 0.8, 0.25);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const LINEAR = (t: number) => t;

/** Progres terjepit 0 → 1 antara frame a dan b. */
export const ramp = (frame: number, a: number, b: number, easing: (t: number) => number = EXPO) =>
	interpolate(frame, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

/** Progres keluar 0 → 1 mulai frame `until` (`Infinity` = tidak keluar). */
export const leave = (frame: number, until: number, dur = 10) =>
	Number.isFinite(until) ? ramp(frame, until, until + dur, EASE_IN) : 0;

/** Gaya teks masuk: naik `rise` px sambil menajam dari blur. */
export const riseIn = (p: number, rise = 22): CSSProperties => ({
	opacity: Math.min(1, p * 1.6),
	transform: `translateY(${(1 - p) * rise}px)`,
	filter: p < 0.999 ? `blur(${(1 - p) * 7}px)` : undefined,
});

/** Denyut halus agar elemen statis tidak beku (QA tblend). */
export const breathe = (frame: number, amp = 4, period = 28) => amp * Math.sin(frame / period);

/** Pola path tergambar progresif (SVG pathLength=1). */
export const draw = (p: number) => ({
	pathLength: 1,
	strokeDasharray: '1 1',
	strokeDashoffset: 1 - Math.min(1, Math.max(0, p)),
});

// ---- Latar & Kanvas ----

export const Hitam: FC<{children: ReactNode}> = ({children}) => (
	<AbsoluteFill style={{background: '#000'}}>{children}</AbsoluteFill>
);

export const Kanvas: FC<{children: ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
	<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', opacity}}>
		{children}
	</svg>
);

/** Kisi titik yang bergeser pelan terus-menerus supaya latar diagram tidak pernah diam > 0,5 dtk. */
export const DriftGrid: FC<{frame: number; id: string; opacity?: number}> = ({frame, id, opacity = 1}) => {
	const S = 40;
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none'}}>
			<defs>
				<pattern
					id={`drift-${id}`}
					width={S}
					height={S}
					patternUnits="userSpaceOnUse"
					patternTransform={`translate(${(frame * 1.4) % S} ${(frame * 0.9) % S})`}
				>
					<circle cx={S / 2} cy={S / 2} r={2.8} fill="rgba(160,175,215,0.34)" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#drift-${id})`} />
		</svg>
	);
};

/** Latar diagram editorial: gradien gelap bernapas halus + kisi titik bergerak. */
export const LatarDiagram: FC<{frame: number; id: string}> = ({frame, id}) => {
	const lx = 50 + 14 * Math.sin(frame / 36);
	const ly = 46 + 10 * Math.cos(frame / 44);
	return (
		<>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse at ${lx.toFixed(1)}% ${ly.toFixed(1)}%, #17233E 0%, #090F1E 62%, #04070E 100%)`,
				}}
			/>
			<DriftGrid frame={frame} id={id} />
		</>
	);
};

// ---- Rekaman & Foto dengan pembingkaian sub-piksel ----

export type Clip = {src: string; fps: number; frames: number};
export type Photo = {src: string; w: number; h: number};

/** Indeks ping-pong halus untuk klip kamera diam yang lebih pendek dari durasi scene. */
export const pingpong = (k: number, total: number) => {
	if (total <= 1) return 0;
	const period = 2 * (total - 1);
	const m = ((k % period) + period) % period;
	return m < total ? m : period - m;
};

export const clipAt = (clip: Clip, frame: number, start = 0, loop = false) => {
	const k = start + Math.max(0, Math.round(frame));
	return loop ? pingpong(k, clip.frames) : Math.min(clip.frames - 1, k);
};

/** Membatasi geser offset agar tepi frame footage tidak keluar saat zoom. */
export const offsetAman = (zoom: number, [ox, oy]: [number, number]): [number, number] => {
	const m = Math.max(0, (zoom - 1) / (2 * zoom) - 0.002);
	return [Math.max(-m, Math.min(m, ox)), Math.max(-m, Math.min(m, oy))];
};

/** Potongan rekaman asli via lensa WebGL (PostFX bersama: grain, vignette, tone mapping). */
export const Shot: FC<{
	src: string;
	time: number;
	opacity?: number;
	zoom?: number;
	offset?: [number, number];
	exposure?: number;
	tint?: [number, number, number];
	bloom?: number;
	saturation?: number;
}> = ({src, time, opacity = 1, zoom = 1, offset = [0, 0], exposure = 1.0, tint = [1, 1, 1], bloom = 0.2, saturation = 0}) =>
	opacity <= 0.001 ? null : (
		<AbsoluteFill style={{opacity}}>
			<Stage>
				<color attach="background" args={['#000']} />
				<CameraRig position={[0, 0, 0]} lookAt={[0, 0, -1]} fov={40} near={0.05} far={100} />
				<FootagePlane src={src} time={Math.max(0, time)} distance={10} fov={40} zoom={zoom} offset={offset} exposure={exposure} tint={tint} />
				<PostFX bloom={bloom} bloomThreshold={0.95} grain={0.24} vignette={0.62} toneMapping="agx" saturation={saturation} />
			</Stage>
		</AbsoluteFill>
	);

export const Rekaman: FC<{
	clip: Clip;
	n: number;
	zoom?: number;
	offset?: [number, number];
	dim?: number;
	exposure?: number;
	saturation?: number;
	bloom?: number;
	scrim?: number;
}> = ({clip, n, zoom = 1.06, offset = [0, 0], dim = 0.25, exposure = 1.0, saturation = -0.1, bloom = 0.12, scrim = 1}) => (
	<>
		<Shot src={clip.src} time={(n + 0.25) / clip.fps} zoom={zoom} offset={offset} exposure={exposure} saturation={saturation} bloom={bloom} />
		{dim > 0 ? <AbsoluteFill style={{background: `rgba(3,6,10,${Math.min(0.95, dim)})`}} /> : null}
		{scrim > 0 ? <AbsoluteFill style={{background: SCRIM, opacity: scrim}} /> : null}
	</>
);

export const photoBox = (photo: Photo, zoom: number, focus: [number, number]) => {
	const s = Math.max(1080 / photo.w, 1920 / photo.h) * zoom;
	const left = Math.min(0, Math.max(1080 - photo.w * s, 540 - focus[0] * photo.w * s));
	const top = Math.min(0, Math.max(1920 - photo.h * s, 960 - focus[1] * photo.h * s));
	return {s, left, top};
};

export const fotoPt = (photo: Photo, zoom: number, focus: [number, number], [x, y]: [number, number]): [number, number] => {
	const {s, left, top} = photoBox(photo, zoom, focus);
	return [left + x * s, top + y * s];
};

/** Geser/skala via transform GPU agar dorongan lambat bebas patah-patah sub-piksel. */
export const SubpixelImg: FC<{src: string; w: number; h: number; x: number; y: number; s: number; filter?: string; style?: CSSProperties}> = ({
	src,
	w,
	h,
	x,
	y,
	s,
	filter,
	style,
}) => (
	<Img
		src={staticFile(src)}
		style={{
			position: 'absolute',
			left: 0,
			top: 0,
			width: w,
			height: h,
			maxWidth: 'none',
			transform: `translate3d(${x}px, ${y}px, 0) scale(${s})`,
			transformOrigin: '0 0',
			willChange: 'transform',
			filter,
			...style,
		}}
	/>
);

export const Foto: FC<{photo: Photo; zoom: number; focus: [number, number]; dim?: number; scrim?: number; filter?: string}> = ({
	photo,
	zoom,
	focus,
	dim = 0,
	scrim = 1,
	filter,
}) => {
	const {s, left, top} = photoBox(photo, zoom, focus);
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<SubpixelImg src={photo.src} w={photo.w} h={photo.h} x={left} y={top} s={s} filter={filter} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)'}} />
			{dim > 0 ? <AbsoluteFill style={{background: `rgba(3,6,10,${Math.min(0.95, dim)})`}} /> : null}
			{scrim > 0 ? <AbsoluteFill style={{background: SCRIM, opacity: scrim}} /> : null}
		</AbsoluteFill>
	);
};

// ---- Tipografi & anotasi editorial ----

/** Tag solid bergaya cetak editorial (bukan pil kaca/bercahaya), muncul menyapu kiri -> kanan. */
export const SolidTag: FC<{p: number; color: string; children: ReactNode; size?: number}> = ({p, color, children, size = 24}) =>
	p <= 0.001 ? null : (
		<span
			style={{
				display: 'inline-block',
				padding: '6px 13px 5px',
				borderRadius: 5,
				background: color,
				color: '#0A0D14',
				fontSize: size,
				fontWeight: 800,
				letterSpacing: '0.12em',
				lineHeight: 1.1,
				textShadow: 'none',
				boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
				clipPath: `inset(0 ${(1 - Math.min(1, p)) * 100}% 0 0 round 5px)`,
				transform: `translateX(${(1 - Math.min(1, p)) * -10}px)`,
			}}
		>
			{children}
		</span>
	);

/** Garis bawah warna yang tergambar dari kiri ke kanan di bawah teks. */
export const Sorot: FC<{p: number; color?: string; children: ReactNode; style?: CSSProperties}> = ({p, color = colors.aha, children, style}) => (
	<span style={{position: 'relative', display: 'inline', ...style}}>
		{children}
		{p > 0.001 ? (
			<span
				style={{
					position: 'absolute',
					left: -2,
					right: -2,
					bottom: -5,
					height: 7,
					borderRadius: 4,
					background: color,
					transform: `scaleX(${Math.min(1, p)})`,
					transformOrigin: 'left center',
				}}
			/>
		) : null}
	</span>
);

/** Label kecil ILUSTRASI / SKEMA (minimal 26 px agar terbaca di layar HP). */
export const Label: FC<{p?: number; children?: ReactNode; style?: CSSProperties}> = ({p = 1, children = 'ILUSTRASI', style}) =>
	p <= 0.001 ? null : (
		<div
			style={{
				position: 'absolute',
				fontSize: 26,
				fontWeight: 800,
				letterSpacing: '0.14em',
				color: 'rgba(244,241,234,0.68)',
				textShadow: SHADOW,
				opacity: Math.min(1, p * 1.6),
				...style,
			}}
		>
			{children}
		</div>
	);

export const Kepala: FC<{p: number; tag: ReactNode; color?: string; children?: ReactNode; y?: number; size?: number}> = ({
	p,
	tag,
	color = colors.aha,
	children,
	y = 262,
	size = 28,
}) =>
	p <= 0.001 ? null : (
		<div style={{position: 'absolute', left: 70, right: 130, top: y, display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 14, rowGap: 8, textShadow: SHADOW, ...riseIn(p, 8)}}>
			<span style={{flexShrink: 0}}>
				<SolidTag p={p} color={color} size={size}>
					{tag}
				</SolidTag>
			</span>
			{children ? <span style={{fontSize: size, fontWeight: 700, color: 'rgba(244,241,234,0.88)'}}>{children}</span> : null}
		</div>
	);

export const Baris: FC<{
	p: number;
	x?: number;
	y: number;
	size?: number;
	color?: string;
	weight?: number;
	children: ReactNode;
	style?: CSSProperties;
	right?: number;
}> = ({p, x = 70, y, size = 32, color = colors.ink, weight = 800, children, style, right = 130}) =>
	p <= 0.001 ? null : (
		<div style={{position: 'absolute', left: x, right, top: y, fontSize: size, fontWeight: weight, lineHeight: 1.24, color, textShadow: SHADOW, ...riseIn(p, 10), ...style}}>
			{children}
		</div>
	);

export const KetFoto: FC<{tag?: ReactNode; children: ReactNode; p?: number; y?: number}> = ({tag, children, p = 1, y = 1452}) =>
	p <= 0.001 ? null : (
		<div style={{position: 'absolute', left: 70, right: 130, top: y, display: 'flex', alignItems: 'center', gap: 12, opacity: Math.min(1, p * 1.6), textShadow: SHADOW}}>
			{tag ? (
				<span style={{flexShrink: 0}}>
					<SolidTag p={1} color={RESMI} size={26}>
						{tag}
					</SolidTag>
				</span>
			) : null}
			<span style={{fontSize: 27, fontWeight: 700, color: 'rgba(244,241,234,0.9)', lineHeight: 1.2}}>{children}</span>
		</div>
	);

export const Coret: FC<{p: number; color?: string; top?: string; height?: number}> = ({p, color = NO, top = '54%', height = 9}) =>
	p <= 0.001 ? null : (
		<span
			style={{
				position: 'absolute',
				left: -8,
				right: -8,
				top,
				height,
				marginTop: -height / 2,
				background: color,
				borderRadius: height / 2,
				transform: `scaleX(${Math.min(1, p)}) rotate(-1.4deg)`,
				transformOrigin: 'left center',
				boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
			}}
		/>
	);

export const Panah: FC<{x1: number; y1: number; x2: number; y2: number; p: number; color?: string; width?: number; dash?: boolean}> = ({
	x1,
	y1,
	x2,
	y2,
	p,
	color = GARIS,
	width = 4,
	dash = false,
}) => {
	if (p <= 0.001) return null;
	const q = Math.min(1, p);
	const xe = mix(q, x1, x2);
	const ye = mix(q, y1, y2);
	const ang = Math.atan2(y2 - y1, x2 - x1);
	const h = 16;
	const a1 = ang + Math.PI * 0.82;
	const a2 = ang - Math.PI * 0.82;
	return (
		<Kanvas>
			<line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash ? '10 9' : undefined} />
			{q > 0.98 ? <path d={`M ${xe + Math.cos(a1) * h} ${ye + Math.sin(a1) * h} L ${xe} ${ye} L ${xe + Math.cos(a2) * h} ${ye + Math.sin(a2) * h}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" /> : null}
		</Kanvas>
	);
};

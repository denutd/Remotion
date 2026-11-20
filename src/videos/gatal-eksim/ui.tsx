import type {CSSProperties, FC, ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Pemutar video footage vertikal 9:16 (720x1280) yang di-scale ke 1080x1920
 * dengan overlay gradient gelap halus agar teks & grafik kontras.
 */
export const VideoBackground: FC<{
	assetName: string;
	startFrom?: number;
	playbackRate?: number;
	overlayOpacity?: number;
	zoom?: boolean;
}> = ({assetName, startFrom = 0, playbackRate = 1, overlayOpacity = 0.45, zoom = true}) => {
	const frame = useCurrentFrame();
	const scale = zoom ? interpolate(frame, [0, 300], [1, 1.06], {extrapolateRight: 'clamp'}) : 1;

	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#0a0d14'}}>
			<OffthreadVideo
				src={staticFile(`assets/eksim/${assetName}`)}
				startFrom={startFrom}
				playbackRate={playbackRate}
				muted
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${scale})`,
				}}
			/>
			{/* Gradient halus di atas dan bawah untuk keterbacaan teks & safe zone */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, rgba(8,11,18,${overlayOpacity * 0.95}) 0%, rgba(8,11,18,0.2) 28%, rgba(8,11,18,0.35) 60%, rgba(8,11,18,${overlayOpacity * 1.15}) 100%)`,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};

/**
 * Penampil foto dengan efek gerak sinematik halus (Ken Burns).
 */
export const PhotoKenBurns: FC<{
	assetName: string;
	overlayOpacity?: number;
	direction?: 'zoom-in' | 'zoom-out' | 'pan-left';
}> = ({assetName, overlayOpacity = 0.4, direction = 'zoom-in'}) => {
	const frame = useCurrentFrame();

	const scale =
		direction === 'zoom-in'
			? interpolate(frame, [0, 240], [1, 1.08], {extrapolateRight: 'clamp'})
			: direction === 'zoom-out'
			? interpolate(frame, [0, 240], [1.08, 1], {extrapolateRight: 'clamp'})
			: 1.05;

	const translateX =
		direction === 'pan-left'
			? interpolate(frame, [0, 240], [0, -30], {extrapolateRight: 'clamp'})
			: 0;

	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#0a0d14'}}>
			<Img
				src={staticFile(`assets/eksim/${assetName}`)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${scale}) translateX(${translateX}px)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, rgba(8,11,18,${overlayOpacity * 0.95}) 0%, rgba(8,11,18,0.2) 28%, rgba(8,11,18,0.35) 60%, rgba(8,11,18,${overlayOpacity * 1.15}) 100%)`,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};

/**
 * Badge Editorial Mengambang di Area Atas (Safe Zone)
 */
export const EditorialBadge: FC<{
	tag: string;
	headline: string;
	accentColor?: string;
	delay?: number;
	animated?: boolean;
}> = ({tag, headline, accentColor = '#38bdf8', delay = 0, animated = true}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: Math.max(0, frame - delay),
		fps,
		config: {damping: 18, stiffness: 140},
	});

	const opacity = animated ? interpolate(progress, [0, 1], [0, 1]) : 1;
	const translateY = animated ? interpolate(progress, [0, 1], [30, 0]) : 0;

	return (
		<div
			style={{
				position: 'absolute',
				top: 190,
				left: 60,
				right: 60,
				opacity,
				transform: `translateY(${translateY}px)`,
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				zIndex: 20,
			}}
		>
			<div
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					alignSelf: 'flex-start',
					padding: '8px 18px',
					borderRadius: 30,
					backgroundColor: 'rgba(15, 23, 42, 0.88)',
					border: `1.5px solid ${accentColor}`,
					boxShadow: `0 4px 20px ${accentColor}33`,
				}}
			>
				<span
					style={{
						color: accentColor,
						fontSize: 22,
						fontWeight: 800,
						letterSpacing: 1.5,
						textTransform: 'uppercase',
					}}
				>
					{tag}
				</span>
			</div>
			<div
				style={{
					fontSize: 40,
					fontWeight: 800,
					color: '#f8fafc',
					lineHeight: 1.25,
					textShadow: '0 3px 14px rgba(0,0,0,0.85)',
					maxWidth: 820,
				}}
			>
				{headline}
			</div>
		</div>
	);
};

/**
 * Card Callout / Highlight Elegan
 * Default ditaruh di area tengah (top: 480 s/d 1100), sehingga TIDAK menabrak Captions (y: 1335).
 */
export const FloatingCard: FC<{
	children: ReactNode;
	delay?: number;
	top?: number;
	bottom?: number;
	borderColor?: string;
	style?: CSSProperties;
	animated?: boolean;
}> = ({children, delay = 0, top = 520, bottom, borderColor = 'rgba(255,255,255,0.15)', style, animated = true}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({
		frame: Math.max(0, frame - delay),
		fps,
		config: {damping: 18, stiffness: 120},
	});

	const opacity = animated ? interpolate(enter, [0, 1], [0, 1]) : 1;
	const translateY = animated ? interpolate(enter, [0, 1], [30, 0]) : 0;

	return (
		<div
			style={{
				position: 'absolute',
				...(bottom !== undefined ? {bottom} : {top}),
				left: 48,
				right: 48,
				padding: '28px 32px',
				borderRadius: 26,
				backgroundColor: 'rgba(15, 23, 42, 0.94)',
				backdropFilter: 'blur(18px)',
				border: `2px solid ${borderColor}`,
				boxShadow: '0 20px 50px rgba(0,0,0,0.75)',
				opacity,
				transform: `translateY(${translateY}px)`,
				zIndex: 25,
				...style,
			}}
		>
			{children}
		</div>
	);
};

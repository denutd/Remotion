import type {FC} from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Pemutar video footage vertikal 9:16 yang di-scale ke 1080x1920
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
		config: {damping: 15, stiffness: 140},
	});

	const opacity = animated ? (frame < delay ? 0 : interpolate(progress, [0, 1], [0, 1])) : 1;
	const translateY = animated ? (frame < delay ? -20 : interpolate(progress, [0, 1], [-20, 0])) : 0;

	return (
		<div
			style={{
				position: 'absolute',
				top: 140,
				left: 48,
				right: 48,
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				opacity,
				transform: `translateY(${translateY}px)`,
				zIndex: 20,
			}}
		>
			<div
				style={{
					alignSelf: 'flex-start',
					padding: '8px 18px',
					borderRadius: 999,
					backgroundColor: 'rgba(15, 23, 42, 0.75)',
					border: `1.5px solid ${accentColor}55`,
					boxShadow: `0 4px 16px rgba(0,0,0,0.35)`,
					backdropFilter: 'blur(10px)',
					color: accentColor,
					fontSize: 26,
					fontWeight: 800,
					letterSpacing: 1.2,
					textTransform: 'uppercase',
				}}
			>
				{tag}
			</div>
			<div
				style={{
					color: '#ffffff',
					fontSize: 44,
					fontWeight: 800,
					lineHeight: 1.15,
					letterSpacing: -0.5,
					textShadow: '0 3px 12px rgba(0,0,0,0.8)',
				}}
			>
				{headline}
			</div>
		</div>
	);
};

/**
 * Kartu Penjelasan / Callout Mengambang
 */
export const FloatingCard: FC<{
	title: string;
	body: string;
	icon?: string;
	accentColor?: string;
	bottom?: number;
	delay?: number;
	animated?: boolean;
}> = ({title, body, icon = '💡', accentColor = '#38bdf8', bottom = 240, delay = 0, animated = true}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: Math.max(0, frame - delay),
		fps,
		config: {damping: 14, stiffness: 120},
	});

	const opacity = animated ? (frame < delay ? 0 : interpolate(progress, [0, 1], [0, 1])) : 1;
	const translateY = animated ? (frame < delay ? 30 : interpolate(progress, [0, 1], [30, 0])) : 0;

	return (
		<div
			style={{
				position: 'absolute',
				bottom,
				left: 48,
				right: 48,
				padding: '28px 32px',
				borderRadius: 24,
				backgroundColor: 'rgba(15, 23, 42, 0.88)',
				border: `2px solid ${accentColor}55`,
				boxShadow: `0 16px 36px rgba(0,0,0,0.5), 0 0 20px ${accentColor}25`,
				backdropFilter: 'blur(16px)',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'flex-start',
				gap: 20,
				opacity,
				transform: `translateY(${translateY}px)`,
				zIndex: 20,
			}}
		>
			<div
				style={{
					fontSize: 46,
					lineHeight: 1,
					filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
				}}
			>
				{icon}
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 8, flex: 1}}>
				<div
					style={{
						color: accentColor,
						fontSize: 28,
						fontWeight: 800,
						letterSpacing: 1.5,
						textTransform: 'uppercase',
					}}
				>
					{title}
				</div>
				<div
					style={{
						color: '#ffffff',
						fontSize: 34,
						fontWeight: 700,
						lineHeight: 1.35,
						textShadow: '0 2px 8px rgba(0,0,0,0.6)',
					}}
				>
					{body}
				</div>
			</div>
		</div>
	);
};

/**
 * Efek Suara SFX
 */
export const Sfx: FC<{
	src: string;
	volume?: number;
}> = ({src, volume = 0.3}) => {
	return <Audio src={staticFile(`sfx/${src}`)} volume={volume} />;
};

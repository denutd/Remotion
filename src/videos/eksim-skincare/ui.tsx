import type {FC} from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Background Video footage
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
 * Background Photo dengan Ken Burns
 */
export const PhotoKenBurns: FC<{
	assetName: string;
	overlayOpacity?: number;
	direction?: 'zoom-in' | 'zoom-out' | 'pan-left';
}> = ({assetName, overlayOpacity = 0.45, direction = 'zoom-in'}) => {
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
 * Motion Graphic 1: Holographic HUD Scanner Line
 */
export const ScannerHUD: FC<{delay?: number}> = ({delay = 0}) => {
	const frame = useCurrentFrame();
	const activeFrame = Math.max(0, frame - delay);
	const scanY = (activeFrame % 90) / 90; // 0 to 1 loop every 3s
	const lineTop = interpolate(scanY, [0, 1], [300, 1500]);
	const opacity = frame < delay ? 0 : interpolate(activeFrame, [0, 15], [0, 0.85], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity, zIndex: 15}}>
			{/* Scan line */}
			<div
				style={{
					position: 'absolute',
					top: lineTop,
					left: 48,
					right: 48,
					height: 3,
					background: 'linear-gradient(90deg, rgba(56,189,248,0) 0%, rgba(56,189,248,1) 50%, rgba(56,189,248,0) 100%)',
					boxShadow: '0 0 16px #38bdf8, 0 0 32px #0284c7',
				}}
			/>
			{/* Scan beam gradient */}
			<div
				style={{
					position: 'absolute',
					top: lineTop - 120,
					left: 48,
					right: 48,
					height: 120,
					background: 'linear-gradient(180deg, rgba(56,189,248,0) 0%, rgba(56,189,248,0.18) 100%)',
				}}
			/>
			{/* Crosshair tag */}
			<div
				style={{
					position: 'absolute',
					top: lineTop + 12,
					right: 56,
					backgroundColor: 'rgba(15,23,42,0.85)',
					border: '1px solid #38bdf8',
					borderRadius: 6,
					padding: '4px 10px',
					color: '#38bdf8',
					fontSize: 20,
					fontWeight: 800,
					letterSpacing: 1.5,
					fontFamily: 'monospace',
				}}
			>
				SCAN: EPIDERMIS LOSS
			</div>
		</AbsoluteFill>
	);
};

/**
 * Motion Graphic 2: Hexagonal Shield Grid (Pelindung Skin Barrier)
 */
export const HexShieldGrid: FC<{delay?: number}> = ({delay = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const progress = spring({
		frame: Math.max(0, frame - delay),
		fps,
		config: {damping: 14, stiffness: 100},
	});
	const opacity = frame < delay ? 0 : interpolate(progress, [0, 1], [0, 0.9]);
	const scale = frame < delay ? 0.8 : interpolate(progress, [0, 1], [0.85, 1]);

	return (
		<div
			style={{
				position: 'absolute',
				top: '36%',
				left: '50%',
				transform: `translate(-50%, -50%) scale(${scale})`,
				opacity,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 16,
				pointerEvents: 'none',
				zIndex: 16,
			}}
		>
			<div
				style={{
					display: 'flex',
					gap: 14,
				}}
			>
				{['SHIELD 01', 'CERAMIDE', 'LIPID LOCK'].map((txt, idx) => (
					<div
						key={txt}
						style={{
							width: 170,
							height: 100,
							borderRadius: 16,
							background: 'rgba(56, 189, 248, 0.15)',
							border: '2px solid rgba(56, 189, 248, 0.8)',
							boxShadow: '0 0 24px rgba(56, 189, 248, 0.35)',
							backdropFilter: 'blur(8px)',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 6,
							color: '#ffffff',
							fontWeight: 800,
							fontSize: 22,
							letterSpacing: 1,
							transform: `translateY(${idx === 1 ? -16 : 8}px)`,
						}}
					>
						<span style={{fontSize: 28}}>🛡️</span>
						<span>{txt}</span>
					</div>
				))}
			</div>
		</div>
	);
};

/**
 * Motion Graphic 3: Keranjang Kuning TikTok/Reels Affiliate Widget
 */
export const KeranjangKuningWidget: FC<{delay?: number; animated?: boolean}> = ({delay = 0, animated = true}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = spring({
		frame: Math.max(0, frame - delay),
		fps,
		config: {damping: 12, stiffness: 130},
	});

	// Bouncing subtle pulse
	const bounce = animated ? Math.sin((frame - delay) * 0.18) * 6 : 0;
	const opacity = animated ? (frame < delay ? 0 : interpolate(progress, [0, 1], [0, 1])) : 1;
	const translateY = animated ? (frame < delay ? 40 : interpolate(progress, [0, 1], [40, 0]) + bounce) : 0;

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 220,
				left: 48,
				right: 48,
				padding: '24px 30px',
				borderRadius: 24,
				background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.95) 0%, rgba(202, 138, 4, 0.95) 100%)',
				border: '2.5px solid #fef08a',
				boxShadow: '0 16px 40px rgba(202, 138, 4, 0.5), 0 0 25px rgba(254, 240, 138, 0.6)',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 18,
				opacity,
				transform: `translateY(${translateY}px)`,
				zIndex: 25,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				<div
					style={{
						width: 68,
						height: 68,
						borderRadius: 18,
						backgroundColor: '#ffffff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 38,
						boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
					}}
				>
					🛒
				</div>
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<span
						style={{
							color: '#713f12',
							fontSize: 22,
							fontWeight: 800,
							letterSpacing: 1.2,
							textTransform: 'uppercase',
						}}
					>
						CEK SEKARANG JUGA
					</span>
					<span
						style={{
							color: '#000000',
							fontSize: 34,
							fontWeight: 900,
							lineHeight: 1.15,
						}}
					>
						Klik Keranjang Kuning 👇
					</span>
				</div>
			</div>
			<div
				style={{
					fontSize: 38,
					color: '#000000',
					fontWeight: 900,
				}}
			>
				👉
			</div>
		</div>
	);
};

/**
 * Editorial Badge Atas
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
 * Floating Callout Card
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
 * SFX Audio Component
 */
export const Sfx: FC<{
	src: string;
	volume?: number;
}> = ({src, volume = 0.3}) => {
	return <Audio src={staticFile(`sfx/${src}`)} volume={volume} />;
};

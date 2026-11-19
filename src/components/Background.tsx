import type {FC} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {colors, H, W} from '../brand/theme';

const STARS = Array.from({length: 110}, (_, i) => ({
	x: random(`star-x-${i}`) * W,
	y: random(`star-y-${i}`) * H,
	r: 0.6 + random(`star-r-${i}`) * 1.4,
	o: 0.1 + random(`star-o-${i}`) * 0.35,
	p: random(`star-p-${i}`) * Math.PI * 2,
}));

export const Background: FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(110% 75% at 50% 36%, ${colors.bgLift} 0%, ${colors.bg} 65%)`,
			}}
		>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				{STARS.map((s, i) => (
					<circle
						key={i}
						cx={s.x}
						cy={s.y}
						r={s.r}
						fill="#DCE6FF"
						opacity={s.o * (0.75 + 0.25 * Math.sin(frame / 24 + s.p))}
					/>
				))}
			</svg>
			{/* Grain halus: mencegah banding pada gradasi gelap setelah kompresi video. */}
			<svg
				width={W}
				height={H}
				style={{position: 'absolute', inset: 0, opacity: 0.06, mixBlendMode: 'overlay'}}
			>
				<filter id="bg-grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
				</filter>
				<rect width="100%" height="100%" filter="url(#bg-grain)" />
			</svg>
		</AbsoluteFill>
	);
};

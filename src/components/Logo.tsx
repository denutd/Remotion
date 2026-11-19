import type {FC} from 'react';
import {interpolateColors} from 'remotion';
import {channel, colors} from '../brand/theme';

const DIM = '#26305A';

/**
 * Logotype channel dari `src/brand/theme.ts`.
 * `letterT(i)` (0→1) menentukan kapan huruf ke-i menyala.
 */
export const Logo: FC<{
	fontSize: number;
	letterT: (i: number) => number;
	text?: string;
	highlightPrefix?: number;
}> = ({fontSize, letterT, text = channel.name, highlightPrefix = channel.highlightPrefix}) => {
	if (!text) return null;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'baseline',
				fontSize,
				fontWeight: 800,
				letterSpacing: '-0.02em',
				lineHeight: 1,
			}}
		>
			{text.split('').map((ch, i) => {
				const t = letterT(i);
				const lit = Math.min(1, Math.max(0, t));
				const bump = Math.sin(Math.PI * lit);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							color: interpolateColors(lit, [0, 1], [DIM, i < highlightPrefix ? colors.aha : colors.ink]),
							transform: `translateY(${-0.06 * fontSize * bump}px) scale(${1 + 0.12 * bump})`,
							transformOrigin: '50% 85%',
						}}
					>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

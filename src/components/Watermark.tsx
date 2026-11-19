import type {FC} from 'react';
import {fontFamily} from '../brand/fonts';
import {channel, colors, layout} from '../brand/theme';

/**
 * Watermark channel di kiri atas, di bawah area UI aplikasi TikTok/Reels/Shorts.
 * Mengambil nama handle otomatis dari `channel` di `src/brand/theme.ts`.
 */
export const Watermark: FC<{opacity?: number}> = ({opacity = 0.7}) => {
	if (!channel.handle) return null;
	const raw = channel.handle.startsWith('@') ? channel.handle.slice(1) : channel.handle;
	const prefix = raw.slice(0, channel.highlightPrefix);
	const rest = raw.slice(channel.highlightPrefix);
	return (
		<div
			style={{
				position: 'absolute',
				left: layout.watermarkX,
				top: layout.watermarkY,
				transform: 'translateY(-50%)',
				display: 'flex',
				alignItems: 'baseline',
				fontFamily,
				fontSize: 34,
				fontWeight: 800,
				letterSpacing: '-0.01em',
				lineHeight: 1,
				opacity,
				textShadow: '0 0 2px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.6), 0 2px 14px rgba(0,0,0,0.5)',
				pointerEvents: 'none',
			}}
		>
			<span style={{color: colors.ink, opacity: 0.8, marginRight: 1}}>@</span>
			<span style={{color: colors.aha}}>{prefix}</span>
			<span style={{color: colors.ink}}>{rest}</span>
		</div>
	);
};

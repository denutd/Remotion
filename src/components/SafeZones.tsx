import type {FC} from 'react';
import {AbsoluteFill} from 'remotion';
import {layout} from '../brand/theme';

/** Overlay QA (--debug): area merah tertutup UI TikTok/Reels/Shorts (jangan taruh teks penting di sini). */
export const SafeZones: FC = () => {
	const zone = {position: 'absolute', background: 'rgba(255, 40, 80, 0.28)'} as const;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{...zone, left: 0, right: 0, top: 0, height: layout.safeTop}} />
			<div style={{...zone, left: 0, right: 0, top: layout.safeBottom, bottom: 0}} />
			<div style={{...zone, left: layout.safeRight, right: 0, top: 900, height: layout.safeBottom - 900}} />
		</AbsoluteFill>
	);
};

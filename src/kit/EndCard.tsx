import {Fragment, type FC, type ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {channel, colors, layout, W} from '../brand/theme';
import {Logo} from '../components/Logo';
import {enter, mix} from '../lib/anim';
import type {Beat} from '../lib/beats';

/**
 * Penutup ringkas (template retensi). Dipasang di ATAS visual terakhir yang tetap bergerak sampai
 * detik terakhir (tanpa memotong ke kartu hitam polos), disertai sumber & kredit wajib.
 * Pasangkan dengan `export const tail = 0.5` di script.ts agar durasi penutup rapat.
 */
export const EndCard: FC<{
	beat: Beat;
	sources: string[];
	credit: ReactNode;
	y?: number;
	size?: number;
	/** Opsional: frame [awal, tengah, akhir] untuk menyalakan huruf logo jika ada */
	cues?: [number, number, number];
}> = ({beat, sources, credit, y = 860, size = 104, cues}) => {
	const frame = useCurrentFrame();

	const safe = (word: string, fallback: number) => {
		try {
			return beat(word);
		} catch {
			return fallback;
		}
	};

	const bStart = cues ? cues[0] : safe('Oh', 0);
	const bMid = cues ? cues[1] : safe('gitu', 6);
	const bEnd = cues ? cues[2] : safe('ternyata', 12);
	const len = channel.name.length;

	const letterT = (i: number) => {
		if (i < channel.highlightPrefix) {
			const span = Math.max(1, channel.highlightPrefix);
			const tAt = i < span / 2 ? bStart : bMid;
			return enter(frame, tAt - 2 + (i % 2) * 2, 10);
		}
		const rest = Math.max(1, len - channel.highlightPrefix);
		return enter(frame, bEnd - 2 + ((i - channel.highlightPrefix) / rest) * 8, 9);
	};

	const scrim = enter(frame, bStart - 8, 14);
	const logoIn = enter(frame, bStart - 4, 12);
	const cta = enter(frame, bEnd, 12);
	const src = enter(frame, bStart, 14);

	return (
		<AbsoluteFill>
			{/* Bayangan lembut di tengah jika ada logo */}
			{channel.name ? (
				<AbsoluteFill
					style={{
						background: `radial-gradient(ellipse 70% 30% at 50% ${(y / 1920) * 100}%, rgba(2,4,9,0.72), rgba(2,4,9,0.38) 55%, rgba(2,4,9,0) 100%)`,
						opacity: scrim,
					}}
				/>
			) : null}
			{/* Gelap dari bawah untuk blok sumber. */}
			<AbsoluteFill
				style={{
					background: 'linear-gradient(180deg, rgba(2,4,9,0) 55%, rgba(2,4,9,0.62) 66%, rgba(2,4,9,0.7) 80%, rgba(2,4,9,0.4) 100%)',
					opacity: src,
				}}
			/>
			{channel.name ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: y,
						display: 'flex',
						justifyContent: 'center',
						transform: `translateY(-50%) scale(${mix(logoIn, 0.96, 1)})`,
						opacity: logoIn,
						textShadow: '0 4px 24px rgba(0,0,0,0.55)',
					}}
				>
					<Logo fontSize={size} letterT={letterT} />
				</div>
			) : null}
			{channel.handle ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: y + size * 0.85,
						textAlign: 'center',
						fontSize: 34,
						fontWeight: 700,
						color: 'rgba(244,241,234,0.78)',
						opacity: cta,
						transform: `translateY(${mix(cta, 10, 0)}px)`,
						textShadow: '0 2px 12px rgba(0,0,0,0.7)',
					}}
				>
					follow <span style={{color: colors.ink}}>{channel.handle}</span>
				</div>
			) : null}
			<div
				style={{
					position: 'absolute',
					left: W - layout.safeRight,
					right: W - layout.safeRight,
					top: 1240,
					textAlign: 'center',
					fontSize: 26,
					fontWeight: 600,
					lineHeight: 1.45,
					color: 'rgba(244,241,234,0.86)',
					opacity: src,
					textShadow: '0 2px 10px rgba(0,0,0,0.8)',
					textWrap: 'balance',
				}}
			>
				Sumber:{' '}
				{sources.map((s, i) => (
					<Fragment key={s}>
						<span style={{whiteSpace: 'nowrap'}}>{s}</span>
						{i < sources.length - 1 ? ' · ' : ''}
					</Fragment>
				))}
				<br />
				{credit}
			</div>
		</AbsoluteFill>
	);
};

import type {FC} from 'react';
import {colors} from '../../brand/theme';
import {
	breathe,
	DriftGrid,
	LatarDiagram,
	MONO,
	NO,
	OK,
	RESMI,
	riseIn,
	SHADOW,
	SolidTag,
	Sorot,
} from '../../kit/Editorial';
import {mix} from '../../lib/anim';

export {breathe, DriftGrid, LatarDiagram, MONO, NO, OK, RESMI, riseIn, SHADOW, SolidTag, Sorot};

export const KERTAS = '#F3EFE6';
export const KERTAS_GARIS = '#26325A';
export const KERTAS_INK = '#141A2B';

/** Judul frame 0 & sampul: klaim lengkap tampil di atas safe zone (y = 262). */
export const HookTitle: FC<{
	y?: number;
	sorot210?: number;
	sorot297?: number;
	sampul?: boolean;
}> = ({y = 262, sorot210 = 0, sorot297 = 0, sampul = false}) => (
	<div style={{position: 'absolute', left: 70, right: 130, top: y, textShadow: SHADOW}}>
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
			<SolidTag p={1} color={colors.aha} size={26}>
				SAINS &amp; DESAIN
			</SolidTag>
			<SolidTag p={1} color={RESMI} size={24}>
				ISO 216 · DIN 476
			</SolidTag>
		</div>
		<div
			style={{
				marginTop: 20,
				fontSize: sampul ? 86 : 74,
				fontWeight: 800,
				lineHeight: 1.02,
				letterSpacing: '-0.03em',
				color: colors.ink,
			}}
		>
			KENAPA KERTAS <span style={{color: colors.aha}}>A4</span>
			<br />
			UKURANNYA NGGAK BULAT?
		</div>
		<div
			style={{
				marginTop: 18,
				fontFamily: MONO,
				fontSize: sampul ? 64 : 58,
				fontWeight: 700,
				lineHeight: 1.1,
				color: colors.ink,
			}}
		>
			<Sorot p={sorot210} color={colors.aha}>
				210
			</Sorot>{' '}
			×{' '}
			<Sorot p={sorot297} color={colors.neutrino}>
				297
			</Sorot>{' '}
			<span style={{fontSize: 38, color: 'rgba(244,241,234,0.8)'}}>mm</span>
		</div>
		{sampul ? (
			<div style={{marginTop: 22, fontSize: 34, fontWeight: 700, lineHeight: 1.25, color: OK}}>
				rahasianya ada di rasio 1 : √2
			</div>
		) : null}
	</div>
);

/** Kartu kertas A4 sederhana dengan anotasi dimensi (ukuran piksel layar). */
export const LembarA4: FC<{
	cx: number;
	cy: number;
	w: number;
	h: number;
	p: number;
	frame: number;
	lipat?: number;
}> = ({cx, cy, w, h, p, frame, lipat = 0}) => {
	if (p <= 0.001) return null;
	const dy = breathe(frame, 5, 30);
	const x = cx - w / 2;
	const y = cy - h / 2 + dy;
	return (
		<g opacity={Math.min(1, p * 1.5)} transform={`translate(0 ${(1 - p) * 20})`}>
			{/* Bayangan lembar kertas */}
			<rect x={x + 12} y={y + 18} width={w} height={h} rx={8} fill="rgba(0,0,0,0.45)" />
			{/* Badan kertas */}
			<rect x={x} y={y} width={w} height={h} rx={8} fill={KERTAS} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
			{/* Garis kisi halus di kertas */}
			<line x1={x + 28} y1={y + 72} x2={x + w - 28} y2={y + 72} stroke="rgba(20,26,43,0.12)" strokeWidth={2} />
			<line x1={x + 28} y1={y + 114} x2={x + w - 90} y2={y + 114} stroke="rgba(20,26,43,0.12)" strokeWidth={2} />
			{/* Label A4 */}
			<text
				x={cx}
				y={cy + dy + 14}
				textAnchor="middle"
				fontFamily={MONO}
				fontWeight={700}
				fontSize={58}
				fill={KERTAS_INK}
			>
				A4
			</text>
			<text
				x={cx}
				y={cy + dy + 56}
				textAnchor="middle"
				fontFamily={MONO}
				fontWeight={500}
				fontSize={28}
				fill="#4B5570"
			>
				1 : 1,414
			</text>
			{/* Garis lipat tengah */}
			{lipat > 0.001 ? (
				<line
					x1={x}
					y1={cy + dy}
					x2={mix(lipat, x, x + w)}
					y2={cy + dy}
					stroke={colors.aha}
					strokeWidth={5}
					strokeDasharray="12 8"
				/>
			) : null}
			{/* Dimensi lebar (atas) */}
			<line x1={x} y1={y - 24} x2={x + w} y2={y - 24} stroke={colors.aha} strokeWidth={3} />
			<text x={cx} y={y - 38} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill={colors.aha}>
				210 mm
			</text>
			{/* Dimensi tinggi (kanan) */}
			<line x1={x + w + 24} y1={y} x2={x + w + 24} y2={y + h} stroke={colors.neutrino} strokeWidth={3} />
			<text
				x={x + w + 42}
				y={cy + dy + 10}
				fontFamily={MONO}
				fontWeight={700}
				fontSize={30}
				fill={colors.neutrino}
			>
				297 mm
			</text>
		</g>
	);
};

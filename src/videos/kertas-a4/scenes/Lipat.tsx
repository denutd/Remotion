import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {Baris, breathe, Kanvas, Kepala, LatarDiagram, MONO, OK, ramp, RESMI, SHADOW} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {KERTAS_INK} from '../ui';

// Segmen 4 (Payoff 2): A0 (1 m²) dibagi dua 4 kali berturut-turut menjadi A1 -> A2 -> A3 -> A4.
export const Lipat: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const bA0 = beat('A0');
	const bEmpat = beat('empat');
	const bA4 = beat('A4.');

	const pHead = 1;
	const pA0 = ramp(frame, 0, 10);
	const p1 = ramp(frame, bEmpat - 6, bEmpat + 4);
	const p2 = ramp(frame, bEmpat + 4, bEmpat + 14);
	const p3 = ramp(frame, bEmpat + 14, bA4 - 2);
	const p4 = ramp(frame, bA4 - 2, bA4 + 10);
	const dy = breathe(frame, 4, 30);
	void bA0;

	// Kanvas kertas A0 di (110, 410), ukuran 660 x 467 (rasio 1.414) -> melambangkan 1189 x 841 mm (1 m²).
	const X = 110;
	const Y = 410 + dy;
	const W0 = 660;
	const H0 = 467;

	return (
		<>
			<LatarDiagram frame={frame} id="lipat" />
			<Kepala p={pHead} tag="DIN 476 · 1922" color={RESMI}>
				Walter Porstmann · Standar ISO 216
			</Kepala>

			<Kanvas opacity={Math.min(1, pA0 * 1.5)}>
				<rect x={X + 10} y={Y + 14} width={W0} height={H0} rx={8} fill="rgba(0,0,0,0.45)" />
				<rect x={X} y={Y} width={W0} height={H0} rx={8} fill="#EDE7D9" stroke="#26325A" strokeWidth={3} />

				{/* A1 (setengah kiri) */}
				<rect x={X} y={Y} width={W0 / 2} height={H0} fill="#E5DEC9" opacity={p1} />
				<line x1={X + W0 / 2} y1={Y} x2={X + W0 / 2} y2={Y + H0} stroke="#26325A" strokeWidth={3} opacity={p1} />
				<text x={X + W0 * 0.25} y={Y + H0 * 0.54} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill={KERTAS_INK} opacity={p1}>
					A1
				</text>

				{/* A2 (kuadran kanan atas) */}
				<rect x={X + W0 / 2} y={Y} width={W0 / 2} height={H0 / 2} fill="#DCD3BA" opacity={p2} />
				<line x1={X + W0 / 2} y1={Y + H0 / 2} x2={X + W0} y2={Y + H0 / 2} stroke="#26325A" strokeWidth={3} opacity={p2} />
				<text x={X + W0 * 0.75} y={Y + H0 * 0.29} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={36} fill={KERTAS_INK} opacity={p2}>
					A2
				</text>

				{/* A3 (kiri bawah dari sisa kanan bawah) */}
				<rect x={X + W0 / 2} y={Y + H0 / 2} width={W0 / 4} height={H0 / 2} fill="#D1C6A8" opacity={p3} />
				<line x1={X + W0 * 0.75} y1={Y + H0 / 2} x2={X + W0 * 0.75} y2={Y + H0} stroke="#26325A" strokeWidth={3} opacity={p3} />
				<text x={X + W0 * 0.625} y={Y + H0 * 0.78} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={30} fill={KERTAS_INK} opacity={p3}>
					A3
				</text>

				{/* A4 (pojok kanan bawah atas — disorot kuning!) */}
				<rect
					x={X + W0 * 0.75}
					y={Y + H0 / 2}
					width={W0 / 4}
					height={H0 / 4}
					fill={colors.aha}
					stroke="#141A2B"
					strokeWidth={4}
					opacity={p4}
				/>
				<line x1={X + W0 * 0.75} y1={Y + H0 * 0.75} x2={X + W0} y2={Y + H0 * 0.75} stroke="#26325A" strokeWidth={3} opacity={p4} />
				<text x={X + W0 * 0.875} y={Y + H0 * 0.66} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={28} fill={KERTAS_INK} opacity={p4}>
					A4
				</text>
				{/* Sisa A5 + ... */}
				<text x={X + W0 * 0.875} y={Y + H0 * 0.9} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={22} fill="#5C6379" opacity={p4}>
					A5...
				</text>
			</Kanvas>

			<div
				style={{
					position: 'absolute',
					left: 110,
					top: 930,
					fontFamily: MONO,
					fontSize: 34,
					fontWeight: 700,
					color: colors.ink,
					textShadow: SHADOW,
				}}
			>
				A0 = <span style={{color: colors.aha}}>841 × 1189 mm</span> (= 1,00 m²)
			</div>
			<Baris p={p4} x={110} y={995} size={40} color={OK}>
				Dilipat 4× → A4 = 210 × 297 mm
			</Baris>

			<Sfx name="tick" at={bEmpat} />
			<Sfx name="pop" at={bA4} />
		</>
	);
};

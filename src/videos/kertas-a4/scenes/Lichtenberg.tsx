import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {Baris, breathe, Kanvas, Kepala, Label, LatarDiagram, MONO, OK, ramp, RESMI, riseIn, SHADOW} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import {mix} from '../../../lib/anim';
import type {SceneProps} from '../../../lib/beats';
import {KERTAS, KERTAS_INK} from '../ui';

// Segmen 3 (Payoff 1): Persamaan Lichtenberg (1786) -> hanya rasio 1 : akar 2 yang sebangun saat dibagi dua.
export const Lichtenberg: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const b1786 = beat('1786,');
	const bAkar = beat('akar');

	const pHead = 1;
	const pBox = ramp(frame, 0, 10);
	const pMath = ramp(frame, bAkar - 4, bAkar + 12);
	const dy = breathe(frame, 4, 26);
	void b1786;

	return (
		<>
			<LatarDiagram frame={frame} id="lichtenberg" />
			<Kepala p={pHead} tag="SEJARAH · 1786" color={RESMI}>
				Georg Christoph Lichtenberg
			</Kepala>

			<Kanvas opacity={Math.min(1, pBox * 1.4)}>
				{/* Persegi panjang rasio 1 : sqrt(2) (lebar 520, tinggi 368) */}
				<g transform={`translate(180 ${420 + dy})`}>
					<rect x={0} y={0} width={520} height={368} rx={8} fill={KERTAS} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
					{/* Garis bagi dua di tengah lebar (260) */}
					<line x1={260} y1={0} x2={260} y2={mix(pBox, 0, 368)} stroke={colors.aha} strokeWidth={6} strokeDasharray="10 8" />
					<text x={130} y={180} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={36} fill={KERTAS_INK}>
						a / 2
					</text>
					<text x={390} y={180} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={36} fill={KERTAS_INK}>
						a / 2
					</text>
					{/* Anotasi a (atas) dan b (kiri) */}
					<text x={260} y={-22} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={34} fill={colors.aha}>
						panjang = a
					</text>
					<text x={-30} y={194} textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize={34} fill={colors.neutrino}>
						b
					</text>
				</g>
			</Kanvas>

			{pMath > 0.001 ? (
				<div
					style={{
						position: 'absolute',
						left: 70,
						right: 130,
						top: 860,
						textShadow: SHADOW,
						...riseIn(pMath, 14),
					}}
				>
					<div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: colors.ink}}>
						a / b = b / (a / 2)
					</div>
					<div style={{marginTop: 14, fontFamily: MONO, fontSize: 66, fontWeight: 700, color: colors.aha}}>
						a / b = √2 ≈ 1,414
					</div>
				</div>
			) : null}

			<Baris p={pMath} y={1040} size={34} color={OK}>
				Sebangun persis setiap kali dilipat dua.
			</Baris>
			<Label p={pBox} style={{left: 70, top: 1120}}>
				DIAGRAM RASIO · LICHTENBERG 1786
			</Label>

			<Sfx name="tick" at={bAkar} />
		</>
	);
};

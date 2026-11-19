import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {Baris, breathe, Kanvas, Kepala, LatarDiagram, MONO, OK, ramp} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {mix} from '../../../lib/anim';
import {KERTAS, KERTAS_INK} from '../ui';

// Segmen 5 (Payoff 3): manfaat nyata — nol limbah potong & 2 halaman A5 muat pas ke 1 lembar A4.
export const Manfaat: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const bTanpa = beat('tanpa');
	const bA5 = beat('A5');
	const bA4 = beat('A4.');

	const pHead = 1;
	const pSlide = ramp(frame, bA5 - 2, bA4 + 8);
	const pDone = ramp(frame, bA4, bA4 + 12);
	const dy = breathe(frame, 4, 28);

	// Lembar target A4 landscape (lebar 640, tinggi 452) di (140, 440)
	const X = 140;
	const Y = 440 + dy;
	const W = 640;
	const H = 452;

	return (
		<>
			<LatarDiagram frame={frame} id="manfaat" />
			<Kepala p={pHead} tag="MANFAAT NYATA" color={OK}>
				Hemat bahan &amp; mudah diperbesar/kecilkan
			</Kepala>

			<Kanvas>
				{/* Bingkai lembar A4 */}
				<rect x={X} y={Y} width={W} height={H} rx={10} fill="rgba(255,255,255,0.06)" stroke={colors.aha} strokeWidth={4} strokeDasharray="12 8" />

				{/* Dua halaman A5 yang meluncur rapat masuk ke dalam bingkai A4 */}
				<g transform={`translate(${mix(pSlide, -80, 0)} ${mix(pSlide, -30, 0)})`}>
					<rect x={X + 10} y={Y + 10} width={W / 2 - 14} height={H - 20} rx={6} fill={KERTAS} />
					<text x={X + W * 0.25} y={Y + H * 0.5} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill={KERTAS_INK}>
						A5 (hal 1)
					</text>
				</g>
				<g transform={`translate(${mix(pSlide, 80, 0)} ${mix(pSlide, 30, 0)})`}>
					<rect x={X + W / 2 + 4} y={Y + 10} width={W / 2 - 14} height={H - 20} rx={6} fill={KERTAS} />
					<text x={X + W * 0.75} y={Y + H * 0.5} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill={KERTAS_INK}>
						A5 (hal 2)
					</text>
				</g>
			</Kanvas>

			<Baris p={pDone} y={960} size={40} color={colors.ink}>
				2 × A5 = <span style={{color: OK}}>1 × A4 pas tanpa sisa</span>
			</Baris>

			<Sfx name="whoosh" at={Math.max(0, bTanpa - 2)} />
			<Sfx name="pop" at={bA4} />
		</>
	);
};

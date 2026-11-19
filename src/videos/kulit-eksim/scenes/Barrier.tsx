import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {Kanvas, LatarDiagram, MONO, ramp, SHADOW, SolidTag, Sorot} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {SkinBarrierDiagram} from '../ui';

export const Barrier: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();

	const bBata = beat('batanya,');
	const bFilaggrin = beat('filaggrin');
	const bKeropos = beat('keropos,');
	const bMenguap = beat('menguap');
	const bMasuk = beat('masuk');

	const sFilaggrin = ramp(frame, bFilaggrin - 2, bFilaggrin + 10);
	const sKeropos = ramp(frame, bKeropos - 2, bKeropos + 10);

	const pDiagram = ramp(frame, 0, 12);
	const pCallout = ramp(frame, bKeropos, bKeropos + 14);

	return (
		<>
			<LatarDiagram frame={frame} id="barrier" />

			<div style={{position: 'absolute', left: 70, right: 130, top: 250, textShadow: SHADOW}}>
				<div style={{display: 'flex', gap: 12}}>
					<SolidTag p={1} color="#EF4444" size={24}>
						FAKTOR GENETIK
					</SolidTag>
					<SolidTag p={1} color="#F59E0B" size={24}>
						MUTASI GEN FLG
					</SolidTag>
				</div>
				<div
					style={{
						marginTop: 18,
						fontSize: 64,
						fontWeight: 800,
						lineHeight: 1.08,
						letterSpacing: '-0.02em',
						color: '#F8FAFC',
					}}
				>
					SEMEN{' '}
					<Sorot p={sKeropos} color="#EF4444">
						KEROPOS &amp; BOCOR
					</Sorot>
				</div>
				<div style={{marginTop: 12, fontSize: 32, fontWeight: 600, color: '#CBD5E1'}}>
					Defisiensi protein{' '}
					<Sorot p={sFilaggrin} color="#F59E0B">
						filaggrin &amp; ceramide
					</Sorot>
				</div>
			</div>

			<Kanvas>
				<SkinBarrierDiagram cx={540} cy={950} status="kering_retak" frame={frame} p={pDiagram} />

				{/* Label Indikator Ilmiah TEWL */}
				<g transform="translate(540, 1240)" opacity={pCallout}>
					<rect
						x={-340}
						y={-40}
						width={325}
						height={80}
						rx={14}
						fill="#1E293B"
						stroke="#60A5FA"
						strokeWidth={2}
					/>
					<text x={-315} y={-8} fill="#60A5FA" fontSize={18} fontWeight={700} fontFamily={MONO}>
						TEWL (PENGUAPAN AIR)
					</text>
					<text x={-315} y={22} fill="#F8FAFC" fontSize={22} fontWeight={700}>
						Air Kulit Menguap ↑
					</text>

					<rect
						x={15}
						y={-40}
						width={325}
						height={80}
						rx={14}
						fill="#1E293B"
						stroke="#F59E0B"
						strokeWidth={2}
					/>
					<text x={40} y={-8} fill="#F59E0B" fontSize={18} fontWeight={700} fontFamily={MONO}>
						PENETRASI ALERGEN
					</text>
					<text x={40} y={22} fill="#F8FAFC" fontSize={22} fontWeight={700}>
						Iritan Menyusup Masuk ↑
					</text>
				</g>
			</Kanvas>

			<Sfx name="whoosh" at={bBata} />
			<Sfx name="buzz" at={bKeropos} />
			<Sfx name="drip" at={bMenguap} />
			<Sfx name="thud" at={bMasuk} />
		</>
	);
};

import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {Kanvas, LatarDiagram, MONO, ramp, SHADOW, SolidTag, Sorot} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {SkinBarrierDiagram} from '../ui';

export const Solusi: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();

	const bBerhenti = beat('berhenti,');
	const bDitambal = beat('ditambal');
	const bPelembap = beat('pelembap');

	const sDitambal = ramp(frame, bDitambal - 2, bDitambal + 10);
	const sPelembap = ramp(frame, bPelembap - 2, bPelembap + 10);

	const pDiagram = ramp(frame, 0, 14);
	const pCallout = ramp(frame, bPelembap - 2, bPelembap + 12);

	return (
		<>
			<LatarDiagram frame={frame} id="solusi" />

			<div style={{position: 'absolute', left: 70, right: 130, top: 250, textShadow: SHADOW}}>
				<div style={{display: 'flex', gap: 12}}>
					<SolidTag p={1} color="#38BDF8" size={24}>
						PANDUAN DERMATOLOGI
					</SolidTag>
					<SolidTag p={1} color={colors.aha} size={24}>
						TERAPI PROAKTIF
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
					TAMBAL SEMEN{' '}
					<Sorot p={sDitambal} color="#38BDF8">
						SETIAP HARI
					</Sorot>
				</div>
				<div style={{marginTop: 12, fontSize: 32, fontWeight: 600, color: '#CBD5E1'}}>
					Kunci cegah kambuh:{' '}
					<Sorot p={sPelembap} color={colors.aha}>
						pelembap pelindung barier
					</Sorot>
				</div>
			</div>

			<Kanvas>
				<SkinBarrierDiagram cx={540} cy={950} status="proaktif" frame={frame} p={pDiagram} />

				{/* Callout Panduan Medis */}
				<g transform="translate(540, 1240)" opacity={pCallout}>
					<rect
						x={-340}
						y={-40}
						width={680}
						height={80}
						rx={14}
						fill="#1E293B"
						stroke="#38BDF8"
						strokeWidth={2}
					/>
					<text x={-315} y={-8} fill="#38BDF8" fontSize={18} fontWeight={700} fontFamily={MONO}>
						REKOMENDASI PANDUAN JAAD 2023
					</text>
					<text x={-315} y={22} fill="#F8FAFC" fontSize={22} fontWeight={700}>
						Barier harus dirawat konsisten meski gejala sudah mereda.
					</text>
				</g>
			</Kanvas>

			<Sfx name="whoosh" at={bBerhenti} />
			<Sfx name="chime-2" at={bDitambal} />
			<Sfx name="pop" at={bPelembap} />
		</>
	);
};

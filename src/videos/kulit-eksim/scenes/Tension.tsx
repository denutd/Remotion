import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {Kanvas, LatarDiagram, MONO, ramp, SHADOW, SolidTag, Sorot} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';

export const Tension: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();

	const bSalep = beat('salep');
	const bAlarm = beat('alarm');
	const bBenteng = beat('benteng');

	// Kartu 1 langsung tampil di awal scene agar layar tidak kosong
	const pCard1 = ramp(frame, 0, 10);
	const pCard2 = ramp(frame, bSalep - 4, bSalep + 8);

	const sAlarm = ramp(frame, bAlarm - 2, bAlarm + 10);

	return (
		<>
			<LatarDiagram frame={frame} id="tension" />

			{/* Header Scene */}
			<div style={{position: 'absolute', left: 70, right: 130, top: 250, textShadow: SHADOW}}>
				<SolidTag p={1} color={colors.neutrino} size={24}>
					MISKONSEPSI UMUM
				</SolidTag>
				<div
					style={{
						marginTop: 18,
						fontSize: 64,
						fontWeight: 800,
						lineHeight: 1.08,
						letterSpacing: '-0.02em',
						color: colors.ink,
					}}
				>
					SALEP CUMA MEMADAMKAN
					<br />
					<Sorot p={sAlarm} color="#EF4444">
						ALARM KEBAKARAN
					</Sorot>
				</div>
			</div>

			{/* Konten Perbandingan Editorial */}
			<Kanvas>
				{/* Kotak 1: Fungsi Salep */}
				<g transform="translate(540, 780)" opacity={pCard1}>
					<rect
						x={-340}
						y={-90}
						width={680}
						height={180}
						rx={20}
						fill="#1E293B"
						stroke="#EF4444"
						strokeWidth={2}
					/>
					<rect x={-310} y={-60} width={40} height={40} rx={8} fill="rgba(239, 68, 68, 0.2)" />
					<text x={-290} y={-33} textAnchor="middle" fill="#EF4444" fontSize={24} fontWeight={800}>
						!
					</text>
					<text x={-250} y={-40} fill="#F8FAFC" fontSize={28} fontWeight={700}>
						Obat Salep (Kortikosteroid)
					</text>
					<text x={-250} y={-5} fill="rgba(248, 250, 252, 0.7)" fontSize={22} fontWeight={500}>
						Hanya menghentikan sinyal gatal &amp; peradangan aktif.
					</text>
					<text x={-250} y={35} fill="#EF4444" fontSize={20} fontWeight={700} fontFamily={MONO}>
						STATUS: ALARM PADAM (SEMENTARA)
					</text>
				</g>

				{/* Kotak 2: Kondisi Nyata Sawar Kulit */}
				<g transform="translate(540, 1030)" opacity={pCard2}>
					<rect
						x={-340}
						y={-90}
						width={680}
						height={180}
						rx={20}
						fill="#1E293B"
						stroke="#F59E0B"
						strokeWidth={2}
					/>
					<rect x={-310} y={-60} width={40} height={40} rx={8} fill="rgba(245, 158, 11, 0.2)" />
					<text x={-290} y={-33} textAnchor="middle" fill="#F59E0B" fontSize={24} fontWeight={800}>
						✕
					</text>
					<text x={-250} y={-40} fill="#F8FAFC" fontSize={28} fontWeight={700}>
						Benteng Pertahanan (Sawar Kulit)
					</text>
					<text x={-250} y={-5} fill="rgba(248, 250, 252, 0.7)" fontSize={22} fontWeight={500}>
						Retakan semen ceramide di bawahnya masih terbuka lebar.
					</text>
					<text x={-250} y={35} fill="#F59E0B" fontSize={20} fontWeight={700} fontFamily={MONO}>
						STATUS: BELUM DIPERBAIKI
					</text>
				</g>
			</Kanvas>

			<Sfx name="whoosh" at={bSalep} />
			<Sfx name="thud" at={bBenteng} />
		</>
	);
};

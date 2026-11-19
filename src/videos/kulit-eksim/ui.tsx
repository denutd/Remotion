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
	SHADOW,
	SolidTag,
	Sorot,
} from '../../kit/Editorial';

export {breathe, DriftGrid, LatarDiagram, MONO, NO, OK, RESMI, SHADOW, SolidTag, Sorot};

export const COLOR_BRICK = '#F1ECE1';
export const COLOR_BRICK_BORDER = '#C4BAA9';
export const COLOR_CERAMIDE_OK = '#38BDF8';
export const COLOR_CERAMIDE_BAD = '#EF4444';
export const COLOR_WATER = '#60A5FA';
export const COLOR_ALLERGEN = '#F59E0B';

/** Judul Frame 0 & Sampul: Safe Zone y = 250..600 */
export const HookTitle: FC<{
	y?: number;
	sorotKambuh?: number;
	sorotMulus?: number;
	sampul?: boolean;
}> = ({y = 250, sorotKambuh = 0, sorotMulus = 0, sampul = false}) => (
	<div style={{position: 'absolute', left: 70, right: 130, top: y, textShadow: SHADOW}}>
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
			<SolidTag p={1} color={colors.aha} size={26}>
				DERMATOLOGI &amp; SAINS
			</SolidTag>
			<SolidTag p={1} color={RESMI} size={24}>
				STRATUM CORNEUM · ELIAS 1983
			</SolidTag>
		</div>
		<div
			style={{
				marginTop: 20,
				fontSize: sampul ? 80 : 70,
				fontWeight: 800,
				lineHeight: 1.05,
				letterSpacing: '-0.03em',
				color: colors.ink,
			}}
		>
			KENAPA KULIT EKSIM
			<br />
			<Sorot p={sorotKambuh} color={colors.neutrino}>
				SERING KAMBUH?
			</Sorot>
		</div>
		<div
			style={{
				marginTop: 16,
				fontSize: sampul ? 40 : 34,
				fontWeight: 600,
				lineHeight: 1.25,
				color: 'rgba(244, 241, 234, 0.85)',
			}}
		>
			Padahal salepnya baru saja bikin{' '}
			<Sorot p={sorotMulus} color={OK}>
				kelihatan mulus...
			</Sorot>
		</div>
		{sampul ? (
			<div style={{marginTop: 24, fontSize: 32, fontWeight: 700, color: colors.aha}}>
				Rahasia di Balik Model "Bata &amp; Semen" Kulit
			</div>
		) : null}
	</div>
);

/** Diagram Penampang Sawar Kulit: Brick & Mortar (Korneosit = Bata, Ceramide = Semen) */
export const SkinBarrierDiagram: FC<{
	cx?: number;
	cy?: number;
	status: 'normal' | 'kering_retak' | 'sembuh_salep' | 'proaktif';
	frame: number;
	p?: number;
}> = ({cx = 540, cy = 940, status, frame, p = 1}) => {
	if (p <= 0.001) return null;
	const dy = breathe(frame, 4, 32);

	// Grid batu bata teratur & presisi (Running Bond)
	const rows = [
		[
			{x: -225, w: 200, label: 'KORNEOSIT'},
			{x: 0, w: 200, label: 'KORNEOSIT'},
			{x: 225, w: 200, label: 'KORNEOSIT'},
		],
		[
			{x: -280, w: 90, label: 'SEL'},
			{x: -112, w: 200, label: 'KORNEOSIT'},
			{x: 112, w: 200, label: 'KORNEOSIT'},
			{x: 280, w: 90, label: 'SEL'},
		],
		[
			{x: -225, w: 200, label: 'KORNEOSIT'},
			{x: 0, w: 200, label: 'KORNEOSIT'},
			{x: 225, w: 200, label: 'KORNEOSIT'},
		],
		[
			{x: -280, w: 90, label: 'SEL'},
			{x: -112, w: 200, label: 'KORNEOSIT'},
			{x: 112, w: 200, label: 'KORNEOSIT'},
			{x: 280, w: 90, label: 'SEL'},
		],
	];

	const isBroken = status === 'kering_retak' || status === 'sembuh_salep';
	const ceramideColor =
		status === 'proaktif'
			? COLOR_CERAMIDE_OK
			: status === 'sembuh_salep'
				? '#F59E0B'
				: isBroken
					? COLOR_CERAMIDE_BAD
					: COLOR_CERAMIDE_OK;

	return (
		<g
			transform={`translate(${cx} ${cy + dy}) scale(${p})`}
			opacity={Math.min(1, p * 1.5)}
		>
			{/* Panel Latar Belakang Diagram */}
			<rect
				x={-380}
				y={-240}
				width={760}
				height={480}
				rx={24}
				fill="#111B2C"
				stroke="rgba(255,255,255,0.12)"
				strokeWidth={2}
			/>

			{/* Label Header Penampang (Kiri) */}
			<text
				x={-345}
				y={-195}
				fill="rgba(255,255,255,0.8)"
				fontSize={22}
				fontWeight={800}
				fontFamily={MONO}
				letterSpacing="0.08em"
			>
				STRATUM CORNEUM
			</text>

			{/* Status Tag (Kanan) */}
			<rect
				x={110}
				y={-218}
				width={235}
				height={34}
				rx={8}
				fill={isBroken ? 'rgba(239,68,68,0.2)' : 'rgba(56,189,248,0.2)'}
				stroke={ceramideColor}
				strokeWidth={1.5}
			/>
			<text
				x={227}
				y={-195}
				textAnchor="middle"
				fill={ceramideColor}
				fontSize={17}
				fontWeight={800}
				fontFamily={MONO}
			>
				{status === 'kering_retak'
					? 'BARIER BOCOR (TEWL ↑)'
					: status === 'sembuh_salep'
						? 'RADANG MATI / RETAK'
						: 'SEMEN CERAMIDE RAPAT'}
			</text>

			{/* Lapisan Matriks Semen (Lipid Bilayer) */}
			<rect
				x={-345}
				y={-160}
				width={690}
				height={300}
				rx={14}
				fill={isBroken ? 'rgba(239, 68, 68, 0.08)' : 'rgba(56, 189, 248, 0.12)'}
				stroke={ceramideColor}
				strokeWidth={2}
				strokeDasharray={isBroken ? '6 6' : undefined}
			/>

			{/* Balok Bata (Korneosit) */}
			{rows.map((row, rIdx) => {
				const y = -142 + rIdx * 68;
				return row.map((brick, bIdx) => {
					const brickX = brick.x - brick.w / 2;
					return (
						<g key={`${rIdx}-${bIdx}`}>
							<rect
								x={brickX}
								y={y}
								width={brick.w}
								height={50}
								rx={8}
								fill={COLOR_BRICK}
								stroke={COLOR_BRICK_BORDER}
								strokeWidth={2}
							/>
							<text
								x={brick.x}
								y={y + 31}
								textAnchor="middle"
								fill="#334155"
								fontSize={brick.w < 120 ? 14 : 16}
								fontWeight={800}
								fontFamily={MONO}
							>
								{brick.label}
							</text>
						</g>
					);
				});
			})}

			{/* Keterangan Bata vs Semen di bagian bawah panel */}
			<g transform="translate(0, 195)">
				<rect x={-270} y={-10} width={18} height={18} rx={4} fill={COLOR_BRICK} />
				<text x={-242} y={5} fill="#E2E8F0" fontSize={18} fontWeight={600}>
					Batu Bata = Sel Kulit
				</text>

				<rect x={40} y={-10} width={18} height={18} rx={4} fill={ceramideColor} />
				<text x={68} y={5} fill="#E2E8F0" fontSize={18} fontWeight={600}>
					Semen = Ceramide &amp; Lipid
				</text>
			</g>

			{/* Alur TEWL (Penguapan Air) & Partikel Iritan */}
			{isBroken ? (
				<>
					{/* Air Menguap Keluar (Titik Biru Mengalir ke Atas) */}
					{[-225, 0, 225].map((wx, i) => {
						const offset = (frame * 2.5 + i * 25) % 65;
						return (
							<g key={`w-${i}`} transform={`translate(${wx}, ${-160 - offset})`} opacity={1 - offset / 65}>
								<circle cx={0} cy={0} r={7} fill={COLOR_WATER} />
								<text x={12} y={5} fill={COLOR_WATER} fontSize={16} fontWeight={800} fontFamily={MONO}>
									H₂O ↑
								</text>
							</g>
						);
					})}
					{/* Partikel Alergen / Kuman Menyusup Masuk (Segitiga Kuning ke Bawah di celah kiri & tengah) */}
					{[-170, -50].map((ax, i) => {
						const offset = (frame * 2.8 + i * 30) % 65;
						return (
							<g key={`a-${i}`} transform={`translate(${ax}, ${-180 + offset})`} opacity={1 - offset / 65}>
								<polygon points="-8,-8 8,-8 0,8" fill={COLOR_ALLERGEN} />
								<text x={14} y={5} fill={COLOR_ALLERGEN} fontSize={14} fontWeight={800} fontFamily={MONO}>
									IRITAN ↓
								</text>
							</g>
						);
					})}
				</>
			) : (
				/* Lapisan Hidrasi Sehat Mengunci Air */
				<g transform="translate(0, -155)">
					<rect
						x={-345}
						y={-10}
						width={690}
						height={16}
						rx={8}
						fill="rgba(56, 189, 248, 0.5)"
						stroke="#38BDF8"
						strokeWidth={2}
					/>
					<text x={0} y={-16} textAnchor="middle" fill="#38BDF8" fontSize={17} fontWeight={800} fontFamily={MONO}>
						AIR TERKUNCI RAPAT · ALERGEN TERPANTUL
					</text>
				</g>
			)}
		</g>
	);
};

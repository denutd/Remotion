import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {Baris, breathe, Coret, Kanvas, Kepala, LatarDiagram, MONO, NO, OK, ramp, riseIn, SHADOW} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {KERTAS, KERTAS_INK} from '../ui';

// Segmen 2 (Tension): membuktikan kenapa ukuran bulat 200x300 mm gagal menjaga proporsi saat dilipat.
export const Tension: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();
	const b200 = beat('200');
	const bLipat = beat('dilipat');
	const bRusak = beat('rusak.');

	const pHead = 1;
	const pSheet = ramp(frame, 0, 10);
	const pFold = ramp(frame, bLipat, bLipat + 14);
	const pRusak = ramp(frame, bRusak - 2, bRusak + 10);
	const dy = breathe(frame, 4, 28);

	return (
		<>
			<LatarDiagram frame={frame} id="tension" />
			<Kepala p={pHead} tag="KALAU ANGKANYA BULAT" color={NO}>
				200 × 300 mm
			</Kepala>

			{/* Kiri: sebelum dilipat (200 x 300 -> rasio 1 : 1,50) */}
			{pSheet > 0.001 ? (
				<div
					style={{
						position: 'absolute',
						left: 90,
						top: 430 + dy,
						width: 340,
						textAlign: 'center',
						...riseIn(pSheet, 14),
					}}
				>
					<div
						style={{
							margin: '0 auto',
							width: 240,
							height: 360,
							borderRadius: 10,
							background: KERTAS,
							color: KERTAS_INK,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
							position: 'relative',
						}}
					>
						<div style={{fontFamily: MONO, fontSize: 32, fontWeight: 700}}>200 × 300</div>
						<div style={{marginTop: 8, fontSize: 28, fontWeight: 700, color: '#4B5570'}}>rasio 1 : 1,50</div>
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: '50%',
								height: 4,
								borderTop: `4px dashed ${colors.aha}`,
								transform: `scaleX(${pFold})`,
							}}
						/>
					</div>
					<div style={{marginTop: 18, fontSize: 28, fontWeight: 700, color: colors.ink, textShadow: SHADOW}}>
						Utuh: <span style={{color: OK}}>1 : 1,50</span>
					</div>
				</div>
			) : null}

			{/* Kanan: sesudah dilipat dua (150 x 200 -> rasio 1 : 1,33) */}
			{pFold > 0.001 ? (
				<div
					style={{
						position: 'absolute',
						left: 520,
						top: 520 + dy,
						width: 380,
						textAlign: 'center',
						...riseIn(pFold, 14),
					}}
				>
					<div
						style={{
							margin: '0 auto',
							width: 280,
							height: 210,
							borderRadius: 10,
							background: KERTAS,
							color: KERTAS_INK,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
							border: `4px solid ${pRusak > 0.3 ? NO : 'transparent'}`,
						}}
					>
						<div style={{fontFamily: MONO, fontSize: 32, fontWeight: 700}}>150 × 200</div>
						<div style={{marginTop: 8, fontSize: 28, fontWeight: 700, color: NO, position: 'relative'}}>
							rasio 1 : 1,33
							<Coret p={pRusak} />
						</div>
					</div>
					<div style={{marginTop: 18, fontSize: 28, fontWeight: 700, color: NO, textShadow: SHADOW}}>
						Dilipat 2: bentuknya berubah!
					</div>
				</div>
			) : null}

			<Kanvas>
				{pFold > 0.2 ? (
					<path
						d="M 410 580 Q 475 510 540 580"
						fill="none"
						stroke={colors.aha}
						strokeWidth={5}
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - pFold}
					/>
				) : null}
			</Kanvas>

			<Baris p={pRusak} y={960} size={42} color={colors.ink}>
				Setiap dilipat, tata letak cetak <span style={{color: NO}}>harus diubah total.</span>
			</Baris>

			<Sfx name="tick" at={b200} />
			<Sfx name="pop" at={bLipat} />
			<Sfx name="swish" at={bRusak} />
		</>
	);
};

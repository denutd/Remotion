import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {MONO, ramp, SHADOW, SolidTag, Sorot} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {Foto, P_SAWAR} from '../ui';

export const Sawar: FC<SceneProps> = ({dur, beat}) => {
	const frame = useCurrentFrame();

	const bMedis = beat('medis,');
	const bMelemah = beat('melemah.');
	const bMenguap = beat('menguap');
	const bKeras = beat('keras.');

	const sMelemah = ramp(frame, bMelemah - 2, bMelemah + 10);
	const sMenguap = ramp(frame, bMenguap - 2, bMenguap + 10);
	const pCard = ramp(frame, bMenguap - 4, bMenguap + 10);

	const zoom = 1 + 0.05 * (frame / dur);

	return (
		<>
			<Foto photo={P_SAWAR} zoom={zoom} focus={[0.5, 0.45]} dim={0.4} scrim={0.85} />

			<div style={{position: 'absolute', left: 70, right: 130, top: 250, textShadow: SHADOW}}>
				<div style={{display: 'flex', gap: 12}}>
					<SolidTag p={1} color="#38BDF8" size={24}>
						DIAGNOSIS MEDIS
					</SolidTag>
					<SolidTag p={1} color={colors.aha} size={24}>
						DERMATITIS ATOPIK
					</SolidTag>
				</div>
				<div
					style={{
						marginTop: 18,
						fontSize: 64,
						fontWeight: 800,
						lineHeight: 1.08,
						letterSpacing: '-0.02em',
						color: '#FFFFFF',
					}}
				>
					BENTENG KULIT
					<br />
					<Sorot p={sMelemah} color="#38BDF8">
						MELEMAH &amp; BOCOR
					</Sorot>
				</div>
				<div style={{marginTop: 14, fontSize: 32, fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)'}}>
					Kadar air <Sorot p={sMenguap} color="#60A5FA">menguap keluar</Sorot> (TEWL meningkat)
				</div>
			</div>

			{/* Infografis Faktor Pemicu */}
			<div
				style={{
					position: 'absolute',
					left: 70,
					right: 130,
					top: 640,
					padding: '24px 28px',
					borderRadius: 20,
					background: 'rgba(15, 23, 42, 0.88)',
					border: '2px solid rgba(56, 189, 248, 0.4)',
					backdropFilter: 'blur(10px)',
					opacity: pCard,
					transform: `translateY(${(1 - pCard) * 20}px)`,
					boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
				}}
			>
				<div style={{fontSize: 20, color: '#38BDF8', fontWeight: 800, fontFamily: MONO}}>
					PEMICU UTAMA KULIT REAKTIF:
				</div>
				<div style={{marginTop: 10, fontSize: 22, fontWeight: 600, color: '#F8FAFC', lineHeight: 1.4}}>
					• Udara dingin / kering ekstrem
					<br />
					• Partikel debu &amp; tungau mikro
					<br />
					• Sabun keras dengan deterjen SLS tinggi
				</div>
			</div>

			<Sfx name="whoosh" at={bMedis} />
			<Sfx name="drip" at={bMenguap} />
			<Sfx name="thud" at={bKeras} />
		</>
	);
};

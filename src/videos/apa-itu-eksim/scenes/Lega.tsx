import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {MONO, OK, ramp, SHADOW, SolidTag, Sorot} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {Foto, P_LEGA} from '../ui';

export const Lega: FC<SceneProps> = ({dur, beat}) => {
	const frame = useCurrentFrame();

	const bMenular = beat('menular.');
	const bGenetik = beat('genetik');
	const bBersih = beat('bersih.');

	const sMenular = ramp(frame, bMenular - 2, bMenular + 10);
	const sBersih = ramp(frame, bBersih - 2, bBersih + 10);

	const zoom = 1 + 0.05 * (frame / dur);

	return (
		<>
			<Foto photo={P_LEGA} zoom={zoom} focus={[0.5, 0.35]} dim={0.35} scrim={0.85} />

			<div style={{position: 'absolute', left: 70, right: 130, top: 250, textShadow: SHADOW}}>
				<div style={{display: 'flex', gap: 12}}>
					<SolidTag p={1} color={OK} size={24}>
						FAKTA KUNCI
					</SolidTag>
					<SolidTag p={1} color="rgba(255,255,255,0.9)" size={24}>
						HAPUS STIGMA
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
					100% SAMA SEKALI
					<br />
					<Sorot p={sMenular} color={OK}>
						TIDAK MENULAR!
					</Sorot>
				</div>
				<div style={{marginTop: 14, fontSize: 32, fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)'}}>
					Bukan karena kamu <Sorot p={sBersih} color="#F59E0B">kurang bersih</Sorot>
				</div>
			</div>

			{/* Banner Penenang */}
			<div
				style={{
					position: 'absolute',
					left: 70,
					right: 130,
					top: 640,
					padding: '24px 28px',
					borderRadius: 20,
					background: 'rgba(15, 23, 42, 0.88)',
					border: '2px solid rgba(127, 224, 162, 0.5)',
					backdropFilter: 'blur(10px)',
					boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
				}}
			>
				<div style={{fontSize: 22, color: OK, fontWeight: 800, fontFamily: MONO}}>
					PENYEBAB SESUNGGUHNYA:
				</div>
				<div style={{marginTop: 8, fontSize: 22, fontWeight: 600, color: '#F8FAFC', lineHeight: 1.35}}>
					Kombinasi faktor genetik &amp; sistem imun tubuh yang merespon lingkungan secara berlebihan.
				</div>
			</div>

			<Sfx name="whoosh" at={0} />
			<Sfx name="chime-1" at={bMenular} />
			<Sfx name="pop" at={bGenetik} />
		</>
	);
};

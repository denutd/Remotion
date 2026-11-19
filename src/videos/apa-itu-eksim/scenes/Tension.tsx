import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {MONO, ramp, SHADOW, SolidTag, Sorot} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {Foto, P_TENSION} from '../ui';

export const Tension: FC<SceneProps> = ({dur, beat}) => {
	const frame = useCurrentFrame();

	const bDigaruk = beat('digaruk.');
	const bRusak = beat('rusak');
	const bAlarm = beat('alarm');
	const bParah = beat('parah.');

	const sDigaruk = ramp(frame, bDigaruk - 2, bDigaruk + 10);
	const sAlarm = ramp(frame, bAlarm - 2, bAlarm + 10);
	const pCard = ramp(frame, bRusak - 4, bRusak + 10);

	const zoom = 1.05 + 0.06 * (frame / dur);

	return (
		<>
			<Foto photo={P_TENSION} zoom={zoom} focus={[0.5, 0.4]} dim={0.4} scrim={0.85} />

			<div style={{position: 'absolute', left: 70, right: 130, top: 250, textShadow: SHADOW}}>
				<div style={{display: 'flex', gap: 12}}>
					<SolidTag p={1} color="#EF4444" size={24}>
						PERINGATAN DERMATOLOGIS
					</SolidTag>
					<SolidTag p={1} color="#F59E0B" size={24}>
						ITCH-SCRATCH CYCLE
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
					JANGAN DITURUTI
					<br />
					DENGAN <Sorot p={sDigaruk} color="#EF4444">DIGARUK</Sorot>
				</div>
				<div style={{marginTop: 14, fontSize: 32, fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)'}}>
					Memicu <Sorot p={sAlarm} color="#EF4444">alarm radang</Sorot> yang lebih parah
				</div>
			</div>

			{/* Infografis Siklus Gatal-Garuk */}
			<div
				style={{
					position: 'absolute',
					left: 70,
					right: 130,
					top: 640,
					padding: '24px 28px',
					borderRadius: 20,
					background: 'rgba(15, 23, 42, 0.88)',
					border: '2px solid rgba(239, 68, 68, 0.5)',
					backdropFilter: 'blur(10px)',
					opacity: pCard,
					transform: `translateY(${(1 - pCard) * 20}px)`,
					boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<span style={{fontSize: 22, color: '#EF4444', fontWeight: 800, fontFamily: MONO}}>
						SIKLUS BERBAHAYA:
					</span>
				</div>
				<div style={{marginTop: 12, fontSize: 24, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.35}}>
					Gatal → Digaruk → Sawar Kulit Robek → Iritan Masuk → Radang Meningkat
				</div>
				<div style={{marginTop: 8, fontSize: 18, fontWeight: 600, color: '#FCA5A5', fontFamily: MONO}}>
					HASIL: RASA GATAL JADI 2X LEBIH KUAT
				</div>
			</div>

			<Sfx name="whoosh" at={0} />
			<Sfx name="buzz" at={bRusak} />
			<Sfx name="thud" at={bParah} />
		</>
	);
};

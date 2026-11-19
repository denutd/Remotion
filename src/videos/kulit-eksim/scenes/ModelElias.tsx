import type {FC} from 'react';
import {useCurrentFrame} from 'remotion';
import {colors} from '../../../brand/theme';
import {Kanvas, LatarDiagram, MONO, ramp, SHADOW, SolidTag, Sorot} from '../../../kit/Editorial';
import {Sfx} from '../../../kit/Sfx';
import type {SceneProps} from '../../../lib/beats';
import {SkinBarrierDiagram} from '../ui';

export const ModelElias: FC<SceneProps> = ({beat}) => {
	const frame = useCurrentFrame();

	const bYear = beat('1983,');
	const bBata = beat('bata');
	const bSemen = beat('semen');

	// Diagram langsung tampil sejak awal scene agar ritme visual dinamis
	const pDiagram = ramp(frame, 0, 10);
	const sYear = ramp(frame, bYear - 2, bYear + 10);
	const sBata = ramp(frame, bBata - 2, bBata + 10);
	const sSemen = ramp(frame, bSemen - 2, bSemen + 10);

	return (
		<>
			<LatarDiagram frame={frame} id="model-elias" />

			<div style={{position: 'absolute', left: 70, right: 130, top: 250, textShadow: SHADOW}}>
				<div style={{display: 'flex', gap: 12}}>
					<SolidTag p={1} color={colors.aha} size={24}>
						TEORI DASAR
					</SolidTag>
					<SolidTag p={1} color="#38BDF8" size={24}>
						PETER ELIAS · 1983
					</SolidTag>
				</div>
				<div
					style={{
						marginTop: 18,
						fontSize: 66,
						fontWeight: 800,
						lineHeight: 1.08,
						letterSpacing: '-0.02em',
						color: colors.ink,
					}}
				>
					MODEL{' '}
					<Sorot p={sBata} color="#E2E8F0">
						BATA
					</Sorot>{' '}
					&amp;{' '}
					<Sorot p={sSemen} color="#38BDF8">
						SEMEN
					</Sorot>
				</div>
				<div
					style={{
						marginTop: 12,
						fontSize: 30,
						fontWeight: 600,
						color: 'rgba(244, 241, 234, 0.8)',
						fontFamily: MONO,
					}}
				>
					Tahun <Sorot p={sYear} color={colors.aha}>1983</Sorot> · J. Invest Dermatol
				</div>
			</div>

			<Kanvas>
				<SkinBarrierDiagram cx={540} cy={1000} status="normal" frame={frame} p={pDiagram} />
			</Kanvas>

			<Sfx name="whoosh" at={bYear} />
			<Sfx name="tick" at={bBata} />
			<Sfx name="pop" at={bSemen} />
		</>
	);
};

import type {FC} from 'react';
import {colors} from '../../brand/theme';
import {
	breathe,
	Foto,
	MONO,
	NO,
	OK,
	Photo,
	RESMI,
	SHADOW,
	SolidTag,
	Sorot,
} from '../../kit/Editorial';

export {breathe, Foto, MONO, NO, OK, RESMI, SHADOW, SolidTag, Sorot};

export const P_HOOK: Photo = {src: 'images/apa-itu-eksim/01-hook.png', w: 768, h: 1376};
export const P_TENSION: Photo = {src: 'images/apa-itu-eksim/02-tension.png', w: 768, h: 1376};
export const P_SAWAR: Photo = {src: 'images/apa-itu-eksim/03-sawar.png', w: 1080, h: 1620};
export const P_LEGA: Photo = {src: 'images/apa-itu-eksim/04-lega.png', w: 1080, h: 810};
export const P_OUTRO: Photo = {src: 'images/apa-itu-eksim/05-outro.png', w: 1080, h: 720};

/** Judul Frame 0 & Sampul: Safe Zone y = 250..600 */
export const HookTitle: FC<{
	y?: number;
	sorotMenular?: number;
	sorotEksim?: number;
	sampul?: boolean;
}> = ({y = 250, sorotMenular = 0, sorotEksim = 0, sampul = false}) => (
	<div style={{position: 'absolute', left: 70, right: 130, top: y, textShadow: SHADOW}}>
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
			<SolidTag p={1} color={colors.aha} size={26}>
				KESEHATAN KULIT
			</SolidTag>
			<SolidTag p={1} color="#38BDF8" size={24}>
				DERMATOLOGI EDUKASI
			</SolidTag>
		</div>
		<div
			style={{
				marginTop: 20,
				fontSize: sampul ? 80 : 70,
				fontWeight: 800,
				lineHeight: 1.05,
				letterSpacing: '-0.03em',
				color: '#FFFFFF',
			}}
		>
			APA ITU <Sorot p={sorotEksim} color={colors.aha}>EKSIM</Sorot>
			<br />
			SEBENARNYA?
		</div>
		<div
			style={{
				marginTop: 16,
				fontSize: sampul ? 38 : 32,
				fontWeight: 600,
				lineHeight: 1.25,
				color: 'rgba(255, 255, 255, 0.9)',
			}}
		>
			Sering dikira{' '}
			<Sorot p={sorotMenular} color="#EF4444">
				penyakit menular...
			</Sorot>
		</div>
		{sampul ? (
			<div style={{marginTop: 24, fontSize: 32, fontWeight: 700, color: OK}}>
				Fakta Sains &amp; Cara Menghentikan Siklus Gatal
			</div>
		) : null}
	</div>
);

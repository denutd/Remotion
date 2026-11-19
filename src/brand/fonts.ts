import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

// Plus Jakarta Sans (Tokotype, SIL OFL) & IBM Plex Mono (IBM, SIL OFL)
// Disimpan lokal di public/fonts supaya render berjalan deterministik tanpa koneksi internet.
export const fontFamily = 'Plus Jakarta Sans';
export const monoFamily = 'IBM Plex Mono';

if (typeof document !== 'undefined') {
	const handle = delayRender('Memuat font lokal (Plus Jakarta Sans & IBM Plex Mono)');
	Promise.all([
		new FontFace(fontFamily, `url(${staticFile('fonts/PlusJakartaSans-latin.woff2')}) format('woff2')`, {
			weight: '200 800',
			style: 'normal',
		}).load(),
		new FontFace(monoFamily, `url(${staticFile('fonts/IBMPlexMono-500-latin.woff2')}) format('woff2')`, {
			weight: '500',
			style: 'normal',
		}).load(),
		new FontFace(monoFamily, `url(${staticFile('fonts/IBMPlexMono-700-latin.woff2')}) format('woff2')`, {
			weight: '700',
			style: 'normal',
		}).load(),
	])
		.then((faces) => {
			faces.forEach((face) => document.fonts.add(face));
			continueRender(handle);
		})
		.catch((err) => cancelRender(err));
}

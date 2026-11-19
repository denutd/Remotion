export const W = 1080;
export const H = 1920;
export const FPS = 30;

/**
 * Identitas channel — Kosongkan jika tidak ingin memakai watermark/branding channel.
 */
export const channel = {
	/** Nama singkat untuk logotype (kosongkan jika tanpa branding). */
	name: '',
	/** Handle media sosial untuk watermark & CTA (kosongkan jika tanpa branding). */
	handle: '',
	/** Jumlah huruf awal logotype yang diberi warna aksen kuning ("aha"). */
	highlightPrefix: 0,
	/** Tahun hak cipta untuk metadata file MP4. */
	copyrightYear: '2026',
};

/**
 * Palet warna konsisten di seluruh channel.
 * Warna aksen selalu membawa makna yang sama (jangan dipakai acak sebagai hiasan).
 */
export const colors = {
	bg: '#070B17',
	bgLift: '#111A38',
	panel: '#0E1631',
	line: '#26325A',
	ink: '#F4F1EA',
	muted: '#8F99BD',
	neutrino: '#6BE7FF',
	neutrinoCore: '#E9FCFF',
	cherenkov: '#3D8BFF',
	sunCore: '#FFF1C9',
	sun: '#FFB547',
	sunRim: '#FF8A3D',
	ocean: '#2D5BD0',
	land: '#46C08F',
	snow: '#EAF7FF',
	iceTop: '#BFE6FA',
	iceDeep: '#0F2A52',
	gold: '#E8C36A',
	aha: '#FFD84D',
};

/**
 * Tata letak portrait 9:16 (1080×1920).
 * Area di atas y=170, di bawah y=1520, dan strip kanan x>960 sering tertutup UI TikTok/Reels/Shorts.
 */
export const layout = {
	watermarkX: 48,
	watermarkY: 204,
	titleY: 360,
	captionY: 1335,
	safeTop: 170,
	safeBottom: 1520,
	safeRight: 960,
};

import type {FC} from 'react';
import {Composition, Still} from 'remotion';
import {FPS, H, W} from './brand/theme';
import {ApaItuEksim, timeline as apaItuEksim} from './videos/apa-itu-eksim/ApaItuEksim';
import {ApaItuEksimCover} from './videos/apa-itu-eksim/Cover';
import {CahayaMatahari, timeline as cahayaMatahari} from './videos/cahaya-matahari/CahayaMatahari';
import {CahayaMatahariCover} from './videos/cahaya-matahari/Cover';
import {EksimKambuhCover} from './videos/eksim-kambuh/Cover';
import {EksimKambuh, timeline as eksimKambuh} from './videos/eksim-kambuh/EksimKambuh';
import {EksimLukaCover} from './videos/eksim-luka/Cover';
import {EksimLuka, timeline as eksimLuka} from './videos/eksim-luka/EksimLuka';
import {GatalEksimCover} from './videos/gatal-eksim/Cover';
import {GatalEksim, timeline as gatalEksim} from './videos/gatal-eksim/GatalEksim';
import {KertasA4Cover} from './videos/kertas-a4/Cover';
import {KertasA4, timeline as kertasA4} from './videos/kertas-a4/KertasA4';
import {KulitEksimCover} from './videos/kulit-eksim/Cover';
import {KulitEksim, timeline as kulitEksim} from './videos/kulit-eksim/KulitEksim';

export const RemotionRoot: FC = () => (
	<>
		<Composition
			id="KertasA4"
			component={KertasA4}
			durationInFrames={kertasA4.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="KertasA4Cover" component={KertasA4Cover} width={W} height={H} />

		<Composition
			id="CahayaMatahari"
			component={CahayaMatahari}
			durationInFrames={cahayaMatahari.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="CahayaMatahariCover" component={CahayaMatahariCover} width={W} height={H} />

		<Composition
			id="KulitEksim"
			component={KulitEksim}
			durationInFrames={kulitEksim.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="KulitEksimCover" component={KulitEksimCover} width={W} height={H} />

		<Composition
			id="ApaItuEksim"
			component={ApaItuEksim}
			durationInFrames={apaItuEksim.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="ApaItuEksimCover" component={ApaItuEksimCover} width={W} height={H} />

		<Composition
			id="GatalEksim"
			component={GatalEksim}
			durationInFrames={gatalEksim.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="GatalEksimCover" component={GatalEksimCover} width={W} height={H} />

		<Composition
			id="EksimKambuh"
			component={EksimKambuh}
			durationInFrames={eksimKambuh.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="EksimKambuhCover" component={EksimKambuhCover} width={W} height={H} />

		<Composition
			id="EksimLuka"
			component={EksimLuka}
			durationInFrames={eksimLuka.durationInFrames}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{debug: false}}
		/>
		<Still id="EksimLukaCover" component={EksimLukaCover} width={W} height={H} />
	</>
);

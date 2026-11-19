import {ThreeCanvas} from '@remotion/three';
import type {FC, ReactNode} from 'react';
import {H, W} from '../brand/theme';

/**
 * Kanvas 3D standar untuk semua adegan WebGL.
 * Menggunakan alpha: false agar warna pasca-proses PostFX tidak tercampur latar halaman.
 */
export const Stage: FC<{children: ReactNode; shadows?: boolean}> = ({children, shadows = false}) => (
	<ThreeCanvas
		width={W}
		height={H}
		flat
		dpr={1}
		shadows={shadows ? 'soft' : false}
		gl={{antialias: false, alpha: false, powerPreference: 'high-performance'}}
		style={{position: 'absolute', inset: 0}}
	>
		{children}
	</ThreeCanvas>
);

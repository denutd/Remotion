import {Config} from '@remotion/cli/config';

// Motion graphic punya banyak warna rata & garis tipis: kualitas frame tinggi
// supaya tidak muncul artefak kompresi sebelum di-encode ke MP4.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Three.js butuh WebGL lewat GPU (ANGLE); renderer default Chromium tidak bisa merender Three.js.
Config.setChromiumOpenGlRenderer('angle');

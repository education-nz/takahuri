/* eslint-disable import/no-extraneous-dependencies,prefer-template */
const mix = require('laravel-mix');

const SRC = {
  lib: 'src/takahuri.js',
  demoHTML: 'src/demo/index.html',
  demoJS: 'src/demo/main.js',
  demoSCSS: 'src/demo/main.scss',
};

const DEST = {
  lib: 'dist/index.js',
  demo: 'dist/demo',
  demoJS: 'dist/demo/main.js',
};

mix.setPublicPath(__dirname);

mix.copy(SRC.lib, DEST.lib)
  .copy(SRC.demoHTML, DEST.demo)
  .js(SRC.demoJS, DEST.demo)
  .sass(SRC.demoSCSS, DEST.demo);

if (mix.inProduction()) {
  mix.babel(DEST.demoJS, DEST.demoJS);
}

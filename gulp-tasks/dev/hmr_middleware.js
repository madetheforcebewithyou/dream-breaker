import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHmrConfig from './webpack_hmr_config.js';

const compiler = webpack(webpackHmrConfig);

export default [
  webpackDevMiddleware(compiler, {
    publicPath: webpackHmrConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
      'errors-only': true,
    },
  }),
  webpackHotMiddleware(compiler, {
    log: console.log,
  }),
];

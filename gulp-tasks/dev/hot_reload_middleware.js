import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotReloadConfig from './webpack_hot_reload_config.js';

export default ({ entry }) => {
  const config = webpackHotReloadConfig({ entry });
  const compiler = webpack(config);

  return [
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
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
};

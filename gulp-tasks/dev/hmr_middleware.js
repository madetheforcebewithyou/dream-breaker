import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.babel.js';

export default () => {
  const compiler = webpack(webpackConfig);

  return [
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
        all: false,
        errors: true,
        errorDetails: true,
        hash: true,
        version: true,
        assets: true,
      },
    }),
    webpackHotMiddleware(compiler, {
      log: console.log,
    }),
  ];
};

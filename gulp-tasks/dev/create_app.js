import gulpUtil from 'gulp-util';
import config from './config.js';
import middleware from './hot_reload_middleware.js';

const hotReloadMiddleware = middleware({
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'webpack/hot/only-dev-server',
      config.frontEndEntryPoint,
    ],
  },
});

export default function createApp() {
  let app = () => {};

  try {
    // eslint-disable-next-line import/no-dynamic-require
    app = require(config.appRoot).default({
      hotReloadMiddleware,
      assets: {
        javascripts: ['/public/javascripts/app.js'],
        stylesheets: ['/public/stylesheets/local.css'],
      },
      react: {
        devTool: config.reduxDevTool,
      },
    });
  } catch (err) {
    gulpUtil.log(err);
  }

  return app;
}

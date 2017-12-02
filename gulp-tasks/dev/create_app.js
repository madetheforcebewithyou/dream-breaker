import gulpUtil from 'gulp-util';
import config from './config.js';
import hmrMiddleware from './hmr_middleware.js';

export default function createApp() {
  let app = () => {};

  try {
    // eslint-disable-next-line import/no-dynamic-require
    app = require(config.appRoot).default({
      hmrMiddleware,
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

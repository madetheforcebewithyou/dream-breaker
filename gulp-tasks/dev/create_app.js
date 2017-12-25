import gulpUtil from 'gulp-util';
import config from './config.js';

export default function createApp(hmrMiddleware) {
  let app = () => {};

  try {
    // eslint-disable-next-line import/no-dynamic-require
    app = require(config.appRoot).default({
      hmrMiddleware,
      assets: {
        javascripts: ['/public/javascripts/app.js'],
        stylesheets: ['/public/stylesheets/local.css'],
      },
      publicResources: {
        publicPath: config.publicPath,
      },
      react: {
        loadableFilePath: config.loadableFilePath,
        devTool: config.reduxDevTool,
      },
    });
  } catch (err) {
    gulpUtil.log(err);
  }

  return app;
}

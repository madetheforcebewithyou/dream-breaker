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
  // eslint-disable-next-line import/no-dynamic-require
  const app = require(config.appRoot).default;

  return app({
    hotReloadMiddleware,
    assets: {
      javascripts: ['/public/javascripts/app.js'],
      stylesheets: ['/public/stylesheets/local.css'],
    },
    react: {
      devTool: config.reduxDevTool,
    },
  });
}

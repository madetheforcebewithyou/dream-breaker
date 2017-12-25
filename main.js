const path = require('path');
const _ = require('lodash');
const assetsJson = require('./artifacts/assets.json');

const {
  DREAM_BREAKER_SERVER_PORT,
} = process.env;


// configure app
const app = require('./build/index.js').default({
  assets: {
    javascripts: [
      _.at(assetsJson, 'manifest.js')[0],
      _.at(assetsJson, 'vendor.js')[0],
      _.at(assetsJson, 'app.js')[0],
    ],
    stylesheets: [
      _.at(assetsJson, 'app.css')[0],
    ],
  },
  publicResources: {
    publicPath: '/public/',
    static: {
      route: '/public',
      path: path.join(__dirname, './build/public'),
    },
  },
  react: {
    loadableFilePath: path.join(__dirname, './artifacts/loadable.json'),
  },
});


// launch server
const port = Number(DREAM_BREAKER_SERVER_PORT || 3000);
app.listen(port);

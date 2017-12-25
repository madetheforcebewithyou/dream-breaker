import path from 'path';

const {
  DREAM_BREAKER_SERVER_PORT,
} = process.env;

export default {
  port: Number(DREAM_BREAKER_SERVER_PORT || 3000),
  appRoot: path.resolve('app'),
  frontEndEntryPoint: path.resolve('app/frontend/index.js'),
  reduxDevTool: false,
  loadableFilePath: path.resolve(__dirname, 'loadable.json'),
  publicPath: '/public/',
};

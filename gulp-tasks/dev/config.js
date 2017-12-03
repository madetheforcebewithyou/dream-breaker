import path from 'path';

const {
  DREAM_BREAKER_SERVER_PORT,
  DREAM_BREAKER_APP_ROOT,
  DREAM_BREAKER_FRONTEND_ENTRY_POINT,
  DREAM_BREAKER_REDUX_DEV_TOOL,
} = process.env;

export default {
  port: Number(DREAM_BREAKER_SERVER_PORT || 3000),
  appRoot: path.resolve(DREAM_BREAKER_APP_ROOT),
  frontEndEntryPoint: path.resolve(DREAM_BREAKER_FRONTEND_ENTRY_POINT),
  reduxDevTool: JSON.parse(DREAM_BREAKER_REDUX_DEV_TOOL || false),
};
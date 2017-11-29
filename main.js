const fs = require('fs');

const {
  NODE_ENV,
  DREAM_BREAKER_SERVER_PORT = 12345,
} = process.env;

if (NODE_ENV === 'production') {
  // eslint-disable-next-line import/no-unresolved
  require('./build').default({});
} else {
  const babelrc = fs.readFileSync('./.babelrc');
  let babelConfig;

  try {
    babelConfig = JSON.parse(babelrc);
    require('babel-register')(babelConfig);
    require('./app').default({
      port: DREAM_BREAKER_SERVER_PORT,
    });
  } catch (err) {
    console.error(err);
  }
}

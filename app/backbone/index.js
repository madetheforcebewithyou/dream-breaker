import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import {
  reactReduxMiddleware,
  reactRouteMiddleware,
  reactRenderMiddleware,
} from './middlewares';
import test from './test.js';

export default function backbone(config) {
  const {
    hotReloadMiddleware,
    publicResource,
    assets,
    react = {},
  } = config;

  const agent = express();
  // configure the HMR middleware
  if (hotReloadMiddleware) {
    agent.use(hotReloadMiddleware);
  }

  // configure common middlewares
  agent.use(
    (req, res, next) => {
      req.dreamBreaker = {};
      next();
    },
    compression(),
    helmet(),
    cookieParser(),
    bodyParser.urlencoded({ extended: false, limit: '100mb' }),
    bodyParser.json({ limit: '100mb' }),
  );

  agent.use((req, res, next) => {
    res.set('X-UA-Compatible', 'IE=edge,chrome=1');
    next();
  });

  // configure public resources
  if (publicResource) {
    const { path, maxAge = 0 } = publicResource;
    agent.use('/public', express.static(path, {
      maxAge,
    }));
  }

  agent.use('/test', test);

  // configure react related middlewares
  const { routes, redux = {}, devTool } = react;

  agent.use([
    reactReduxMiddleware({ ...redux, devTool }),
    reactRouteMiddleware(routes),
    reactRenderMiddleware({
      assets,
      devTool,
    }),
  ]);

  return agent;
}
/*
export default function launchServer(config) {
  const { port } = config;

  const server = configure(config).listen(port, (err) => {
    if (err) {
      logger.error(`cannot listen on ${port}`);
    } else {
      logger.info(`server start on ${port}`);
    }
  });

  return server;
}
*/

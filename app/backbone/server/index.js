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

export default function configureServer(config) {
  const {
    hmrMiddleware,
    publicResource,
    assets,
    react = {},
  } = config;

  const agent = express();
  // configure the HMR middleware
  if (hmrMiddleware) {
    agent.use(hmrMiddleware);
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

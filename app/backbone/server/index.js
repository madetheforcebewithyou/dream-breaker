import _ from 'lodash';
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
    assets,
    publicResources = {},
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

  // configure the static files
  const staticResourceConfig = _.at(publicResources, 'static')[0];
  if (staticResourceConfig) {
    const { route = '/public', maxAge = 0, path } = staticResourceConfig;
    agent.use(route, express.static(path, {
      maxAge,
    }));
  }

  // configure react related middlewares
  const { routes, redux = {}, devTool, loadableFilePath } = react;

  agent.use([
    reactReduxMiddleware({ ...redux, devTool }),
    reactRouteMiddleware(routes),
    reactRenderMiddleware({
      assets,
      devTool,
      loadableFilePath,
      publicResources,
    }),
  ]);

  return agent;
}

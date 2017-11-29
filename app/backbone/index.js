import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import { logger } from './../lib';
import { reactRouteMiddleware, renderMiddleware } from './middlewares';

function configure(config) {
  const { publicResource, reactSSR = {} } = config;

  const agent = express();
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

  if (publicResource) {
    const { path, maxAge = 0 } = publicResource;
    agent.use('/public', express.static(path, {
      maxAge,
    }));
  }

  // react rendering
  agent.use([
    reactRouteMiddleware({ routes: reactSSR.routes }),
    renderMiddleware(),
  ]);

  return agent;
}

export default function launchServer(config) {
  const { port } = config;

  configure(config).listen(port, (err) => {
    if (err) {
      logger.error(`cannot listen on ${port}`);
    } else {
      logger.info(`server start on ${port}`);
    }
  });
}

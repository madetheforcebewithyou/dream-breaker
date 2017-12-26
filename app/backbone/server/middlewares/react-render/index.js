import _ from 'lodash';
import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { renderToNodeStream } from 'react-dom/server';
import Loadable from 'react-loadable';
import path from 'path';
import { getBundles } from 'react-loadable/webpack';
import { logger } from './../../../lib/server';
import { Html, DevTool } from './../../../share/components';

function getLoadableBundles({
  loadableFilePath, publicResources, assets, modules,
}) {
  // eslint-disable-next-line import/no-dynamic-require
  const bundles = getBundles(require(loadableFilePath), modules);
  let javascripts = [];

  // TODO: code splitting for stylesheets
  const { publicPath } = publicResources;
  _.forEach(bundles, (bundle) => {
    if (bundle.file.endsWith('.js')) {
      javascripts.push(path.join(publicPath, bundle.file));
    }
  });
  javascripts = _.concat(assets.javascripts, javascripts);

  return { ...assets, javascripts };
}

function renderComponentToNodeStream({
  reduxMgr, routes, history, assets, devTool,
}) {
  const devToolComponent = devTool ? (
    <Provider store={reduxMgr.getStore()}>
      <DevTool />
    </Provider>
  ) : null;

  const reactStream = renderToNodeStream(
    <Provider store={reduxMgr.getStore()}>
      <ConnectedRouter history={history}>
        <Html
          initialState={reduxMgr.getStore().getState()}
          head={Helmet.rewind()}
          assets={assets}
          content={routes}
          devTool={devToolComponent}
        />
      </ConnectedRouter>
    </Provider>,
  );

  return new Promise((resolve, reject) => {
    reactStream
      .on('readable', () => {
        resolve(reactStream);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function prepareRendering(renderConfig) {
  const { reduxMgr, routes } = renderConfig;
  const modules = [];

  return Promise.resolve((
    <Loadable.Capture
      report={(moduleName) => {
        modules.push(moduleName);
      }}
    >
      {routes}
    </Loadable.Capture>
  ))
  .then((contents) => renderComponentToNodeStream({ ...renderConfig, routes: contents }))
  .then(() => {
    const tasks = _.map(reduxMgr.getRunningSagas(), (task) => task.done);
    reduxMgr.terminateSaga();

    return tasks;
  })
  .then((tasks) => Promise.all(tasks))
  .then(() => (modules));
}

export default ({ assets, devTool, loadableFilePath, publicResources }) => (req, res) => {
  const reduxMgr = req.dreamBreaker.react.reduxMgr;
  const renderConfig = {
    routes: req.dreamBreaker.react.routes,
    history: req.dreamBreaker.react.history,
    reduxMgr,
    assets,
    devTool,
    loadableFilePath,
    publicResources,
  };

  // prepare rendering
  prepareRendering(renderConfig)
  // do rendering
  .then((modules) => {
    const newAssets = getLoadableBundles({ ...renderConfig, modules });
    return renderComponentToNodeStream({ ...renderConfig, assets: newAssets });
  })
  // send response
  .then((reactStream) => {
    const router = reduxMgr.getStore().getState().router;

    // handle redirect
    const originalUrl = req.url;
    const newRedirectUrl = `${router.location.pathname}${router.location.search}`;
    if (!_.isEqual(originalUrl, newRedirectUrl)) {
      res.redirect(newRedirectUrl);
      return Promise.resolve();
    }

    // send html to the client
    return new Promise((resolve, reject) => {
      res.set('Content-Type', 'text/html');
      res.write('<!DOCTYPE html>');

      // pipe stream
      reactStream.pipe(res, { end: false });
      reactStream
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          res.end();
          resolve();
        });
    });
  })
  // handle error
  .catch((err) => {
    const message = _.at(err, 'message')[0];
    const stack = _.at(err, 'stack')[0];

    logger.error(`rendering error, ${message} ${stack}`);

    // To prevent the infinite error redirection
    if (req.path === '/error') {
      res.send(500, 'Encountering the unexpected error');
      return;
    }

    // TODO: provide the customized error path
    res.redirect('/error');
  });
};

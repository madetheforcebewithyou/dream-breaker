import _ from 'lodash';
import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import Loadable from 'react-loadable';
import path from 'path';
import { getBundles } from 'react-loadable/webpack';
import { logger } from './../../../lib';
import { Html, DevTool } from './../../share/components';

function getLoadableBundles({
  loadableFilePath, publicResources, assets, modules,
}) {
  // eslint-disable-next-line import/no-dynamic-require
  const bundles = getBundles(require(loadableFilePath), modules);
  const javascripts = [];

  // TODO: code splitting for stylesheets
  const { publicPath } = publicResources;
  _.forEach(bundles, (bundle) => {
    if (bundle.file.endsWith('.js')) {
      javascripts.push(path.join(publicPath, bundle.file));
    }
  });

  return _.merge({}, assets, { javascripts });
}

function renderComponentToHtml({
  store, routes, history, assets, devTool,
}) {
  const devToolComponent = devTool ? (
    <Provider store={store}>
      <DevTool />
    </Provider>
  ) : null;

  return renderToStaticMarkup(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Html
          initialState={store.getState()}
          head={Helmet.rewind()}
          assets={assets}
          content={routes}
          devTool={devToolComponent}
        />
      </ConnectedRouter>
    </Provider>,
  );
}

function prepareRendering(renderConfig) {
  const { sagaRunnings, store, routes } = renderConfig;
  const modules = [];

  return Promise.resolve()
  .then(() => (
    <Loadable.Capture
      report={(moduleName) => {
        modules.push(moduleName);
      }}
    >
      {routes}
    </Loadable.Capture>
  ))
  .then((contents) => {
    let tasks;
    try {
      renderComponentToHtml({ ...renderConfig, routes: contents });
      tasks = _.map(sagaRunnings, (task) => task.done);
      store.sagaEnd();
    } catch (err) {
      throw err;
    }

    return tasks;
  })
  .then((tasks) => Promise.all(tasks))
  .then(() => (modules));
}

export default ({ assets, devTool, loadableFilePath, publicResources }) => (req, res) => {
  const renderConfig = {
    store: req.dreamBreaker.react.reduxStore,
    routes: req.dreamBreaker.react.routes,
    history: req.dreamBreaker.react.history,
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
    const html = renderComponentToHtml({ ...renderConfig, assets: newAssets });
    const router = renderConfig.store.getState().router;

    // handle redirect
    const originalUrl = req.url;
    const newRedirectUrl = `${router.location.pathname}${router.location.search}`;
    if (!_.isEqual(originalUrl, newRedirectUrl)) {
      res.redirect(newRedirectUrl);
      return;
    }

    // send html to the client
    res.send(`<!DOCTYPE html>${html}`);
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

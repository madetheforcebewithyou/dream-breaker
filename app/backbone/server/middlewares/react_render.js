import _ from 'lodash';
import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { logger } from './../../../lib';
import { Html, DevTool } from './../../share/components';

const modules = [];

function captureModules(moduleName) {
  modules.push(moduleName);
}

function prepareLoadable({
  loadableFilePath, publicResources, assets, ...otherConfig
}) {
  let { routes } = otherConfig;
  routes = (
    <Loadable.Capture
      report={captureModules}
    >
      {routes}
    </Loadable.Capture>
  );

  // eslint-disable-next-line import/no-dynamic-require
  const bundles = getBundles(require(loadableFilePath), modules);
  const { javascripts, stylesheets } = assets;

  // TODO: code splitting for stylesheets
  const jsPublicPath = _.at(publicResources, 'js.path')[0];
  _.forEach(bundles, (bundle) => {
    if (bundle.file.endsWith('.js')) {
      javascripts.push(`${jsPublicPath}${bundle.file}`);
    }
  });

  return { ...otherConfig, routes, assets: { javascripts, stylesheets } };
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
  const { sagaRunnings, store } = renderConfig;

  return Promise.resolve().then(() => {
    let tasks;
    try {
      renderComponentToHtml(renderConfig);
      tasks = _.map(sagaRunnings, (task) => task.done);
      store.sagaEnd();
    } catch (err) {
      throw err;
    }

    return tasks;
  })
  .then((tasks) => Promise.all(tasks));
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
  .then(() => {
    const loadableConfig = prepareLoadable(renderConfig);
    const html = renderComponentToHtml(loadableConfig);
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

import _ from 'lodash';
import React from 'react';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { logger } from './../../lib';
import { Html, DevTool } from './../components';

function renderComponentToHtml({
  store, routes, url, assets, context = {}, devTool,
}) {
  const devToolComponent = devTool ? (
    <Provider store={store}>
      <DevTool />
    </Provider>
  ) : null;

  console.log(devTool, DevTool);

  return renderToStaticMarkup(
    <Provider store={store}>
      <StaticRouter
        location={url}
        context={context}
      >
        <Html
          initialState={store.getState()}
          head={Helmet.rewind()}
          assets={assets}
          content={routes}
          devTool={devToolComponent}
        />
      </StaticRouter>
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

const reactRenderMiddleware = ({ assets, devTool }) => (req, res) => {
  // prepare rendering
  prepareRendering({
    store: req.dreamBreaker.react.reduxStore,
    routes: req.dreamBreaker.react.routes,
    url: req.url,
    assets,
    devTool,
  })

  // do rendering
  .then(() => {
    const context = {};
    const html = renderComponentToHtml({
      store: req.dreamBreaker.react.reduxStore,
      routes: req.dreamBreaker.react.routes,
      url: req.url,
      assets,
      context,
      devTool,
    });

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.send(html);
    }
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

export default reactRenderMiddleware;

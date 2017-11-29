import React from 'react';
import Helmet from 'react-helmet';
import { StaticRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import test from './../../frontend/routes';
import Html from './../html';

const renderMiddleware = () => (req, res) => {
  // Rendering the routed component
  const context = {};
  const html = renderToStaticMarkup(
    <StaticRouter
      location={req.url}
      context={context}
    >
      <Html
        head={Helmet.rewind()}
        assets={req.dreamBreaker.reactSSR.routes}
        content={test}
      />
    </StaticRouter>,
  );

  // redirect case
  if (context.url) {
    res.redirect(context.url);
    return;
  }

  // redner the entire html
  res.send(html);
};

export default renderMiddleware;

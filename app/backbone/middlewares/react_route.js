
const reactRouteMiddleware = ({ routes }) => (req, res, next) => {
  // setup react SSR
  req.dreamBreaker.reactSSR = req.dreamBreaker.reactSSR || {};
  req.dreamBreaker.reactSSR.routes = routes;

  next();
};

export default reactRouteMiddleware;

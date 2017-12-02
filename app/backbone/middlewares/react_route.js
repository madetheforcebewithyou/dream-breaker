export default (routes) => (req, res, next) => {
  // setup react routes
  req.dreamBreaker.react = req.dreamBreaker.react || {};
  req.dreamBreaker.react.routes = routes;

  next();
};

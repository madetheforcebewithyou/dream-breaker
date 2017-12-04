import { createMemoryHistory } from 'history';
import ReduxManager from './../../share/redux';

export default ({
  initialState,
  rootMiddleware,
  rootReducer,
  rootSaga,
  devTool,
}) => (req, res, next) => {
  const history = createMemoryHistory({ initialEntries: [req.path] });
  const reduxMgr = new ReduxManager({
    initialState,
    rootMiddleware,
    rootReducer,
    rootSaga,
    history,
    devTool,
  });

  // setup req
  req.dreamBreaker.react = req.dreamBreaker.react || {};
  req.dreamBreaker.react.reduxStore = reduxMgr.store;
  req.dreamBreaker.react.history = history;

  next();
};

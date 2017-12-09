import { createMemoryHistory } from 'history';
import ReduxManager from './../../../share/redux';
import systemReducer from './system-reducer';

export default ({
  initialState,
  rootMiddleware,
  rootReducer,
  rootSaga,
  devTool,
}) => (req, res, next) => {
  const history = createMemoryHistory({ initialEntries: [req.path] });
  const reduxMgr = new ReduxManager({
    systemReducer: systemReducer(req),
    initialState,
    rootMiddleware,
    rootReducer,
    rootSaga,
    history,
    devTool,
  });

  // setup req
  req.dreamBreaker.react = req.dreamBreaker.react || {};
  req.dreamBreaker.react.reduxMgr = reduxMgr;
  req.dreamBreaker.react.history = history;

  next();
};

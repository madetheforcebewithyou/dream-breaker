import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { createMemoryHistory } from 'history';
import { DevTool } from './../components';

function getEnhancer({ middlewares, devTool }) {
  return devTool ?
    compose(
      applyMiddleware(...middlewares),
      DevTool.instrument(),
    ) :
    applyMiddleware(...middlewares);
}

export default ({
  initialState = {},
  rootMiddleware = [],
  rootReducer = {},
  rootSaga,
  devTool,
}) => (req, res, next) => {
  const history = createMemoryHistory({ initialEntries: [req.path] });
  const sagaMiddleware = createSagaMiddleware();

  const allReducers = {
    ...rootReducer,
    router: routerReducer,
  };

  const allMiddlewares = [
    ...rootMiddleware,
    sagaMiddleware,
    routerMiddleware(history),
  ];

  // configure store
  const store = createStore(
    combineReducers(allReducers),
    initialState,
    getEnhancer({ middlewares: allMiddlewares, devTool }),
  );
  store.sagaEnd = () => store.dispatch(END);

  // run sagas
  store.sagaRunnings = [
    sagaMiddleware.run(rootSaga),
  ];

  // setup req
  req.dreamBreaker.react = req.dreamBreaker.react || {};
  req.dreamBreaker.react.reduxStore = store;
  req.dreamBreaker.react.history = history;

  next();
};

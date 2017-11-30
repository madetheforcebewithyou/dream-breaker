import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createSagaMiddleware, { END } from 'redux-saga';

function getEnhancer({ middlewares }) {
  return applyMiddleware(...middlewares);
}

const reactReduxMiddleware = ({
  history,
  initialState = {},
  rootMiddleware = [],
  rootReducer = {},
  rootSaga,
}) => (req, res, next) => {
  const sagaMiddleware = createSagaMiddleware();

  const allReducers = {
    ...rootReducer,
    routing: routerReducer,
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
    getEnhancer({ middlewares: allMiddlewares }),
  );
  store.sagaEnd = () => store.dispatch(END);

  // run sagas
  store.sagaRunnings = [
    sagaMiddleware.run(rootSaga),
  ];

  // setup req
  req.dreamBreaker.react = req.dreamBreaker.react || {};
  req.dreamBreaker.react.reduxStore = store;

  next();
};

export default reactReduxMiddleware;

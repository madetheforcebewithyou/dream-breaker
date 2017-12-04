import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { DevTool } from './../components';

const _config = Symbol();
const _store = Symbol();
const _configureStore = Symbol();
const _normalizeMiddlewares = Symbol();
const _normalizeReducers = Symbol();

export default class ReduxManager {
  constructor(config = {}) {
    this[_config] = config;
  }

  [_normalizeReducers]({ rootReducer }) {
    return combineReducers({
      ...rootReducer,
      router: routerReducer,
    });
  }

  [_normalizeMiddlewares]({ middlewares, devTool }) {
    return devTool ?
      compose(
        applyMiddleware(...middlewares),
        DevTool.instrument(),
      ) :
      applyMiddleware(...middlewares);
  }

  [_configureStore]() {
    const {
      initialState = {},
      rootMiddleware = [],
      rootReducer = {},
      rootSaga,
      history,
      devTool,
    } = this[_config];

    const sagaMiddleware = createSagaMiddleware();
    const allReducers = this[_normalizeReducers]({ rootReducer });
    const allMiddlewares = [
      ...rootMiddleware,
      sagaMiddleware,
      routerMiddleware(history),
    ];

    // configure store
    const store = createStore(
      allReducers,
      initialState,
      this[_normalizeMiddlewares]({ middlewares: allMiddlewares, devTool }),
    );
    store.sagaEnd = () => store.dispatch(END);

    // run sagas
    store.sagaRunnings = [
      sagaMiddleware.run(rootSaga),
    ];

    return store;
  }

  get store() {
    if (!this[_store]) {
      this[_store] = this[_configureStore]();
    }

    return this[_store];
  }

  replaceReducer({ rootReducer }) {
    this.store.replaceReducer(this[_normalizeReducers]({ rootReducer }));
  }
}

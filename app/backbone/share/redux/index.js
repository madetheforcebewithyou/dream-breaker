import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { DevTool } from './../components';
import SagaRegistry from './saga_registry.js';

const _config = Symbol();
const _sagaRegistry = Symbol();
const _store = Symbol();
const _configureStore = Symbol();
const _normalizeMiddlewares = Symbol();
const _normalizeReducers = Symbol();

export default class ReduxManager {
  constructor(config = {}) {
    this[_config] = config;
    this[_sagaRegistry] = new SagaRegistry();
  }

  [_normalizeReducers]({ rootReducer }) {
    const { systemReducer } = this[_config];

    return combineReducers({
      ...rootReducer,
      system: systemReducer,
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

    const allReducers = this[_normalizeReducers]({ rootReducer });
    const allMiddlewares = [
      ...rootMiddleware,
      this[_sagaRegistry].getMiddleware(),
      routerMiddleware(history),
    ];

    // configure store
    const store = createStore(
      allReducers,
      initialState,
      this[_normalizeMiddlewares]({ middlewares: allMiddlewares, devTool }),
    );

    // run saga
    this[_sagaRegistry].run(rootSaga);

    return store;
  }

  getStore() {
    if (!this[_store]) {
      this[_store] = this[_configureStore]();
    }

    return this[_store];
  }

  getRunningSagas() {
    return this[_sagaRegistry].getRunningSagas();
  }

  terminateSaga() {
    return this[_sagaRegistry].terminateSaga({ dispatch: this.getStore().dispatch });
  }

  replaceSaga({ rootSaga }) {
    this[_sagaRegistry].reload({ rootSaga, dispatch: this.getStore().dispatch });
  }

  replaceReducer({ rootReducer }) {
    this.getStore().replaceReducer(this[_normalizeReducers]({ rootReducer }));
  }
}

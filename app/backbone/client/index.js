import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory, createHashHistory } from 'history';
import { DevTool } from './../share/components';
import ReduxManager from './../share/redux';
import systemReducer from './system-reducer';

const _reduxMgr = Symbol();
const _history = Symbol();
const _render = Symbol();
const _config = Symbol();
const _hasDevTool = Symbol();
const _reloadRedux = Symbol();
const _reloadRoutes = Symbol();

export default class DreamBreakerClient {
  constructor(config = {}) {
    // setup config
    this[_config] = config;

    // setup history
    const clientHistory = (window.history && window.history.pushState) ?
      createBrowserHistory() :
      createHashHistory();

    // setup store
    const { redux = {} } = this[_config];
    const { rootMiddleware, rootReducer, rootSaga } = redux;

    this[_reduxMgr] = new ReduxManager({
      initialState: window.__INITIAL_STATE__,
      history: clientHistory,
      devTool: this[_hasDevTool](),
      systemReducer,
      rootMiddleware,
      rootReducer,
      rootSaga,
    });

    // setup history
    // FIXME: How to sync with the store?
    this[_history] = clientHistory;
  }

  [_hasDevTool]() {
    return !_.isNil(document.getElementById('dev-tool'));
  }

  [_render](routes) {
    // render root
    const rootElement = document.getElementById('root');
    if (rootElement) {
      Loadable.preloadReady()
      .then(() => {
        ReactDOM.hydrate(
          <Provider store={this[_reduxMgr].getStore()}>
            <ConnectedRouter history={this[_history]}>
              {routes}
            </ConnectedRouter>
          </Provider>,
          rootElement,
        );
      });
    }

    // render dev tool
    const devToolElement = document.getElementById('dev-tool');
    if (devToolElement) {
      ReactDOM.hydrate(
        <Provider store={this[_reduxMgr].getStore()}>
          <DevTool />
        </Provider>,
        devToolElement,
      );
    }
  }

  [_reloadRedux](redux = {}) {
    const { rootReducer, rootSaga } = redux;
    if (rootReducer) {
      this[_reduxMgr].replaceReducer({ rootReducer });
    }

    if (rootSaga) {
      this[_reduxMgr].replaceSaga({ rootSaga });
    }
  }

  [_reloadRoutes](routes) {
    if (routes) {
      this[_render](routes);
    }
  }

  hot(config = {}) {
    const { routes, redux } = config;

    // reload redux
    this[_reloadRedux](redux);

    // reload routes
    this[_reloadRoutes](routes);
  }

  launch() {
    this[_render](this[_config].routes);
  }
}

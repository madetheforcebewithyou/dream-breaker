import createSagaMiddleware, { END } from 'redux-saga';
import { take, fork, cancel } from 'redux-saga/effects';
import uuidv4 from 'uuid/v4';

const _middleware = Symbol();
const _running = Symbol();
const _hotReloadAction = Symbol();

export default class SagaRegistry {
  constructor() {
    this[_hotReloadAction] = `SAGA_HOT_RELOAD_${uuidv4()}`;
    this[_middleware] = createSagaMiddleware();
  }

  getMiddleware() {
    return this[_middleware];
  }

  run(rootSaga) {
    const hotReloadAction = this[_hotReloadAction];

    this[_running] = this[_middleware].run(function* runner() {
      function* start(task) {
        yield* task();
      }

      let rootTask = yield fork(start, rootSaga);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const action = yield take(hotReloadAction);

        // reload task
        if (action.rootSaga) {
          yield cancel(rootTask);
          rootTask = yield fork(start, action.rootSaga);
        }
      }
    });

    return this[_running];
  }

  getRunningSagas() {
    return [
      this[_running],
    ];
  }

  terminateSaga({ dispatch }) {
    dispatch(END);
  }

  reload({ rootSaga, dispatch }) {
    dispatch({
      type: this[_hotReloadAction],
      rootSaga,
    });
  }
}

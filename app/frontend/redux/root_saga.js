import { all } from 'redux-saga/effects';
import test1Saga from './sagas/test1';
import test2Saga from './sagas/test2';

export default function* rootSaga() {
  yield all([
    test1Saga(),
    test2Saga(),
  ]);
}

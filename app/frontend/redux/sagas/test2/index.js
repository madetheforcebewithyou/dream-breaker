import { takeEvery } from 'redux-saga/effects';
import { knives } from './../../knives';

export default function* test2Saga() {
  yield takeEvery(knives.test2.actionType.increaseTest2, function* handleIncreaseTest2() {
    yield console.log('handle increase test 2');
  });
}

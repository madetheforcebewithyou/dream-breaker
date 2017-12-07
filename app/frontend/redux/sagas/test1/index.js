import { takeEvery } from 'redux-saga/effects';
import { knives } from './../../knives';

export default function* test1Saga() {
  yield takeEvery(knives.test1.actionType.increaseTest1, function* handleIncreaseTest1() {
    yield console.log('handle increase test 1');
  });
}

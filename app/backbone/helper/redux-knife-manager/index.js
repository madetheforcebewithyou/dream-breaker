import _ from 'lodash';
import { combineReducers } from 'redux';
import KnifeMaker from './knife-maker';

const _defaultPrefix = Symbol();
const _knifeMaker = Symbol();

const _knives = Symbol();

export default class ReduxKnifeManager {
  constructor(config = {}) {
    const { prefix } = config;

    this[_knifeMaker] = new KnifeMaker({ prefix: prefix || this[_defaultPrefix] });
    this[_knives] = {};
  }

  get [_defaultPrefix]() {
    return 'app';
  }

  getKnives() {
    return this[_knives];
  }

  getRootReducer() {
    const reducers = {};
    _.forEach(this[_knives], (namespace, knife) => {
      reducers[namespace] = knife.reducer;
    });

    return combineReducers(reducers);
  }

  add(config) {
    const { namespace } = config;
    if (_.isNil(namespace)) {
      throw new Error('should specific the namespace.');
    }

    this[_knives][namespace] = this[_knifeMaker].make(config);
  }
}

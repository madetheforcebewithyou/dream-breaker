import _ from 'lodash';

const _prefix = Symbol();
const _defaultPrefix = Symbol();
const _makeAction = Symbol();
const _makeSelector = Symbol();
const _makeReducer = Symbol();

export default class KnifeMaker {
  constructor(config = {}) {
    const { prefix } = config;

    this[_prefix] = prefix || this[_defaultPrefix];
  }

  get [_defaultPrefix]() {
    return 'app';
  }

  [_makeAction]({ namespace, actionMap }) {
    const action = {};
    const actionType = {};

    // make action and actionType
    _.forEach(actionMap, (name) => {
      // a.b.c.${namespace}.${name} => A_B_C_${NAMESPACE}_${NAME}
      const constant = _.snakeCase(`${this[_prefix]}.${namespace}.${name}`).toUpperCase();

      // create actionMap
      action[name] = (payload = {}) => ({
        type: constant,
        ...payload,
      });

      // create actionTypes
      actionType[name] = constant;
    });

    return { action, actionType };
  }

  [_makeReducer]({ defaultState, actionType, reducerMap }) {
    const handlers = _.isFunction(reducerMap) ?
      reducerMap(actionType) : {};

    return (state = defaultState, action = {}) => {
      let result = state;

      const { type } = action;
      if (_.isFunction(handlers[type])) {
        result = handlers[type](state, action);
      }

      return result;
    };
  }

  [_makeSelector]({ namespace, defaultState }) {
    if (_.isEmpty(this[_prefix]) || _.isEmpty(namespace)) {
      return {};
    }

    // create namespace selector
    const selector = {};
    const namespacePrefix = _.camelCase(`get_${namespace}`);
    selector[namespacePrefix] = (state) => _.at(state, `${this[_prefix]}.${namespace}`)[0];

    // create property selector
    _.forEach(defaultState, (value, key) => {
      const functionName = _.camelCase(`${namespacePrefix}_${key}`);
      selector[functionName] = (state) => _.at(state, `${this[_prefix]}.${namespace}.${key}`)[0];
    });

    return selector;
  }

  make({ namespace, defaultState, actionMap, reducerMap }) {
    const { action, actionType } = this[_makeAction]({ namespace, actionMap });
    const reducer = this[_makeReducer]({ defaultState, actionType, reducerMap });
    const selector = this[_makeSelector]({ namespace, defaultState });

    return {
      action,
      actionType,
      reducer,
      selector,
    };
  }
}

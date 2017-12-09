import _ from 'lodash';
import axios from 'axios';

const _instance = Symbol();
const _interceptors = Symbol();

export default class Http {
  constructor(config = {}) {
    const defaultConfig = {
      maxRedirects: 10,
      timeout: 30000,
      withCredentials: true,
    };

    this[_instance] = axios.create({
      ...defaultConfig,
      ...config,
    });

    this[_interceptors] = {
      request: {},
      response: {},
    };
  }

  request(params = {}) {
    return this[_instance].request(params)
      .then((response) => ({ error: false, timeout: false, response }))
      .catch((err) => {
        const response = err.response ?
          err.response :
          { data: { errorCode: '000000', errorMessage: err.message } };
        const timeout = err.code === 'ECONNABORTED' && new RegExp('^timeout').test(err.message);

        return { error: true, timeout, response };
      });
  }

  setInterceptor({ type, key, success, failure }) {
    if (!_.isFunction(success) && !_.isFunction(failure)) {
      return;
    }

    if (!this[_interceptors][type]) {
      return;
    }

    // icr has been setuped ?
    if (!_.isNil(this[_interceptors][type][key])) {
      return;
    }

    this[_interceptors][type][key] = this[_instance].interceptors[type].use(success, failure);
  }

  unsetInterceptor({ type, key }) {
    if (!this[_interceptors][type]) {
      return;
    }

    if (_.isNil(this[_interceptors][type][key])) {
      return;
    }

    this[_instance].interceptors[type].eject(this[_interceptors][type][key]);
    this[_interceptors][type][key] = undefined;
  }
}

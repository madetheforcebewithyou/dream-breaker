import { combineReducers } from 'redux';
import servicesReducer from './services.js';
import contextReducer from './context.js';

export default (req) => combineReducers({
  services: servicesReducer(req),
  context: contextReducer(req),
});

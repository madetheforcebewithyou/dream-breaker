import { combineReducers } from 'redux';
import servicesReducer from './services.js';
import contextReducer from './context.js';

export default combineReducers({
  services: servicesReducer,
  context: contextReducer,
});

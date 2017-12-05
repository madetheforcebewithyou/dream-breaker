import { ReduxKnifeManager } from './../../../backbone/helper';

// config
import test1Config from './test1.js';
import test2Config from './test2.js';

const reduxKnifeManager = new ReduxKnifeManager();

// add knives
reduxKnifeManager.add('test1', test1Config);
reduxKnifeManager.add('test2', test2Config);

const knives = reduxKnifeManager.getKnives();
const rootReducer = reduxKnifeManager.getRootReducer();

export {
  knives,
  rootReducer,
};

import testAdd from './test_add.js';
import testGetKnives from './test_get_knives.js';
import testGetRootReducer from './test_get_root_reducer.js';

describe('test ReduxKnifeManager()', () => {
  testAdd();
  testGetKnives();
  testGetRootReducer();
});

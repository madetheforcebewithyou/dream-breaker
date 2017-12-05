import _ from 'lodash';
import KnifeMaker from './../';
import testAction from './test_action.js';
import testActionType from './test_action_type.js';
import testReducer from './test_reducer.js';
import testSelector from './test_selector.js';

describe('test KnifeMaker()', () => {
  const prefix = 'my.test.knife.maker';
  const knifeMaker = new KnifeMaker({ prefix });
  const constantPrefix = _.join(_.split(prefix, '.'), '_').toUpperCase();

  testAction({ knifeMaker, constantPrefix });
  testActionType({ knifeMaker, constantPrefix });
  testReducer({ knifeMaker });
  testSelector({ knifeMaker });
});

import _ from 'lodash';

export default ({ knifeMaker, constantPrefix }) => {
  describe('test action', () => {
    it('should get the empty action with empty action', () => {
      const { action } = knifeMaker.make({});

      action.should.to.eql({});
    });

    it('should make action successfully', () => {
      const { action } = knifeMaker.make({
        namespace: 'hahaha',
        actionMap: [
          'testA1',
          'testB2',
          'testC3',
        ],
      });

      // testcases
      const payload = {
        name: 'lala',
        phone: 3345678,
      };

      const testcases = [
        { fn: action.testA1, result: { type: `${constantPrefix}_HAHAHA_TEST_A_1`, ...payload } },
        { fn: action.testB2, result: { type: `${constantPrefix}_HAHAHA_TEST_B_2`, ...payload } },
        { fn: action.testC3, result: { type: `${constantPrefix}_HAHAHA_TEST_C_3`, ...payload } },
      ];
      _.forEach((testcases), ({ fn, result }) => fn(payload).should.to.eql(result));
    });
  });
};

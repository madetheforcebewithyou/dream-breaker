import _ from 'lodash';

export default ({ knifeMaker, constantPrefix }) => {
  describe('test actionType', () => {
    it('should get the empty actionType with empty actionMap', () => {
      const { action } = knifeMaker.make({});

      action.should.to.eql({});
    });

    it('should make actionType successfully', () => {
      const { actionType } = knifeMaker.make({
        namespace: 'hahaha',
        actionMap: [
          'testA1',
          'testB2',
          'testC3',
        ],
      });

      const testcases = [
        { action: actionType.testA1, result: `${constantPrefix}_HAHAHA_TEST_A_1` },
        { action: actionType.testB2, result: `${constantPrefix}_HAHAHA_TEST_B_2` },
        { action: actionType.testC3, result: `${constantPrefix}_HAHAHA_TEST_C_3` },
      ];
      _.forEach((testcases), ({ action, result }) => action.should.to.eql(result));
    });
  });
};
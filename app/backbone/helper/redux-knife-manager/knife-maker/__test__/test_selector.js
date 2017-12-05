import _ from 'lodash';

export default ({ knifeMaker }) => {
  describe('test knifeMaker() selector', () => {
    it('should get the empty action with empty namespace', () => {
      const { selector } = knifeMaker.make({});

      selector.should.to.eql({});
    });

    it('should only get the namesapce selector without defaultState', () => {
      const { selector } = knifeMaker.make({
        namespace: 'hahaha',
      });
      selector.getHahaha.should.be.an('function');
    });

    it('should make selector successfully', () => {
      const namespace = 'hahaha';
      const defaultState = {
        name: 'lala',
        phone: 3345678,
      };

      const { selector } = knifeMaker.make({
        namespace,
        defaultState,
      });

      // test
      const test = {
        name: 'kychen',
        phone: 8765433,
      };
      const state = {
        my: {
          test: {
            knife: {
              maker: {
                [namespace]: test,
              },
            },
          },
        },
      };

      const testcases = {
        getHahaha: test,
        getHahahaName: test.name,
        getHahahaPhone: test.phone,
      };
      _.forEach(testcases, (value, key) => {
        selector[key](state).should.to.eql(value);
      });
    });
  });
};

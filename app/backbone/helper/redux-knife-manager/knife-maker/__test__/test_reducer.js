export default ({ knifeMaker }) => {
  describe('test knifeMaker() reducer', () => {
    const actionMap = [
      'increase',
      'decrease',
    ];

    const defaultState = {
      value: 0,
    };

    const reducerMap = ({ increase, decrease }) => ({
      [increase]: (state, action) => ({
        value: state.value + action.value,
      }),

      [decrease]: (state, action) => ({
        value: state.value - action.value,
      }),
    });

    let knife;
    it('should make reducer successfully', () => {
      knife = knifeMaker.make({
        namespace: 'haha',
        defaultState,
        actionMap,
        reducerMap,
      });
    });

    it('check defaultState', () => {
      const { reducer } = knife;
      reducer().should.to.eql(defaultState);
    });

    it('check increase', () => {
      const { reducer, action } = knife;

      reducer({ value: 1 }, action.increase({ value: 10 })).should.to.eql({ value: 11 });
    });

    it('check decrease', () => {
      const { reducer, action } = knife;

      reducer({ value: 1 }, action.decrease({ value: 10 })).should.to.eql({ value: -9 });
    });
  });
};

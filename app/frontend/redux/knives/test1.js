export default {
  actionMap: ['increaseTest1', 'decreaseTest1'],
  reducerMap: ({ increaseTest1, decreaseTest1 }) => ({
    [increaseTest1]: (state) => {
      const { count } = state;

      return { count: count + 1 };
    },

    [decreaseTest1]: (state) => {
      const { count } = state;

      return { count: count - 1 };
    },
  }),
  defaultState: {
    count: 0,
  },
};

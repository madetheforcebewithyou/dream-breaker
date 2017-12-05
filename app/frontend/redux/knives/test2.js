export default {
  actionMap: ['increaseTest2', 'decreaseTest2'],
  reducerMap: ({ increaseTest2, decreaseTest2 }) => ({
    [increaseTest2]: (state) => {
      const { count } = state;

      return { count: count + 1 };
    },

    [decreaseTest2]: (state) => {
      const { count } = state;

      return { count: count - 1 };
    },
  }),
  defaultState: {
    count: 0,
  },
};

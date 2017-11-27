export default {
  withPlaceholder: {
    placeholder: 'this is a placeholder',
  },
  withMaxLength: {
    maxLength: 10,
  },
  withIcon: {
    icon: 'fa-search',
  },
  withInputIcon: {
    inputIcon: '',
  },
  withDisabled: {
    disabled: true,
  },
  withMessage: {
    message: {
      type: 'warning',
      text: 'Something is wrong',
    },
  },
  withLoading: {
    isLoading: true,
  },
  withHandleChanged: (action) => ({
    handleChanged: (value) => {
      action('handleChanged')(value);
    },
  }),
  withOnFocus: (action) => ({
    onFocus: () => {
      action('onFocus')();
    },
  }),
  withOnBlur: (action) => ({
    onBlur: () => {
      action('onBlur')();
    },
  }),
};

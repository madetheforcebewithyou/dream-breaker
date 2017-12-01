export default (action) => ({
  onClick: () => {
    action('onClick')();
  },
  buttonText: 'button',
});

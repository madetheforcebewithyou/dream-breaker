import _ from 'lodash';

function needUpdate(instance, nextProps, nextState) {
  const equal = (prev, next) =>
    _.isEqual(_.omit(prev, _.functions(prev)), _.omit(next, _.functions(next)));

  return !equal(instance.props, nextProps) || !equal(instance.state, nextState);
}

export default (baseComponent) => {
  Object.assign(baseComponent.prototype, {

    /**
     * Invoked before rendering when new props or state are being received.
     * This method is not called for the initial render or when forceUpdate is used.
     */
    shouldComponentUpdate(nextProps, nextState) {
      return needUpdate(this, nextProps, nextState);
    },
  });

  return baseComponent;
};

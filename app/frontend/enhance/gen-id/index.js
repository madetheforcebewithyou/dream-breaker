import _ from 'lodash';

export default (prefix) => (baseComponent) => {
  Object.assign(baseComponent.prototype, {
    genId(...tiles) {
      const { cid } = this.props;


      return _.filter([prefix, cid, ...tiles], (v) => !_.isEmpty(v)).join('-').toLowerCase();
    },
  });

  return baseComponent;
};

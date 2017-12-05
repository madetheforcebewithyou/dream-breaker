import _ from 'lodash';
import ReduxKnifeManager from './../';
import { generateConfig } from './utils.js';

export default () => {
  describe('test getKnives', () => {
    it('should get a empty object', () => {
      const reduxKnifeManager = new ReduxKnifeManager();

      reduxKnifeManager.getKnives().should.to.eql({});
    });

    it('should get knives successfully', () => {
      const reduxKnifeManager = new ReduxKnifeManager();

      const config1 = generateConfig();
      const config2 = generateConfig();
      const config3 = generateConfig();


      reduxKnifeManager.add(config1);
      reduxKnifeManager.add(config2);
      reduxKnifeManager.add(config3);

      const knives = reduxKnifeManager.getKnives();
      _.forEach([config1.namespace, config2.namespace, config3.namespace], (namespace) => {
        knives[namespace].should.be.an('object');
        knives[namespace].action.should.be.an('object');
        knives[namespace].actionType.should.be.an('object');
        knives[namespace].reducer.should.be.an('function');
        knives[namespace].selector.should.be.an('object');
      });
    });
  });
};

import ReduxKnifeManager from './../';
import { generateConfig } from './utils.js';

export default () => {
  describe('test getRootReducer', () => {
    it('should get a function', () => {
      const reduxKnifeManager = new ReduxKnifeManager();

      reduxKnifeManager.getRootReducer().should.be.an('function');
    });

    it('should get rootReducer with 3 knive successfully', () => {
      const reduxKnifeManager = new ReduxKnifeManager();

      const config1 = generateConfig();
      const config2 = generateConfig();
      const config3 = generateConfig();


      reduxKnifeManager.add(config1);
      reduxKnifeManager.add(config2);
      reduxKnifeManager.add(config3);

      reduxKnifeManager.getRootReducer().should.be.an('function');
    });
  });
};

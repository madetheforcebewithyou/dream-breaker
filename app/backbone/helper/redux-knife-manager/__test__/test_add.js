import ReduxKnifeManager from './../';
import { generateConfig } from './utils.js';

export default () => {
  describe('test add', () => {
    it('should get an error with the invalid namespace', () => {
      const reduxKnifeManager = new ReduxKnifeManager();
      expect(() => reduxKnifeManager.add({})).to.throw('should specific the namespace.');
    });

    it('should add the knife successfully', () => {
      const reduxKnifeManager = new ReduxKnifeManager();
      reduxKnifeManager.add(generateConfig());
    });
  });
};

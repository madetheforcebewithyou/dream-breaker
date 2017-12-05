import ReduxKnifeManager from './../';
import { generateConfig } from './utils.js';

describe('test ReduxKnifeManager.getRootReducer()', () => {
  it('should get a function', () => {
    const reduxKnifeManager = new ReduxKnifeManager();

    reduxKnifeManager.getRootReducer().should.be.an('function');
  });

  it('should get rootReducer with 3 knive successfully', () => {
    const reduxKnifeManager = new ReduxKnifeManager();

    const config1 = generateConfig();
    const config2 = generateConfig();
    const config3 = generateConfig();


    reduxKnifeManager.add(config1.namespace, config1.config);
    reduxKnifeManager.add(config2.namespace, config2.config);
    reduxKnifeManager.add(config3.namespace, config3.config);

    reduxKnifeManager.getRootReducer().should.be.an('function');
  });
});

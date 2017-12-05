import ReduxKnifeManager from './../';
import { generateConfig } from './utils.js';

describe('test ReduxKnifeManager.add()', () => {
  it('should get an error with the invalid namespace', () => {
    const reduxKnifeManager = new ReduxKnifeManager();
    expect(() => reduxKnifeManager.add(undefined, {})).to.throw('should specific the namespace.');
  });

  it('should add the knife successfully', () => {
    const reduxKnifeManager = new ReduxKnifeManager();
    const { namespace, config } = generateConfig();

    reduxKnifeManager.add(namespace, config);
  });
});

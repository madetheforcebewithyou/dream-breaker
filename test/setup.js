import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

global.sinon = sinon;
global.expect = chai.expect;
chai.should();
chai.use(sinonChai);

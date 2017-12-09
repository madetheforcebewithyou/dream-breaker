import Http from './../';

describe('test Http.request()', () => {
  it('should send the request successfully', (done) => {
    const http = new Http();

    http.request({
      url: 'https://www.google.com',
    })
    .then((result) => {
      const { error, timeout, response } = result;
      error.should.to.eql(false);
      timeout.should.to.eql(false);
      response.status.should.to.eql(200);
      done();
    })
    .catch(done);
  });

  it('the request should be timed out with timeout = 1 ms', (done) => {
    const http = new Http();

    http.request({
      url: 'https://www.google.com',
      timeout: 1,
    })
    .then((result) => {
      const { error, timeout, response } = result;
      error.should.to.eql(true);
      timeout.should.to.eql(true);
      response.data.errorMessage.should.to.eql('timeout of 1ms exceeded');
      done();
    })
    .catch(done);
  });

  it('the request should be timed out with the invalid url', (done) => {
    const http = new Http();

    http.request({
      url: 'abcdfeghijkl123!@#weqwe',
    })
    .then((result) => {
      const { error, timeout, response } = result;
      error.should.to.eql(true);
      timeout.should.to.eql(false);
      response.data.errorCode.should.to.eql('000000');
      done();
    })
    .catch(done);
  });
});

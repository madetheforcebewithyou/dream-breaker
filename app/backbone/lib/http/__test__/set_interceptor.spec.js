import Http from './../';

describe('test Http.setInterceptor()', () => {
  it('should handle the success interceptor successfully', (done) => {
    const http = new Http();

    http.setInterceptor({
      type: 'response',
      key: 'test',
      success: () => {
        done();
      },
    });

    http.request({
      url: 'https://www.google.com',
    })
    .catch(done);
  });

  it('should handle the failure interceptor with the timedout request', (done) => {
    const http = new Http();

    http.setInterceptor({
      type: 'response',
      key: 'test',
      failure: (error) => {
        error.code.should.to.eql('ECONNABORTED');
        done();
      },
    });

    http.request({
      url: 'https://www.google.com',
      timeout: 1,
    })
    .catch(done);
  });

  it('should handle the failure interceptor with the error request', (done) => {
    const http = new Http();

    http.setInterceptor({
      type: 'response',
      key: 'test',
      failure: (error) => {
        error.code.should.to.eql('ECONNREFUSED');
        done();
      },
    });

    http.request({
      url: 'qwelsdjfkjkl!@#www',
    })
    .catch(done);
  });
});

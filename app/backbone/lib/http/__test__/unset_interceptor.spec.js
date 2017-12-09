import Http from './../';

describe('test Http.unsetInterceptor()', () => {
  it('should unset the interceptor successfully', (done) => {
    const http = new Http();

    const type = 'response';
    const key = 'test';
    http.setInterceptor({
      type: 'response',
      key: 'test',
      success: () => {
        done();
      },
    });
    http.unsetInterceptor({ type, key });

    http.request({
      url: 'https://www.google.com',
    })
    .then(() => done())
    .catch(done);
  });
});

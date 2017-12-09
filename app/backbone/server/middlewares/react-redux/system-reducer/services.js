import _ from 'lodash';
import { Http } from './../../../../lib/server';

function createHttp(req) {
  const { protocol } = req;
  const { cookie, host } = req.headers;
  const port = req.socket.localPort;

  let headers = {};
  headers = _.isNil(cookie) ? headers : { ...headers, cookie };
  headers = _.isNil(host) ? headers : { ...headers, host };

  return new Http({
    baseURL: `${protocol}://localhost:${port}`,
    headers,
  });
}

export default (req) => () => {
  const http = createHttp(req);

  return {
    http,
  };
};

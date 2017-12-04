import DreamBreakerClient from './../backbone/client';
import routesRoot from './routes';
import reduxRoot from './redux';

const client = new DreamBreakerClient({
  routes: routesRoot,
  redux: reduxRoot,
});

client.launch();

if (module.hot) {
  module.hot.accept('./routes', () => {
    client.hot({
      routes: require('./routes').default,
    });
  });

  module.hot.accept('./redux', () => {
    client.hot({
      redux: require('./redux').default,
    });
  });
}

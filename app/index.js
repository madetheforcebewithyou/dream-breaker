import backbone from './backbone';
import routes from './frontend/routes';

export default function launchApp(config) {
  backbone({
    ...config,
    reactSSR: {
      routes,
    },
  });
}

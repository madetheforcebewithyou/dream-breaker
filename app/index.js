import backbone from './backbone';
import routes from './frontend/routes';
import redux from './frontend/redux';

export default function launchApp(config) {
  backbone({
    ...config,
    react: {
      routes,
      redux,
    },
  });
}

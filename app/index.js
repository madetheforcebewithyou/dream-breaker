import _ from 'lodash';
import backbone from './backbone';
import routes from './frontend/routes';
import redux from './frontend/redux';

export default function launchApp(config = {}) {
  const launchConfig = _.merge(
    {},
    config,
    {
      react: {
        routes,
        redux,
      },
    },
  );

  backbone(launchConfig);
}

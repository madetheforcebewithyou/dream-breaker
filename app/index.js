import _ from 'lodash';
import backbone from './backbone/server';
import routesRoot from './frontend/routes';
import reduxRoot from './frontend/redux';

export default function launchApp(config = {}) {
  const launchConfig = _.merge(
    {},
    config,
    {
      react: {
        routes: routesRoot,
        redux: reduxRoot,
      },
    },
  );

  return backbone(launchConfig);
}

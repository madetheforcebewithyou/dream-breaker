import { configure } from '@storybook/react';

const req = require.context('./../app/frontend/presentation/components', true, /story\/index\.js$/);
configure(() => {
  req.keys().forEach((path) => req(path));
}, module);

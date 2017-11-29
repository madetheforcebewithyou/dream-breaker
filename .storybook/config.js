import { configure } from '@storybook/react';
import './../app/frontend/stylesheets/main.global.scss'

const req = require.context('./../app/frontend/components', true, /story\/index\.js$/);
configure(() => {
  req.keys().forEach((path) => req(path));
}, module);

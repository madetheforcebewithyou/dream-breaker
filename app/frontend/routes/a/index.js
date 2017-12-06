import React from 'react';
import Loadable from 'react-loadable';
import { LoadingSpinner } from './../../presentation/components';

export default Loadable({
  loader: () => import(/* webpackChunkName: "loadable_a" */ './module.js'),
  loading() {
    return <LoadingSpinner />;
  },
  delay: 1000,
});

import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './presentation/components';

const renderer = () => {
  ReactDOM.render(
    <Button buttonText="12ww" />,
    document.getElementById('root'),
  );
};

renderer();

if (module.hot) {
  module.hot.accept(() => {
    renderer();
  });
}

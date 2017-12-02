import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './presentation/components';

const render = () => {
  ReactDOM.render(
    <Button buttonText="12ww" />,
    document.getElementById('root'),
  );
};

render();

if (module.hot) {
  module.hot.accept('./presentation/components/button/index.js', () => {
    console.log('test');
    render();
  });
}

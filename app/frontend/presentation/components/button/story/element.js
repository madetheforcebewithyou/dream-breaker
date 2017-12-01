import React from 'react';
import Props from './props.js';
import Button from './../';

export const normal = (action) => (
  <Button
    {...Props(action)}
  />
);

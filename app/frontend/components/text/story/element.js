import React from 'react';
import Props from './props.js';
import Text from './../';

export const text = (action) => (
  <Text
    {...Props.withPlaceholder}
    {...Props.withMaxLength}
    {...Props.withHandleChanged(action)}
    {...Props.withOnFocus(action)}
    {...Props.withOnBlur(action)}
  />
);

export const icon = (action) => (
  <Text
    {...Props.withPlaceholder}
    {...Props.withIcon}
    {...Props.withHandleChanged(action)}
    {...Props.withOnFocus(action)}
    {...Props.withOnBlur(action)}
  />
);

export const inputIcon = (action) => (
  <Text
    {...Props.withPlaceholder}
    {...Props.withInputIcon}
    {...Props.withHandleChanged(action)}
    {...Props.withOnFocus(action)}
    {...Props.withOnBlur(action)}
  />
);

export const disabled = (action) => (
  <Text
    {...Props.withPlaceholder}
    {...Props.withDisabled}
    {...Props.withHandleChanged(action)}
    {...Props.withOnFocus(action)}
    {...Props.withOnBlur(action)}
  />
);

export const message = (action) => (
  <Text
    {...Props.withPlaceholder}
    {...Props.withMessage}
    {...Props.withHandleChanged(action)}
    {...Props.withOnFocus(action)}
    {...Props.withOnBlur(action)}
  />
);

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { normal } from './element.js';

storiesOf('LoadingSpinner', module)
  .add('normal style', () => normal(action));

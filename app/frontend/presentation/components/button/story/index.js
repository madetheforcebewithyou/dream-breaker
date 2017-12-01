import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered';
import { normal } from './element.js';

storiesOf('Button', module)
  .addDecorator(centered)
  .add('normal style', () => normal(action));

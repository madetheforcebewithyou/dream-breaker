import { action, storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { text, icon, disabled, message, inputIcon, loading } from './element.js';

storiesOf('Text', module)
  .addDecorator(centered)
  .add('with normal style', () => text(action))
  .add('with icon', () => icon(action))
  .add('with disabled', () => disabled(action))
  .add('with message', () => message(action))
  .add('with inputIcon', () => inputIcon(action))
  .add('with loading', () => loading(action));

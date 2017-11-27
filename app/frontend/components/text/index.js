import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './main.local.nohash.scss';
import { genId, shouldComponentUpdate } from './../../enhance';

const _input = Symbol();
const _renderGroup = Symbol();
const _renderGroupIcon = Symbol();
const _renderGroupInput = Symbol();
const _renderMessage = Symbol();
const _handleChanged = Symbol();
const _defaultValue = Symbol();
const _getInputStyle = Symbol();
const _handleInputFocus = Symbol();
const _handleInputBlur = Symbol();
const _renderIcon = Symbol();

const _defaultStyle = 'dream-breaker-input-group';
const _focusStyle = 'dream-breaker-input-focus';
const _warningStyle = 'dream-breaker-input-warn';
const _disableStyle = 'dream-breaker-input-group-disable';

@genId('text')
@shouldComponentUpdate
export default class Text extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    message: PropTypes.object,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    handleChanged: PropTypes.func,
    icon: PropTypes.string,
    className: PropTypes.string,
    inputIcon: PropTypes.string,
    type: PropTypes.string,
    tabIndex: PropTypes.number,
    autoFocusInputElement: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    isLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {};
    this.state.value = value || this[_defaultValue];
    this.state.inputStatus = 'blur';
  }

  componentDidMount() {
    const { autoFocusInputElement } = this.props;
    if (autoFocusInputElement && this[_input]) {
      this[_input].focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;

    const setValue = _.isNil(value) ? '' : String(value);
    if (setValue === this.state.value) {
      return;
    }

    this.setState({ value: setValue });
  }

  get [_handleChanged]() {
    return (event) => {
      this.setState({ value: event.target.value });
      const { handleChanged } = this.props;

      if (_.isFunction(handleChanged)) {
        handleChanged(event);
      }
    };
  }

  get [_defaultValue]() {
    return '';
  }

  get [_handleInputFocus]() {
    return (event) => {
      this.setState({ inputStatus: event.type });
      const { onFocus } = this.props;

      if (_.isFunction(onFocus)) {
        onFocus(event);
      }
    };
  }

  get [_handleInputBlur]() {
    return (event) => {
      this.setState({ inputStatus: event.type });
      const { onBlur } = this.props;

      if (_.isFunction(onBlur)) {
        onBlur(event);
      }
    };
  }

  get [_getInputStyle]() {
    let inputStyle = _defaultStyle;
    const { inputStatus } = this.state;
    const { disabled, message } = this.props;

    if (disabled) {
      inputStyle = `${_defaultStyle} ${_disableStyle}`;
      return inputStyle;
    }

    if (inputStatus === 'focus') {
      inputStyle = `${_defaultStyle} ${_focusStyle}`;
      return inputStyle;
    }

    if (message) {
      inputStyle = `${_defaultStyle} ${_warningStyle}`;
      return inputStyle;
    }

    return inputStyle;
  }

  get [_renderGroupIcon]() {
    const { icon } = this.props;
    if (!icon) {
      return null;
    }

    return (
      <span className="input-group-addon dream-breaker-input-addon">
        <i
          id={this.genId('group', 'icon')}
          className={`fa ${icon} dream-breaker-icon`}
          aria-hidden="true"
        />
      </span>
    );
  }

  get [_renderIcon]() {
    const { inputIcon, isLoading } = this.props;

    if (isLoading) {
      return (
        <i className="dream-breaker-loading" />
      );
    }

    return (
      <i
        className="dream-breaker-fa fa"
        data-content={inputIcon}
      />
    );
  }

  get [_renderGroupInput]() {
    const { maxLength, disabled, placeholder, type, tabIndex } = this.props;
    const { value } = this.state;
    const unique = this.genId('group', 'input');

    return (
      <input
        className="form-control dream-breaker-form-control"
        id={unique}
        name={unique}
        maxLength={maxLength}
        type={type || 'text'}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={this[_handleChanged]}
        onBlur={this[_handleInputBlur]}
        onFocus={this[_handleInputFocus]}
        tabIndex={tabIndex}
        ref={(ref) => {
          this[_input] = ref;
        }}
      />
    );
  }

  get [_renderGroup]() {
    const { icon } = this.props;

    return (
      <div
        id={this.genId('group')}
        className={`${this[_getInputStyle]} ${icon ? 'input-group' : ''}`}
      >
        {this[_renderIcon]}
        {this[_renderGroupIcon]}
        {this[_renderGroupInput]}
      </div>
    );
  }

  get [_renderMessage]() {
    const styles = {
      warning: 'dream-breaker-input-warnmsg',
    };

    const { message } = this.props;
    if (!message) {
      return null;
    }

    const { type, text } = message;
    return (
      <div
        id={this.genId('message')}
        className={styles[type] || ''}
      >
        {text}
      </div>
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={`dream-breaker-text ${className || ''}`} id={this.genId()}>
        {this[_renderGroup]}
        {this[_renderMessage]}
      </div>
    );
  }
}

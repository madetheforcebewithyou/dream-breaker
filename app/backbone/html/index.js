import React from 'react';
import serialize from 'serialize-javascript';
import PropTypes from 'prop-types';
import _ from 'lodash';

const _renderInitialState = Symbol();
const _renderPolyfill = Symbol();
const _renderContent = Symbol();
const _renderDevDom = Symbol();

export default class Html extends React.Component {
  static propTypes = {
    head: PropTypes.object.isRequired,
    content: PropTypes.element,
    initialState: PropTypes.object,
    dev: PropTypes.object,
    assets: PropTypes.object,
  };

  getDefaultProps() {
    return {
      assets: {},
    };
  }

  get [_renderInitialState]() {
    let state = null;
    if (this.props.initialState) {
      const innerHtml = `window.__INITIAL_STATE__ = ${serialize(this.props.initialState, { isJSON: true })}`;
      state = <script dangerouslySetInnerHTML={{ __html: innerHtml }} />;
    }
    return state;
  }

  get [_renderPolyfill]() {
    const innerHtml = '(function(){var ef = function(){};window.console = ' +
      'window.console || {log:ef,warn:ef,error:ef,dir:ef};}());';
    return <script dangerouslySetInnerHTML={{ __html: innerHtml }} />;
  }

  get [_renderContent]() {
    const { content } = this.props;

    return (
      <div id="root">
        {content}
      </div>
    );
  }

  get [_renderDevDom]() {
    const { dev } = this.props;

    if (_.isNil(dev)) {
      return null;
    }
    return <div id="dev">{dev}</div>;
  }

  render() {
    const { head, assets } = this.props;

    return (
      <html lang="en">
        <head>
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {assets.global ? <link rel="stylesheet" href={assets.global} /> : null}
          {assets.local ? <link rel="stylesheet" href={assets.local} /> : null}
          {assets.globalErrorHandler ? <script src={assets.globalErrorHandler} /> : null}
          {this[_renderPolyfill]}
        </head>
        <body>
          {this[_renderContent]}
          {this[_renderDevDom]}
          {this[_renderInitialState]}
          {assets.vendor ? <script defer src={assets.vendor} /> : null}
          {assets.app ? <script defer src={assets.app} /> : null}
        </body>
      </html>
    );
  }
}

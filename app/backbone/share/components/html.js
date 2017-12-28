import React from 'react';
import serialize from 'serialize-javascript';
import PropTypes from 'prop-types';
import _ from 'lodash';

const _renderInitialState = Symbol();
const _renderPolyfill = Symbol();
const _renderContent = Symbol();
const _renderDevDom = Symbol();
const _renderStylesheets = Symbol();
const _renderJavascripts = Symbol();

export default class Html extends React.Component {
  static propTypes = {
    head: PropTypes.object.isRequired,
    content: PropTypes.element,
    initialState: PropTypes.object,
    devTool: PropTypes.object,
    assets: PropTypes.object,
  };

  getDefaultProps() {
    return {
      assets: {
        javascripts: [],
        stylesheets: [],
      },
    };
  }

  get [_renderInitialState]() {
    const { initialState } = this.props;
    if (_.isNil(initialState)) {
      return null;
    }

    const innerHtml = `window.__INITIAL_STATE__ = ${serialize(initialState, { isJSON: true })}`;
    return <script dangerouslySetInnerHTML={{ __html: innerHtml }} />;
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
    const { devTool } = this.props;
    if (_.isNil(devTool)) {
      return null;
    }

    return <div id="dev-tool">{devTool}</div>;
  }

  get [_renderStylesheets]() {
    const { assets } = this.props;

    return _.map(assets.stylesheets, (stylesheet, idx) =>
      <link key={`${stylesheet}-${idx}`} rel="stylesheet" href={stylesheet} />,
    );
  }

  get [_renderJavascripts]() {
    const { assets } = this.props;

    return _.map(assets.javascripts, (javascript, idx) =>
      <script key={`${javascript}-${idx}`} defer src={javascript} />,
    );
  }

  render() {
    const { head } = this.props;

    return (
      <html lang="en">
        <head>
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {this[_renderStylesheets]}
          {this[_renderPolyfill]}
        </head>
        <body>
          {this[_renderContent]}
          {this[_renderDevDom]}
          {this[_renderInitialState]}
          {this[_renderJavascripts]}
        </body>
      </html>
    );
  }
}

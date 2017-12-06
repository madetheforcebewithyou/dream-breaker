import React from 'react';
import PropTypes from 'prop-types';
import { genId, shouldComponentUpdate } from './../../../enhance';
import './styles/main.scss';

@genId('db-loading-spinner')
@shouldComponentUpdate
export default class Button extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    size: 150,
  };

  render() {
    const { className, size } = this.props;

    return (
      <div className={className} styleName="db-loading-spinner">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          styleName="db-svg"
          style={{
            width: size,
            height: size,
            left: `calc( 50% - ${size / 2}px )`,
            top: `calc( 50% - ${size / 2}px )`,
          }}
        >
          <circle
            styleName="db-background-circle"
            cx={50}
            cy={50}
            r={30}
            strokeWidth={6}
            fill="none"
          />
          <circle
            styleName="db-circle"
            cx={50}
            cy={50}
            r={30}
            strokeWidth={6}
            fill="none"
            transform="rotate(144 50 50)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              calcMode="linear"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
              dur={1.5}
              begin="0s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              calcMode="linear"
              values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882"
              keyTimes="0;0.5;1"
              dur={1.5}
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    );
  }
}

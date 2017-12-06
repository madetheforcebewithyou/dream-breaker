import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { knives } from './../../redux/knives';

@connect()
export default class A extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(knives.test1.action.increaseTest1());
  }

  render() {
    return (
      <div>A</div>
    );
  }
}

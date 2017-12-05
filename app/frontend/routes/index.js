import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { knives } from './../redux/knives';
import { Button } from './../presentation/components';

@connect()
class A extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(knives.test1.action.increaseTest1());
  }

  render() {
    return <div>A</div>;
  }
}


const routes = (
  <Switch>
    <Route exact path="/" component={() => <div>INDEX</div>} />
    <Route path="/A" component={A} />
    <Route path="/B" component={Button} />
    <Route path="/C" component={() => <div>C</div>} />
  </Switch>
);

export default routes;

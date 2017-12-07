import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Button } from './../presentation/components';
import LoadableTest from './a';
import { knives } from './../redux/knives';

const _interval = Symbol();
@connect(() => {})
class TestSagaHmr extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this[_interval] = null;
  }

  componentDidMount() {
    this[_interval] = setInterval(() => {
      const { dispatch } = this.props;
      dispatch(knives.test1.action.increaseTest1());
    }, 1000);
  }

  componentWillUnmount() {
    if (this[_interval]) clearInterval(this[_interval]);
  }

  render() {
    return <div>TestSagaHmr</div>;
  }
}

const routes = (
  <Switch>
    <Route exact path="/" component={() => <div>INDEX</div>} />
    <Route path="/A" component={LoadableTest} />
    <Route path="/B" component={() => <Button>Test</Button>} />
    <Route path="/C" component={() => <TestSagaHmr />} />
  </Switch>
);

export default routes;

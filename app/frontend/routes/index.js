import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';

@connect()
class A extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(push('/C'));
  }

  render() {
    return <div>A</div>;
  }
}


const routes = (
  <Switch>
    <Route exact path="/" component={() => <div>INDEX</div>} />
    <Route path="/A" component={A} />
    <Route path="/B" component={() => <div>B</div>} />
    <Route path="/C" component={() => <div>C</div>} />
  </Switch>
);

export default routes;

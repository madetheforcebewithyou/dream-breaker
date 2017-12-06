import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Button } from './../presentation/components';
import LoadableTest from './a';


const routes = (
  <Switch>
    <Route exact path="/" component={() => <div>INDEX</div>} />
    <Route path="/A" component={LoadableTest} />
    <Route path="/B" component={() => <Button>Test</Button>} />
    <Route path="/C" component={() => <div>C</div>} />
  </Switch>
);

export default routes;

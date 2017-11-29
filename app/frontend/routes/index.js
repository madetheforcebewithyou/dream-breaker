import React from 'react';
import { Switch, Route } from 'react-router-dom';

const routes = (
  <Switch>
    <Route exact path="/" component={() => <div>INDEX</div>} />
    <Route path="/A" component={() => <div>A</div>} />
    <Route path="/B" component={() => <div>B</div>} />
  </Switch>
);

export default routes;

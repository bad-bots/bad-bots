import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ProtectedRoute, UnprotectedRoute } from './Wrappers';
import { Login, Register } from './index';

const Routes = () => {
  return (
    <Switch>
      <Switch>
        <UnprotectedRoute path="/login" component={Login} />
        <UnprotectedRoute path="/register" component={Register} />
      </Switch>
    </Switch>
  );
};

export default Routes;

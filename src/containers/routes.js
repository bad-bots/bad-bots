import React from 'react';
import { Switch } from 'react-router-dom';
import { UnprotectedRoute } from './Wrappers';
import { Login, Register } from './index';

const Routes = () => {
  return (
    <React.Fragment>
      <Switch>
        <UnprotectedRoute exact path="/login" component={Login} />
        <UnprotectedRoute exact path="/register" component={Register} />
      </Switch>
    </React.Fragment>
  );
};

export default Routes;

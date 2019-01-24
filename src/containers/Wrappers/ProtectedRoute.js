import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { makeSelectCurrentUser } from '../App/selectors';

const ProtectedRoute = ({
  component: Component,
  currentUser,
  dispatch,
  ...rest
}) => {
  if (currentUser) {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else {
    return <Route {...rest} render={_ => <Redirect to="/login" />} />;
  }
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser()
});

export default connect(mapStateToProps)(ProtectedRoute);

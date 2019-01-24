import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { makeSelectCurrentUser } from '../App/selectors';

const UnprotectedRoute = ({
  component: Component,
  currentUser,
  dispatch, // don't pass dispatch
  ...rest
}) => {
  if (!currentUser) {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else {
    return <Route {...rest} render={_ => <Redirect to="/" />} />;
  }
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser()
});

export default connect(mapStateToProps)(UnprotectedRoute);

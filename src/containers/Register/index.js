import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import withTransition from '../Wrappers/withTransition';
import withBackground, {Wrapper} from '../Wrappers/withBackground';

import RegisterForm from './Form';
import { registerUser } from './actions';
import { makeSelectRegistrationError } from './selectors';

const Register = props => {
  return (
    <div className="auth-page">
      <div className="auth-form-wrapper">
        <div className="auth-logo">
          <img src="/images/logo.svg" alt="B4dB0tz" />
        </div>
        <h3 className="auth-title">Register</h3>
        <RegisterForm
          register={props.registerUser}
          registrationError={props.registrationError}
        />
        <div className="auth-alt-option">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () =>
  createStructuredSelector({
    registrationError: makeSelectRegistrationError()
  });

const mapDispatchToProps = dispatch => ({
  registerUser: data => dispatch(registerUser(data))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withWrapper = withBackground(Wrapper('/images/march.jpg'));

export default compose(
  withWrapper,
  withTransition,
  withConnect
)(Register);

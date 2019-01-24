import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import Button from '@material-ui/core/Button';

import withTransition from '../Wrappers/withTransition';
import withBackground, { Wrapper } from '../Wrappers/withBackground';

import LoginForm from './Form';
import { loginUser } from './actions';
import { makeSelectLoginError } from './selectors';

import './Login.css';

const Login = props => {
  return (
    <div className="auth-page">
      <div className="auth-form-wrapper">
        <div className="auth-logo">
          <img src="/images/logo.svg" alt="B4dB0tz" />
        </div>
        <h3 className="auth-title">Login</h3>
        <LoginForm
          id="login-form"
          login={props.loginUser}
          loginError={props.loginError}
        />

        <div className="social-logins">
          <Button
            variant="contained"
            color="secondary"
            label="Submit"
            type="submit"
            className="auth-submit-button"
          >
            Login with Google
          </Button>
        </div>
        <div className="auth-alt-option">
          <span className="text">Dont have an account?</span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () =>
  createStructuredSelector({
    loginError: makeSelectLoginError()
  });

const mapDispatchToProps = dispatch => ({
  loginUser: data => dispatch(loginUser(data))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withWrapper = withBackground(Wrapper('/images/september.jpg'));

export default compose(
  withWrapper,
  withTransition,
  withConnect
)(Login);

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import history from '../../utils/history';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { makeSelectCurrentUser } from '../App/selectors';
import { logout } from '../App/actions';
import UserOptions from './UserOptions';

import styles from './styles';
import './Toolbar.css';

const AppToolbar = props => {
  const { classes } = props;
  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar} color="default">
        <Toolbar>
          <img src="/images/logo.svg" className={classes.logo} alt="B4dB0tz" />
          <Link to="/" className={classes.title}>
            <h2>B4dB0tz</h2>
          </Link>
          <div className={classes.toolbarContent} />
          {!props.user ? (
            <React.Fragment>
              <div className="vertical-divider" />
              <Button
                className={classes.loginBtn}
                onClick={() => history.push('/register')}
              >
                REGISTER
              </Button>
              <div className="vertical-divider" />
              <Button
                className={classes.loginBtn}
                onClick={() => history.push('/login')}
              >
                LOGIN
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <UserOptions
                user={props.user}
                logout={props.logout}
                className="user-profile"
              />
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
    </React.Fragment>
  );
};

const mapStateToProps = () =>
  createStructuredSelector({
    user: makeSelectCurrentUser()
  });

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AppToolbar));

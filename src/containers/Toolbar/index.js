import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import { makeSelectCurrentUser } from '../App/selectors';
import { logout } from '../App/actions';
import UserOptions from './UserOptions';

import styles from './styles';
import './Toolbar.css';

const AppToolbar = props => {
  const { classes } = props;

  return (
    <AppBar position="fixed" className={classes.appBar} color="default">
      <Toolbar disableGutters>
        <img src="/images/logo.svg" className={classes.logo} alt="B4dB0tz" />
        <Link to="/" className={classes.title}>
          <h2>B4dB0tz</h2>
        </Link>
        <div className={classes.toolbarContent} />
        <UserOptions
          user={props.user}
          logout={props.logout}
          className="user-profile"
        />
      </Toolbar>
    </AppBar>
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

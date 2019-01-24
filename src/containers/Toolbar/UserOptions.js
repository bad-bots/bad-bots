import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import { withStyles } from '@material-ui/core/styles';

import history from '../../utils/history';

import CenteredMenu from '../../components/Menus/CenteredMenu';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  paper: {
    marginRight: theme.spacing.unit * 2
  }
});

class UserOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleLogoutOut = () => {
    this.props.logout();
    this.handleClose();
  };

  handleViewProfile = () => {
    history.push('/user-profile');
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = !!anchorEl;

    return (
      <div className={classes.root}>
        <div>
          <Button
            aria-owns={open ? 'user-profile-options' : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            <img
              className="profile-logo"
              src="/images/profile.jpg"
              alt="Profile"
            />
            {this.props.user && (
              <Typography className="user" variant="subtitle1">
                {this.props.user.firstName}
              </Typography>
            )}
            <KeyboardArrowDown style={{ marginLeft: '5px' }} />
          </Button>

          <CenteredMenu
            open={open}
            anchorEl={anchorEl}
            handleClose={this.handleClose}
          >
            <MenuItem
              onClick={this.handleViewProfile}
              className="profile-option"
            >
              <AccountCircle className="profile-icon" />
              <span>Profile</span>
            </MenuItem>
            <MenuItem onClick={this.handleLogoutOut} className="profile-option">
              <PowerSettingsNew className="profile-icon" />
              <span>Logout</span>
            </MenuItem>
          </CenteredMenu>
        </div>
      </div>
    );
  }
}

UserOptions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserOptions);

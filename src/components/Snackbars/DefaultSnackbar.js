import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const styles = {
  snackbarMessage: {
    display: 'flex',
    alignItems: 'center'
  },
  snackbarIcon: {
    marginRight: 10
  },
  errorSnackbarContent: {
    backgroundColor: 'orangered !important'
  }
};

const DefaultSnackbar = props => {
  const { classes } = props;

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={!!props.appMessage.message}
        autoHideDuration={6000}
        onClose={props.resolveAppMessage}
      >
        <SnackbarContent
          className={
            props.appMessage.type === 'error'
              ? classes.errorSnackbarContent
              : null
          }
          message={
            <span className={classes.snackbarMessage}>
              <Icon className={classes.snackbarIcon}>
                {props.appMessage.icon || 'message'}
              </Icon>
              {props.appMessage.message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={props.resolveAppMessage}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </Snackbar>
    </div>
  );
};

DefaultSnackbar.propTypes = {
  appMessage: PropTypes.object.isRequired,
  resolveAppMessage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(DefaultSnackbar);

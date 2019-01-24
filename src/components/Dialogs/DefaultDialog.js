import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {withStyles} from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  title: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  },
  content: {
    margin: 0,
    padding: theme.spacing.unit * 2
  },
  actions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit
  }
})

const DefaultDialog = props => {
  const {classes} = props

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="dialog-title"
        fullWidth={true}
        maxWidth={props.width}
      >
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h6">{props.title} </Typography>
          {props.handleClose ? (
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={props.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent className={classes.content}>
          {props.contentText && (
            <DialogContentText>{props.contentText}</DialogContentText>
          )}
          {props.renderContent && props.renderContent()}
        </DialogContent>

        {props.renderActions && (
          <DialogActions className={classes.actions}>
            {props.renderActions()}
          </DialogActions>
        )}
      </Dialog>
    </div>
  )
}

DefaultDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  width: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default withStyles(styles, {withTheme: true})(DefaultDialog)

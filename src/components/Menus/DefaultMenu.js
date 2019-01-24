import React from 'react'
import Menu from '@material-ui/core/Menu'
import PropTypes from 'prop-types'

const ITEM_HEIGHT = 48

const DefaultMenu = props => {
  const {open, anchorEl} = props

  return (
    <div>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={props.handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        {props.children}
      </Menu>
    </div>
  )
}

DefaultMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default DefaultMenu

import React from 'react'
import './Confirm.scss'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'

const Confirm = ({open, handleClose, actionHandler}) => {
  return (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    sx={{
      '.MuiPaper-root' : {
        padding: '15px 25px',
        gap: '20px'
      }
    }}
  >
    <DialogTitle id="alert-dialog-title">
      Are you sure?
    </DialogTitle>
    <DialogActions>
      <Button onClick={handleClose} autoFocus>
        Cancel
      </Button> 
      <Button variant='contained' onClick={actionHandler} autoFocus>
        Yes
      </Button> 
    </DialogActions>
  </Dialog>
  )
}

export default Confirm
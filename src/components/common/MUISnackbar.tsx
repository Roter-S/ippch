import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import Snackbar, { type SnackbarOrigin } from '@mui/material/Snackbar'
import MuiAlert, { type AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert (
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface AlertProp {
  type: 'success' | 'info' | 'warning' | 'error'
  message: string
}

interface MUISnackbarProps {
  autoHideDuration: number
  vertical: SnackbarOrigin['vertical']
  horizontal: SnackbarOrigin['horizontal']
  alert: AlertProp | null
}

const MUISnackbar: React.FC<MUISnackbarProps> = ({ autoHideDuration, vertical, horizontal, alert }) => {
  const [open, setOpen] = useState(true)

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
    <Snackbar open={open} autoHideDuration={autoHideDuration} anchorOrigin={{ vertical, horizontal }} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alert?.type} sx={{ width: '100%' }}>
         {alert?.message}
      </Alert>
    </Snackbar>
  </Stack>
  )
}

export default MUISnackbar

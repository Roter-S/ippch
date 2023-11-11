import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Snackbar, { type SnackbarOrigin } from '@mui/material/Snackbar'
import MuiAlert, { type AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})
Alert.displayName = 'Alert'

interface AlertProp {
  type: 'success' | 'info' | 'warning' | 'error'
  message: string
}

interface MUISnackbarProps {
  autoHideDuration: number
  vertical: SnackbarOrigin['vertical']
  horizontal: SnackbarOrigin['horizontal']
  alert: AlertProp | null
  resetAlert: () => void

}

const MUISnackbar: React.FC<MUISnackbarProps> = ({ autoHideDuration, vertical, horizontal, alert, resetAlert }) => {
  const [open, setOpen] = useState(!(alert == null))

  useEffect(() => {
    if (alert != null) {
      setOpen(true)
    }
  }, [alert])

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
    resetAlert()
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

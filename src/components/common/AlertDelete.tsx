import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import WarningIcon from '@mui/icons-material/Warning'
import { deleteDocument } from '../../utils/firestoreUtils'
import { LoadingButton } from '@mui/lab'

interface Props {
  id: string
  collectionName: string
  onUpdate: () => void
}

export default function AlertDialog ({ id, collectionName, onUpdate }: Props) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = async () => {
    setIsSubmitting(true)
    await deleteDocument(collectionName, id)
    setOpen(false)
    setIsSubmitting(false)
    onUpdate()
  }

  return (
    <div>
      <Button
        color="error"
        variant="contained"
        startIcon={<DeleteIcon />}
        onClick={handleClickOpen}
      ></Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <WarningIcon color="warning" /> {'Estas seguro que deseas eliminar?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            color="error"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleDelete}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Aceptar
          </LoadingButton>
          <Button color="primary" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

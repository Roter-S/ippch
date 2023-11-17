import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningIcon from '@mui/icons-material/Warning'
import { deleteDocument, deleteFile, getDocument } from '../../utils/firestoreUtils'
import { LoadingButton } from '@mui/lab'
import { IconButton } from '@mui/material'

interface Props {
  id: string
  collectionName: string
  onUpdate: (id: string) => void
}

export default function AlertDelete ({ id, collectionName, onUpdate }: Props) {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      if (collectionName === 'advertisements') {
        const advertisement = await getDocument(collectionName, id)
        await deleteFile(advertisement?.imagePath)
      }
      await deleteDocument(collectionName, id)
      setOpen(false)
      setIsSubmitting(false)
      onUpdate(id)
    } catch (error: Error | any) {
      console.log(error)
    }
  }

  return (
    <div>
      <IconButton
        onClick={() => { setOpen(true) }}
        sx={{
          m: 0,
          p: 0.5,
          fontSize: 30
        }}
      >
        <DeleteIcon color='error'/>
      </IconButton>
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
        <DialogActions sx={{ padding: 3 }}>
          <LoadingButton
            color="error"
            onClick={handleDelete as React.MouseEventHandler<HTMLButtonElement>}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Aceptar
          </LoadingButton>
          <Button color="primary" variant="contained" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

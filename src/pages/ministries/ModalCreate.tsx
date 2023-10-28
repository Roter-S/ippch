import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import AddBoxIcon from '@mui/icons-material/AddBox'
import SaveIcon from '@mui/icons-material/Save'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Grid, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createDocument, updateDocument } from '../../utils/firestoreUtils'

const style = {
  position: 'absolute' as 'absolute',
  bgcolor: '#070E21',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4
}

interface ModalProps {
  returnResponse: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void
}

const MUIModal: React.FC<ModalProps> = ({ returnResponse }) => {
  const [openModal, setOpenModal] = React.useState(false)

  const MinistriesSchema = Yup.object().shape({
    name: Yup.string()
      .min(5, '¡Demasiado Corto!')
      .max(50, '¡Demasiado Largo!')
      .required('¡Requerido!'),
    description: Yup.string()
      .min(10, '¡Demasiado Corto!')
      .max(255, '¡Demasiado Largo!')
      .required('¡Requerido!')
  })

  const handleSubmit = async (values: any) => {
    try {
      const requestDoc = await createDocument('ministries', values)
      await updateDocument('ministries', requestDoc.id, { id: requestDoc.id })
      setOpenModal(false)
      returnResponse('Ministerio creado correctamente', 'success')
    } catch (error: Error | any) {
      setOpenModal(false)
      returnResponse(error.message, 'error')
    }
  }

  return (
    <>
      <Button variant="contained" color='primary' startIcon={<AddBoxIcon />} onClick={() => { setOpenModal(true) }}>Crear</Button>
      <Modal
        open={openModal}
        onClose={() => { setOpenModal(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear
          </Typography>
          <Formik
                initialValues={{
                  name: '',
                  description: ''
                }}
                validationSchema={MinistriesSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, isValid }) => (
                    <Form>
                        <Field
                            as={TextField}
                            name="name"
                            label="Nombre"
                            fullWidth
                            margin="normal"
                            error={Boolean(errors?.name)}
                            helperText={errors?.name}
                        />
                        <Field
                            as={TextField}
                            name="description"
                            label="Descripción"
                            fullWidth
                            margin="normal"
                            error={Boolean(errors?.description)}
                            helperText={errors?.description}
                        />
                        <Grid container justifyContent={'space-between'} marginTop={3}>
                            <Button
                                variant="outlined"
                                color='error'
                                onClick={() => { setOpenModal(false) }}
                            >
                                Cancelar
                            </Button>
                            <LoadingButton
                                variant="contained"
                                type="submit"
                                startIcon={<SaveIcon />}
                                disabled={!isValid}
                                loading={isSubmitting}
                                >
                                Guardar
                            </LoadingButton>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
      </Modal>
    </>
  )
}
export default MUIModal

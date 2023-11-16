import { Typography, TextField, Divider, Alert } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Grid from '@mui/material/Grid'
import FirebaseFileUploader from '../../components/common/inputs/FirebaseFileUploader'
import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createDocument, createOrUpdateDocument, getCollection, uploadFileString } from '../../utils/firestoreUtils'
import MainCard from '../../components/common/cards/MainCard'
import { type Setting } from '../../types/Types'
import { useAlert } from '../../context/AlertContext'

export const Settings = () => {
  const showAlert = useAlert()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleImagesUploaded = (imageUrls: string[]) => {
    setUploadedImages(imageUrls)
  }

  const handleFormSubmit = async (
    values: { uploadedImages: any, name: string },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const url = await uploadFileString(values.uploadedImages[0], 'settings/logo.png')
      const setting: Setting[] = await getCollection('settings') as Setting[]
      if (Array.isArray(setting) && setting.length === 0) {
        const data = {
          logo: url,
          name: values.name
        }
        await createDocument('settings', data)
        console.log('Se creo el documento')
      } else {
        await createOrUpdateDocument('settings', setting[0].id, {
          logo: url,
          name: values.name
        })
      }
      resetForm()
      window.location.reload()
    } catch (error: Error | any) {
      showAlert(error.message, 'error')
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  const validationSchema = Yup.object().shape({
    uploadedImages: Yup.array().min(1, 'Sube al menos una imagen'),
    name: Yup.string().required('El nombre es requerido')
  })

  return (
    <MainCard>
      <Typography variant="h4">
        Configuración
      </Typography>
      <Divider />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid
          marginTop={2}
          sx={{
            border: 'none',
            '@media (max-width: 600px)': {
              width: 'calc(100vw - 150px)'
            }
          }}
          item
        >
          <Typography variant="h6" marginBottom={3}>
            Logo
          </Typography>
          <Formik
            initialValues={{
              uploadedImages,
              name: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ isSubmitting, setFieldValue, errors }) => (
              <Form>
                <FirebaseFileUploader
                  acceptTypes="image/*"
                  multiple={false}
                  onImagesUploaded={(imageUrls) => {
                    handleImagesUploaded(imageUrls)
                    void setFieldValue('uploadedImages', imageUrls)
                  }}
                />

                {typeof errors.uploadedImages === 'string'
                  ? <Alert severity="error">{errors?.uploadedImages}</Alert>
                  : null}

                <Typography variant="h6" marginBottom={3}>
                  Titulo
                </Typography>
                <Field
                  label="Nombre de la aplicación"
                  type="text"
                  as={TextField}
                  variant="outlined"
                  name="name"
                  error={Boolean(errors?.name)}
                  helperText={errors?.name}
                />
                <LoadingButton
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Guardar
                </LoadingButton>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </MainCard>
  )
}

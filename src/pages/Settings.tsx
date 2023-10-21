import { Typography, TextField, Divider, Alert } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Grid from '@mui/material/Unstable_Grid2'
import FirebaseFileUploader from '../components/common/inputs/FirebaseFileUploader'
import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { createDocument, createOrUpdateDocument, listDocuments, uploadFile } from '../utils/firestoreUtils'
import MainCard from '../components/common/cards/MainCard'

const Settings = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleImagesUploaded = (imageUrls: string[]) => {
    setUploadedImages(imageUrls)
  }

  const handleFormSubmit = async (
    values: { uploadedImages: any, name: string },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const url = await uploadFile(values.uploadedImages[0], 'settings/logo.png')
      const setting = await listDocuments('settings')
      if (setting.length === 0) {
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
    } catch (error) {
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
          sx={{
            border: 'none',
            '@media (max-width: 600px)': {
              width: 'calc(100vw - 150px)'
            }
          }}
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

export default Settings

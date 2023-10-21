import { Typography, TextField, Divider } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Grid from '@mui/material/Unstable_Grid2'
import FirebaseFileUploader from '../components/common/inputs/FirebaseFileUploader'
import { useState } from 'react'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
import { uploadFile } from '../utils/firestoreUtils'
import MainCard from '../components/common/cards/MainCard'

const Settings = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleImagesUploaded = (imageUrls: string[]) => {
    setUploadedImages(imageUrls)
  }

  const handleFormSubmit = async (
    values: { uploadedImages: any },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await uploadFile(values.uploadedImages[0], 'settings/logo.png')
      resetForm()
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  const validationSchema = Yup.object().shape({
    uploadedImages: Yup.array().min(1, 'Sube al menos una imagen')
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
              name: 'ValorInicial'
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

                <ErrorMessage
                  name="uploadedImages"
                  component="div"
                  className="error"
                />

                <Typography variant="h6" marginBottom={3}>
                  Titulo
                </Typography>
                <Field
                  label="Nombre App"
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

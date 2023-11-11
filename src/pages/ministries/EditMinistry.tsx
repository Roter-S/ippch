import { Box, Grid, TextField, Typography } from '@mui/material'
import MainCard from '../../components/common/cards/MainCard'
import { Field, Formik, Form } from 'formik'
import * as Yup from 'yup'
import Item from '../../components/common/grid/Item'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { useAlert } from '../../context/AlertContext'
import { updateDocument } from '../../utils/firestoreUtils'
import { type Ministries } from '../../types/Types'

export default function EditMinistry ({ ministry }: { ministry: Ministries }) {
  const showAlert = useAlert()
  const MinistrySchema = Yup.object().shape({
    name: Yup.string()
      .min(5, '¡Muy corto!')
      .max(30, 'Demasiado largo')
      .required('Es obligatorio'),
    description: Yup.string()
      .min(10, '¡Muy corto!')
      .max(250, 'Demasiado largo')
      .required('Es obligatorio')
  })

  const handleSubmitMinistry = async (value: any) => {
    try {
      await updateDocument('ministries', ministry.id, value)
      showAlert('Se ha guardado correctamente', 'success')
    } catch (error: Error | any) {
      showAlert(error.message, 'error')
    }
  }
  return (
    <Grid container justifyContent="center">
        <Grid item xs={12} sm={12} md={10} lg={5}>
            <MainCard>
                <Typography variant="h5" component="h2" gutterBottom>
                    Editar Ministerio
                </Typography>
                <Box sx={{ flexGrow: 1, marginTop: 6 }}>
                    <Formik
                    initialValues={{
                      name: ministry.name,
                      description: ministry.description
                    }}
                    validationSchema={MinistrySchema}
                    onSubmit={handleSubmitMinistry}
                    >
                    {({ isSubmitting, errors, isValid }) => (
                        <Form>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12}>
                            <Item>
                                <Field
                                as={TextField}
                                label="Nombre del Ministerio"
                                fullWidth
                                type="text"
                                name="name"
                                variant="outlined"
                                error={Boolean(errors?.name)}
                                helperText={errors?.name}
                                />
                            </Item>
                            <Item>
                                <Field
                                as={TextField}
                                label="Descripción del Ministerio"
                                fullWidth
                                multiline
                                rows={4}
                                type="text"
                                name="description"
                                variant="outlined"
                                error={Boolean(errors?.description)}
                                helperText={errors?.description}
                                />
                            </Item>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                            <LoadingButton
                                variant="contained"
                                type="submit"
                                color='secondary'
                                startIcon={<SaveIcon />}
                                disabled={!isValid}
                                loading={isSubmitting}
                            >
                                Guardar
                            </LoadingButton>
                            </Grid>
                        </Grid>
                        </Form>
                    )}
                    </Formik>
                </Box>
            </MainCard>
        </Grid>
    </Grid>
  )
}

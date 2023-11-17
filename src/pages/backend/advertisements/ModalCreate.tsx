import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import AddBoxIcon from '@mui/icons-material/AddBox'
import SaveIcon from '@mui/icons-material/Save'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { v4 as uuidv4 } from 'uuid'
import { createDocument, getRef, updateDocument, uploadFile } from '../../../utils/firestoreUtils'
import { type Groups, type Ministries, type User } from '../../../types/Types'
import Item from '../../../components/common/grid/Item'
import { formatDateTimeFormik } from '../../../utils/formattingUtils'

const style = {
  position: 'absolute' as 'absolute',
  bgcolor: '#070E21',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  boxShadow: 24,
  p: 4
}

interface ModalProps {
  returnResponse: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void
  user: User | undefined
  ministries: Ministries[] | undefined
  groups: Groups[] | undefined
}

interface ListSelect {
  ministry: Ministries | undefined
  groups: Groups[] | undefined
}

const ModalCreate: React.FC<ModalProps> = ({ returnResponse, user, ministries, groups }) => {
  const [openModal, setOpenModal] = React.useState(false)
  const [listSelects, setListSelects] = React.useState<ListSelect[]>([])

  React.useEffect(() => {
    if (ministries === undefined || groups === undefined) {
      return
    }
    const listSelects = ministries.map((ministry) => {
      const groupsFilter = groups.filter((group) => group.ministry.id === ministry.id)
      return {
        ministry,
        groups: groupsFilter
      }
    })
    setListSelects(listSelects)
  }, [ministries, groups])

  const AdSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, '¡Demasiado Corto!')
      .max(50, '¡Demasiado Largo!')
      .required('¡Requerido!'),
    description: Yup.string()
      .min(5, '¡Demasiado Corto!')
      .max(50, '¡Demasiado Largo!')
      .required('¡Requerido!'),
    content: Yup.string()
      .min(10, '¡Demasiado Corto!')
      .max(355, '¡Demasiado Largo!')
      .required('¡Requerido!'),
    image: Yup.mixed()
      .test('fileFormat', 'Formato de imagen no válido', (value) => {
        if (value instanceof File) {
          return ['image/png', 'image/jpg', 'image/jpeg'].includes(value.type)
        }
      })
      .test('fileSize', 'Tamaño de imagen demasiado grande', (value) => {
        if (value instanceof File) {
          return value.size <= 5000000
        }
      }),
    startDate: Yup.date().required('¡Requerido!'),
    endDate: Yup.date().required('¡Requerido!'),
    ministries: Yup.array(),
    groups: Yup.array()
  })

  const handleSubmit = async (values: any) => {
    try {
      if (user != null) {
        const image = await uploadFile(values.image, `advertisements/${uuidv4()}`)
        const userRef = await getRef('users', user.id)
        const ministriesRef = await Promise.all(
          values.ministries.map(async (ministryId: string) => {
            return ministryId != null ? await getRef('ministries', ministryId) : null
          })
        )

        const groupsRef = await Promise.all(
          values.groups.map(async (groupId: string) => {
            return groupId != null ? await getRef('groups', groupId) : null
          })
        )

        const filteredMinistriesRef = ministriesRef.filter(ref => ref !== null)
        const filteredGroupsRef = groupsRef.filter(ref => ref !== null)

        const data = {
          title: values.title,
          description: values.description,
          content: values.content,
          image: image.url,
          imagePath: image.path,
          createdBy: userRef,
          seen: false,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          ministries: filteredMinistriesRef,
          groups: filteredGroupsRef,
          type: groupsRef.length > 0 ? 'group' : ministriesRef.length > 0 ? 'ministry' : 'general'
        }

        const ad = await createDocument('advertisements', data)
        await updateDocument('advertisements', ad.id, { id: ad.id })
        // setOpenModal(false)
        // returnResponse('Anuncio creado correctamente', 'success')
      } else {
        setOpenModal(false)
        returnResponse('No se encontro una sesión activa', 'error')
      }
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
                title: '',
                description: '',
                content: '',
                startDate: formatDateTimeFormik(new Date()),
                endDate: formatDateTimeFormik(new Date()),
                image: null,
                ministries: [],
                groups: []
              }}
              validationSchema={AdSchema}
              onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, isValid, setFieldValue }) => (
                    <Form>
                      <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                          <Item>
                            <Field
                                as={TextField}
                                name="title"
                                label="Título"
                                fullWidth
                                margin="normal"
                                error={Boolean(errors?.title)}
                                helperText={errors?.title}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={6}>
                          <Item>
                            <Field
                                as={TextField}
                                name="description"
                                label="Descripción"
                                fullWidth
                                margin="normal"
                                error={Boolean(errors?.description)}
                                helperText={errors?.description}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12}>
                          <Item>
                            <Field
                                as={TextField}
                                name="content"
                                label="Contenido"
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                                error={Boolean(errors?.content)}
                                helperText={errors?.content}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12}>
                          <Item>
                            <Field
                              as={TextField}
                              type="file"
                              name="image"
                              fullWidth
                              margin="normal"
                              error={Boolean(errors?.image)}
                              helperText={errors?.image}
                              value={undefined}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files != null && e.target.files.length > 0) {
                                  void setFieldValue('image', e.target.files[0])
                                }
                              }}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={6}>
                          <Item>
                            <Field
                                as={TextField}
                                type="datetime-local"
                                name="startDate"
                                label="Fecha de inicio"
                                fullWidth
                                margin="normal"
                                error={Boolean(errors?.startDate)}
                                helperText={errors?.startDate}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={6}>
                          <Item>
                            <Field
                                as={TextField}
                                type="datetime-local"
                                name="endDate"
                                label="Fecha de finalización"
                                fullWidth
                                margin="normal"
                                error={Boolean(errors?.endDate)}
                                helperText={errors?.endDate}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12}>
                          <Item sx={{ overflow: 'scroll', height: '250px' }}>
                            {listSelects?.map((listSelect, index) => (
                              <FormGroup key={index}>
                                <FormControlLabel
                                  key={listSelect.ministry?.id}
                                  control={
                                    <Checkbox
                                      name={`ministries[${index}]`}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.checked) {
                                          void setFieldValue(`ministries[${index}]`, listSelect.ministry?.id)
                                        } else {
                                          void setFieldValue(`ministries[${index}]`, null)
                                        }
                                      }}
                                    />
                                  }
                                  label={listSelect.ministry?.name}
                                />
                                {listSelect.groups?.map((group, index) => (
                                  <FormControlLabel
                                    key={group.id}
                                    sx={{ marginLeft: 2 }}
                                    control={
                                      <Checkbox
                                        name={`groups[${group.id}]`}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                          if (e.target.checked) {
                                            void setFieldValue(`groups[${index}]`, group.id)
                                          } else {
                                            void setFieldValue(`groups[${index}]`, null)
                                          }
                                        }}
                                      />
                                    }
                                    label={group.name}
                                  />
                                ))}
                              </FormGroup>
                            ))}
                          </Item>
                        </Grid>
                      </Grid>
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
export default ModalCreate

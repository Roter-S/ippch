import { Button, Grid, Link, TextField } from '@mui/material'
import MainCard from '../../../components/common/cards/MainCard'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { formatDateTimeFormik } from '../../../utils/formattingUtils'
import { useLoaderData, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { auth } from '../../../services/firebase'
import { createDocument, getDocument, getRef, updateDocument } from '../../../utils/firestoreUtils'
import { useAlert } from '../../../context/AlertContext'
import { type Assists } from '../../../types/Types'
import { useState } from 'react'

export async function loader ({ params }: { params: { attendanceId: string } }) {
  const attendance = await getDocument('assists', params.attendanceId)
  if (attendance === null) {
    return undefined
  }
  return attendance
}

const Attendance = () => {
  const attendanceLoad = useLoaderData() as Assists | undefined
  const [attendance, setAttendance] = useState<Assists | undefined>()
  const showAlert = useAlert()
  const navigate = useNavigate()
  const user = auth.currentUser
  const AttendanceSchema = Yup.object({
    createdAt: Yup.date().required('Campo requerido'),
    assistCount: Yup.number().min(1, 'Contador asistencia debe ser mayor o igual a 1.').required('Campo requerido')
  })

  const handleSubmitAttendance = async (value: any, formik: any) => {
    const { createdAt, assistCount } = value
    if (user !== null) {
      const data = {
        createdAt: new Date(createdAt),
        assistCount: parseInt(assistCount),
        attendanceTaker: await getRef('users', user.uid)
      }

      if (attendanceLoad !== undefined) {
        await updateDocument('assists', attendanceLoad.id, data)
        showAlert('Asistencia actualizada correctamente.', 'success')
        const setAttendanceDoc = await getDocument('assists', attendanceLoad.id) as Assists
        if (setAttendanceDoc !== null) {
          setAttendance(setAttendanceDoc)
        }
      } else {
        const attendanceRef = await createDocument('assists', data)
        await updateDocument('assists', attendanceRef.id, { id: attendanceRef.id })
        showAlert('Asistencia creada correctamente.', 'success')
      }
      formik.resetForm({
        createdAt: (attendance !== undefined) ? formatDateTimeFormik(attendance.createdAt.toDate()) : formatDateTimeFormik(new Date()),
        assistCount: (attendance !== undefined) ? attendance.assistCount : 0
      })
    } else {
      showAlert('Debes iniciar sesión para crear una asistencia.', 'error')
    }
  }

  return (
    <MainCard>
        <Link onClick={() => { navigate('/admin/assists') }} variant="h5" underline="none">
          <ArrowBackIcon /> { attendanceLoad !== undefined ? 'Editar Asistencia' : 'Crear Asistencia'}
        </Link>
        <Formik
           initialValues={{
             createdAt: (attendanceLoad !== undefined) ? formatDateTimeFormik(attendanceLoad.createdAt.toDate()) : formatDateTimeFormik(new Date()),
             assistCount: (attendanceLoad !== undefined) ? attendanceLoad.assistCount : 0
           }}
          validationSchema={AttendanceSchema}
          onSubmit={handleSubmitAttendance}
          >
          {({ isSubmitting, errors, isValid, values, setFieldValue }) => (
            <Form>
                  <Field
                    as={TextField}
                    type="datetime-local"
                    name="createdAt"
                    label="Fecha de Creación"
                    fullWidth
                    margin="normal"
                    error={Boolean(errors?.createdAt)}
                    helperText={errors?.createdAt}
                  />

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} sm={4}>
                      <Button
                        variant="contained"
                        onClick={async () => await setFieldValue('assistCount', Math.max(0, values.assistCount - 1))}
                      >
                        <PersonRemoveIcon />
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Field
                        as={TextField}
                        type="number"
                        name="assistCount"
                        label="Contador de Asistencias"
                        margin="normal"
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                        error={Boolean(errors?.assistCount)}
                        helperText={errors?.assistCount}
                      />
                    </Grid>
                    <Grid item xs={3} sm={4}>
                      <Button
                        variant="contained"
                        onClick={async () => await setFieldValue('assistCount', values.assistCount + 1)}
                      >
                        <GroupAddIcon />
                      </Button>
                    </Grid>
                  </Grid>

                  <LoadingButton
                    variant="contained"
                    type="submit"
                    color={attendanceLoad !== undefined ? 'secondary' : 'primary'}
                    startIcon={<SaveIcon />}
                    disabled={!isValid}
                    loading={isSubmitting}
                  >
                    {attendanceLoad !== undefined ? 'Actualizar' : 'Crear'}
                </LoadingButton>
            </Form>
          )}
          </Formik>
    </MainCard>
  )
}

export default Attendance

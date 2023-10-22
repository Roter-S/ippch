import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { register } from '../../services/firebase'
import { useUserContext } from '../../context/UserContext'
import { useRedirectActiveUser } from '../../hooks/useRedirectActiveUser'
import { Link } from 'react-router-dom'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { LoadingButton } from '@mui/lab'
import SignInWithGoogle from '../../components/common/buttons/SignInWithGoogle'

const Register = () => {
  const { user } = useUserContext()

  useRedirectActiveUser(user, '/admin')

  const onSubmit = async (
    { email, password }: { email: string, password: string },
    { setSubmitting, setErrors, resetForm }: any
  ) => {
    try {
      await register({ email, password })
      resetForm()
    } catch (error: any) {
      const authError = error as { code: string }
      if (authError.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Correo electrónico ya en uso' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email no válido').required('Email obligatorio'),
    password: Yup.string()
      .trim()
      .min(6, 'Mínimo 6 carácteres')
      .required('Password obligatorio')
  })

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex'
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          textAlign: 'center',
          my: 'auto',
          mx: 'auto'
        }}
      >
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ mx: 'auto', bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
            }
            title="Registrarse"
          />
          <CardContent>
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ isSubmitting, errors }) => (
                <Form>
                  <Field
                    as={TextField}
                    sx={{ mb: 3 }}
                    fullWidth
                    label="Correo Electrónico"
                    id="email"
                    type="text"
                    placeholder="Ingrese correo electrónico"
                    name="email"
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    label="Contraseña"
                    id="password"
                    type="password"
                    placeholder="Ingrese contraseña"
                    name="password"
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                  />

                  <LoadingButton
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Register
                  </LoadingButton>
                  <Grid container>
                    <Grid xs={12}>
                      <Button component={Link} to="/admin" color="primary">
                        ¿Ya tienes cuenta? Accede aquí
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
        <SignInWithGoogle />
      </Box>
    </Box>
  )
}

export default Register

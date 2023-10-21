import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import { login } from '../../services/firebase'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../../context/UserContext'

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

const Login = () => {
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (user !== false) {
      navigate('/admin/dashboard')
    }
  }, [user])

  const onSubmit = async (
    { email, password }: { email: string, password: string },
    { setSubmitting, setErrors, resetForm }: any
  ) => {
    try {
      await login({ email, password })
      resetForm()
    } catch (error: any) {
      if (typeof error.code === 'string') {
        const authErrorCode = error.code
        if (authErrorCode === 'auth/user-not-found') {
          setErrors({ email: 'Email no registrado' })
        } else if (authErrorCode === 'auth/wrong-password') {
          setErrors({ password: 'Contraseña incorrecta' })
        } else if (authErrorCode === 'auth/invalid-login-credentials') {
          setErrors({ email: 'Credenciales Invalidas' })
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email no válido').required('Email requerido'),
    password: Yup.string()
      .trim()
      .min(6, 'Mínimo 6 caracteres')
      .required('Contraseña requerida')
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
              <Avatar sx={{ mx: 'auto', bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
            }
            title="Inicio de Sesión"
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
                    fullWidth
                    sx={{ mb: 3 }}
                    label="Correo Electrónico"
                    id="email"
                    type="text"
                    placeholder="Ingrese correo electrónico"
                    name="email"
                    error={Boolean(errors?.email)}
                    helperText={errors?.email}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    label="Contraseña"
                    id="password"
                    type="password"
                    placeholder="Ingrese contraseña"
                    name="password"
                    error={Boolean(errors?.password)}
                    helperText={errors?.password}
                  />
                  <LoadingButton
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Iniciar Sesión
                  </LoadingButton>
                  <Grid container>
                    <Grid xs={12}>
                      <Button
                        color="primary"
                        component={Link}
                        to="/admin/register"
                      >
                        ¿No tienes cuenta? Registrate
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

export default Login

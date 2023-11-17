import { useUserContext } from '../../../context/UserContext'

import {
  Avatar,
  Box, Card, CardContent, CardHeader
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SignInWithGoogle from '../../../components/common/buttons/SignInWithGoogle'
import { useRedirectActiveUser } from '../../../hooks/useRedirectActiveUser'

const Login = () => {
  const { user } = useUserContext()
  useRedirectActiveUser(user)

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
            <SignInWithGoogle />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Login

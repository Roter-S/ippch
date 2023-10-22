import GoogleIcon from '@mui/icons-material/Google'
import { Button } from '@mui/material'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { createOrUpdateDocument, getDocument } from '../../../utils/firestoreUtils'

const SignInWithGoogle = () => {
  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const userFirestore = await getDocument('users', user.uid)
      await createOrUpdateDocument('users', user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: (userFirestore?.uid != null) ? userFirestore.data.role : 'user'
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      sx={{
        mt: 3,
        mb: 2,
        bgcolor: 'secondary.main',
        ':hover': { bgcolor: 'secondary.dark' }
      }}
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={handleSignInWithGoogle as React.MouseEventHandler<HTMLButtonElement>}
    >
      Continuar con Google
    </Button>
  )
}

export default SignInWithGoogle

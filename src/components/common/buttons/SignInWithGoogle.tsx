import GoogleIcon from '@mui/icons-material/Google'
import { Button } from '@mui/material'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { createDocumentWithID, getDocument, updateDocument } from '../../../utils/firestoreUtils'

const SignInWithGoogle = () => {
  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const userFirestore = await getDocument('users', user.id)
      if (userFirestore == null) {
        await createDocumentWithID('users', user.id, {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          groups: [],
          ministries: [],
          roles: []
        })
      } else {
        await updateDocument('users', user.id, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          groups: userFirestore.groups ?? [],
          ministries: userFirestore.ministries ?? [],
          roles: userFirestore.roles ?? []
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Button
      sx={{
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

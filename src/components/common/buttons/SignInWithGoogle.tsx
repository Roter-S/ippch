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
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        leader: (userFirestore?.uid != null) ? userFirestore.leader : [],
        assistant: (userFirestore?.uid != null) ? userFirestore.assistant : [],
        member: (userFirestore?.uid != null) ? userFirestore.member : []
      })
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

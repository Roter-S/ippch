import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { createUserInFirestore } from "../../utils/firestoreUtils";

const SignInWithGoogle = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserInFirestore(user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      sx={{
        mt: 3,
        mb: 2,
        bgcolor: "secondary.main",
        ":hover": { bgcolor: "secondary.dark" },
      }}
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={signInWithGoogle}
    >
      Continuar con Google
    </Button>
  );
};

export default SignInWithGoogle;

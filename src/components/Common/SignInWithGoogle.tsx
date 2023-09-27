import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SignInWithGoogle = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    const auth = getAuth();
    signInWithPopup(auth, provider).catch((error) => {
      console.log(error);
    });
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

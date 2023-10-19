import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import FirebaseFileUploader from "../components/common/inputs/FirebaseFileUploader";

const Settings = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#101935",
        boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.4)",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <Typography variant="h4" marginBottom={3}>
        Configuración
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid
          sx={{
            border: "none",
            "@media (max-width: 600px)": {
              width: "calc(100vw - 150px)",
            },
          }}
        >
          <FirebaseFileUploader acceptTypes="image/*" multiple={false} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;

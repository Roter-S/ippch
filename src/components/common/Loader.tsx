import { Box } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        background: "030D22",
      }}
    >
      <Box
        sx={{
          mx: "auto",
          my: "auto",
        }}
      >
        <span className="loader"></span>
      </Box>
    </Box>
  );
};

export default Loader;

import Grid from "@mui/material/Unstable_Grid2";
import ChartArea from "./ChartArea";
import ChartPie from "./ChartPie";
import ChartBar from "./ChartBar";

const Dashboard = () => {
  return (
    <Grid container spacing={2}>
      <ChartArea />
      <ChartPie />
      <ChartBar />
    </Grid>
  );
};

export default Dashboard;

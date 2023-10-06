import Grid from "@mui/material/Unstable_Grid2";
import ChartArea from "./ChartArea";
import ChartPie from "./ChartPie";
import ChartBar from "./ChartBar";

const Dashboard = () => {
  const sizeHeight = 600;
  return (
    <Grid container spacing={2}>
      <ChartArea sizeHeight={sizeHeight} />
      <ChartPie sizeHeight={sizeHeight} />
      <ChartBar sizeHeight={sizeHeight} />
    </Grid>
  );
};

export default Dashboard;

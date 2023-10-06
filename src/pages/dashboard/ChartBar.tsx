import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { BarChart } from "@mui/x-charts/BarChart";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

export default function ChartBar({ sizeHeight }: { sizeHeight: number }) {
  return (
    <Grid xs={12} sm={9}>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          backgroundColor: "#101935",
          boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.4)",
          borderRadius: "10px",
        }}
      >
        <BarChart
          height={sizeHeight}
          series={[
            { data: pData, label: "pv", id: "pvId" },
            { data: uData, label: "uv", id: "uvId" },
          ]}
          xAxis={[{ data: xLabels, scaleType: "band" }]}
        />
      </Box>
    </Grid>
  );
}

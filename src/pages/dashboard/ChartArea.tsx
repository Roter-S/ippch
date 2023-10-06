import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { LineChart } from "@mui/x-charts/LineChart";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

export default function ChartArea({ sizeHeight }: { sizeHeight: number }) {
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
        <LineChart
          height={sizeHeight}
          series={[
            {
              data: uData,
              label: "uv",
              area: true,
              stack: "total",
              showMark: false,
              color: "#8884d8",
            },
            {
              data: uData,
              label: "pv",
              area: true,
              stack: "total",
              showMark: false,
              color: "#82ca9d",
            },
          ]}
          xAxis={[{ scaleType: "point", data: xLabels }]}
          sx={{
            ".MuiLineElement-root": {
              display: "none",
            },
          }}
        />
      </Box>
    </Grid>
  );
}

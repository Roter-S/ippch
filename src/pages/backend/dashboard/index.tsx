import Grid from '@mui/material/Grid'
import ChartPie from './ChartPie'
import ChartBar from './ChartBar'
import ChartArea from './ChartArea'
import UserCard from './UserCard'
import AttendanceCard from './AttendanceCard'
import FamilyCard from './FamilyCard'
import CellCard from './CellCard'

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <UserCard />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <AttendanceCard />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={1}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <FamilyCard />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <CellCard />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={6} xs={12}>
            <ChartBar />
          </Grid>
          <Grid item lg={3} xs={12}>
            <ChartPie />
          </Grid>
          <Grid item lg={3} xs={12}>
            <ChartArea />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Dashboard

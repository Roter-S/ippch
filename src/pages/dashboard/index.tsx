import Grid from '@mui/material/Unstable_Grid2'
import ChartPie from './ChartPie'
import ChartBar from './ChartBar'
import ChartArea from './ChartArea'
import Item from '../../components/common/Grid/Item'
import UserCard from './UserCard'
import AttendanceCard from './AttendanceCard'
import FamilyCard from './FamilyCard'
import CellCard from './CellCard'

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Item>
          <Grid container spacing={3}>
            <Grid lg={4} md={6} sm={6} xs={12}>
              <Item>
                <UserCard />
              </Item>
            </Grid>
            <Grid lg={4} md={6} sm={6} xs={12}>
              <Item>
                <AttendanceCard />
              </Item>
            </Grid>
            <Grid lg={4} md={12} sm={12} xs={12}>
              <Item>
                <Grid container spacing={1}>
                  <Grid sm={6} xs={12} md={6} lg={12}>
                    <Item>
                      <FamilyCard />
                    </Item>
                  </Grid>
                  <Grid sm={6} xs={12} md={6} lg={12}>
                    <Item>
                      <CellCard />
                    </Item>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
            <Grid lg={6} xs={12}>
              <ChartBar />
            </Grid>
            <Grid lg={3} xs={12}>
              <ChartPie />
            </Grid>
            <Grid lg={3} xs={12}>
              <ChartArea />
            </Grid>
          </Grid>
        </Item>
      </Grid>
    </Grid>
  )
}

export default Dashboard

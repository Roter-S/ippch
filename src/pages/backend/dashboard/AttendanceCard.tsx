import DashboardOne from '../../../components/common/cards/DashboardOne'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import { useTheme } from '@mui/material/styles'

const AttendanceCard = () => {
  const theme = useTheme()

  return <DashboardOne
            isLoading={false}
            icon={<FactCheckIcon sx={{ fontSize: 50 }}/>}
            value={250}
            title='Asistencia'
            backgroundColor={theme.palette.secondary.main}
            background={theme.palette.secondary.dark}
            />
}

export default AttendanceCard

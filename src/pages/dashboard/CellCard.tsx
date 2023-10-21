import DashboardTwo from '../../components/common/cards/DashboardTwo'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import { useTheme } from '@mui/material/styles'

const CellCard = () => {
  const theme = useTheme()

  return <DashboardTwo
            isLoading={false}
            icon={<FactCheckIcon sx={{ fontSize: 40 }}/>}
            value={250}
            title='Asistencia'
            backgroundColor={theme.palette.success.main}
            background={theme.palette.success.dark}
            />
}

export default CellCard

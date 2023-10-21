import DashboardTwo from '../../components/common/cards/DashboardTwo'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import { useTheme } from '@mui/material/styles'

const FamilyCard = () => {
  const theme = useTheme()

  return <DashboardTwo
            isLoading={false}
            icon={<FactCheckIcon sx={{ fontSize: 40 }}/>}
            value={250}
            title='Asistencia'
            backgroundColor={theme.palette.violet.main}
            background={theme.palette.violet.dark}
            />
}

export default FamilyCard

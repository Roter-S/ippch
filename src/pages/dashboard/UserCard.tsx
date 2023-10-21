import DashboardOne from '../../components/common/cards/DashboardOne'
import GroupIcon from '@mui/icons-material/Group'
import { useTheme } from '@mui/material/styles'

const UserCard = () => {
  const theme = useTheme()

  return <DashboardOne
            isLoading={false}
            icon={<GroupIcon sx={{ fontSize: 50 }}/>}
            value={500}
            title='Total Usuarios'
            backgroundColor={theme.palette.primary.main}
            background={theme.palette.primary.dark}
            />
}

export default UserCard

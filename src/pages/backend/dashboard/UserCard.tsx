import DashboardOne from '../../../components/common/cards/DashboardOne'
import GroupIcon from '@mui/icons-material/Group'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { getDocumentCount } from '../../../utils/firestoreUtils'
import { useAlert } from '../../../context/AlertContext'

const UserCard = () => {
  const showAlert = useAlert()
  const theme = useTheme()
  const [loading, setLoading] = useState<boolean>(true)
  const [countUsers, setCountUsers] = useState<number>(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getDocumentCount('users')
        setCountUsers(users)
        setLoading(false)
      } catch (error: Error | any) {
        showAlert(error.message, 'error')
      }
    }
    void fetchUsers()
  }
  , [])

  return <DashboardOne
            isLoading={loading}
            icon={<GroupIcon sx={{ fontSize: 50 }}/>}
            value={countUsers}
            title='Total de Usuarios'
            backgroundColor={theme.palette.primary.main}
            background={theme.palette.primary.dark}
            />
}

export default UserCard

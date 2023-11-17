import DashboardTwo from '../../../components/common/cards/DashboardTwo'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { getDocumentCount } from '../../../utils/firestoreUtils'
import { useAlert } from '../../../context/AlertContext'

const FamilyCard = () => {
  const theme = useTheme()
  const showAlert = useAlert()
  const [loading, setLoading] = useState<boolean>(true)
  const [GroupCount, setGroupCount] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getDocumentCount('groups')
        setGroupCount(users)
        setLoading(false)
      } catch (error: Error | any) {
        showAlert(error.message, 'error')
      }
    }
    void fetchUsers()
  }
  , [])

  return <DashboardTwo
            isLoading={loading}
            icon={<FactCheckIcon sx={{ fontSize: 40 }}/>}
            value={GroupCount}
            title='Total de grupos'
            backgroundColor={theme.palette.violet.main}
            background={theme.palette.violet.dark}
            />
}

export default FamilyCard

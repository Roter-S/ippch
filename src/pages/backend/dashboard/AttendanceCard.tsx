import DashboardOne from '../../../components/common/cards/DashboardOne'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import { useTheme } from '@mui/material/styles'
import { useAlert } from '../../../context/AlertContext'
import { useEffect, useState } from 'react'
import { getCollection } from '../../../utils/firestoreUtils'
import { type MemberAttendance } from '../../../types/Types'

const AttendanceCard = () => {
  const showAlert = useAlert()
  const theme = useTheme()
  const [loading, setLoading] = useState<boolean>(true)
  const [memberAttendanceCount, setAssistCount] = useState(0)

  useEffect(() => {
    const getAssistCount = async () => {
      try {
        const fechaActual = new Date()
        const mesActual = fechaActual.getMonth() + 1
        let totalAssistCount = 0

        const assists: MemberAttendance[] = await getCollection('memberAttendance', {
          filters: [
            ['createdAt', '>=', new Date(fechaActual.getFullYear(), mesActual - 1, 1)],
            ['createdAt', '<', new Date(fechaActual.getFullYear(), mesActual, 0)]
          ]
        }) as MemberAttendance[]
        if (assists.length > 0) {
          assists.forEach((attendance) => {
            if (attendance !== undefined) {
              totalAssistCount += attendance.memberAttendanceCount
            }
          })
        }

        setAssistCount(totalAssistCount)
        setLoading(false)
      } catch (error: Error | any) {
        showAlert(error.message, 'error')
      }
    }
    void getAssistCount()
  }, [])
  return <DashboardOne
            isLoading={loading}
            icon={<FactCheckIcon sx={{ fontSize: 50 }}/>}
            value={memberAttendanceCount}
            title='Asistencias del Mes'
            backgroundColor={theme.palette.secondary.main}
            background={theme.palette.secondary.dark}
            />
}

export default AttendanceCard

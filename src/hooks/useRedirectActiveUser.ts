import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { UserRole } from '../enums/UserRole'

export const useRedirectActiveUser = (user: any): void => {
  const navigate = useNavigate()

  useEffect(() => {
    if (user !== false) {
      const isAdmin: boolean = user.roles.some((role: string) => UserRole.Admin === role)
      if (isAdmin) {
        navigate('/admin/dashboard')
      } else {
        navigate('/admin/home')
      }
    }
  }, [user, navigate])
}

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'

interface RoleRouteProps {
  allowedRoles: string[]
  element: React.ReactNode
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, element }) => {
  const { user } = useUserContext()

  const isAuthorized = user !== false && allowedRoles.some(role => user.roles.includes(role))
  const emptyRoles = user !== false && user.roles.length === 0
  if (emptyRoles) {
    return <Navigate to="/admin/home" />
  }
  return isAuthorized ? element : <Navigate to="/404" />
}

export default RoleRoute

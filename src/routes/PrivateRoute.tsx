import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'

interface PrivateRouteProps {
  Component: React.ComponentType<any>
  roles?: string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ Component, roles, ...rest }) => {
  const { user } = useUserContext()

  if (!user) {
    return <Navigate to="/login" />
  }
  console.log(user.uid)

  return <Component {...rest} />
}

export default PrivateRoute

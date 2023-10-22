import { createBrowserRouter } from 'react-router-dom'

import RootLayout from '../components/layouts/RootLayout'
import PrivateLayout from '../components/layouts/PrivateLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard'
import User from '../pages/Users'
import Settings from '../pages/Settings'
import Ministries from '../pages/Ministries'
import Cells from '../pages/Cells'
import Roles from '../pages/Roles'

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        element: <PrivateLayout />,
        children: [
          {
            index: true,
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'users',
            element: <User />
          },
          {
            path: 'roles',
            element: <Roles />
          },
          {
            path: 'ministries',
            element: <Ministries />
          },
          {
            path: 'cells',
            element: <Cells />
          },
          {
            path: 'settings',
            element: <Settings />
          }
        ]
      }
    ]
  }
])

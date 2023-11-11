import { createBrowserRouter } from 'react-router-dom'

import RootLayout from '../components/layouts/RootLayout'
import PrivateLayout from '../components/layouts/PrivateLayout'
import Dashboard from '../pages/dashboard'
import Users, { loader as LoaderUsers } from '../pages/Users'
import IndexMinistries from '../pages/ministries/index'
import ListMinistries, { loader as LoaderListMinistries } from '../pages/ministries/ListMinistries'
import Ministry, { loader as LoaderMinistry } from '../pages/ministries/Ministry'
import Advertisements from '../pages/advertisements'

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <RootLayout />,
    children: [
      {
        index: true,
        async lazy () {
          const { Login } = await import('../pages/auth/Login')
          return { Component: Login }
        }
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
            element: <Users />,
            loader: LoaderUsers
          },
          {
            path: 'ministries',
            element: <IndexMinistries />,
            children: [
              {
                index: true,
                loader: LoaderListMinistries,
                element: <ListMinistries />
              },
              {
                path: ':ministryId',
                loader: async ({ params }: any) => await LoaderMinistry({ params }),
                element: <Ministry />
              }
            ]
          },
          {
            path: 'settings',
            async lazy () {
              const { Settings } = await import('../pages/Settings')
              return { Component: Settings }
            }
          },
          {
            path: 'advertisements',
            element: <Advertisements/>
          }
        ]
      }
    ]
  }
])

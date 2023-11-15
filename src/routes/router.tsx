import { createBrowserRouter } from 'react-router-dom'

import RootLayout from '../components/layouts/RootLayout'
import PrivateLayout from '../components/layouts/PrivateLayout'
import Dashboard from '../pages/backend/dashboard'
import Users, { loader as LoaderUsers } from '../pages/backend/Users'
import IndexMinistries from '../pages/backend/ministries/index'
import ListMinistries, { loader as LoaderListMinistries } from '../pages/backend/ministries/ListMinistries'
import Ministry from '../pages/backend/ministries/Ministry'
import Advertisements from '../pages/backend/advertisements'
import WebPageLayout from '../components/layouts/WebPageLayout'
import PageUnderConstruction from '../components/common/PageUnderConstruction'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WebPageLayout />,
    children: [
      {
        index: true,
        element: <PageUnderConstruction />
      }
    ]
  },
  {
    path: '/admin',
    element: <RootLayout />,
    children: [
      {
        index: true,
        async lazy () {
          const { Login } = await import('../pages/backend/auth/Login')
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
                async loader ({ params }: any) {
                  const { loader } = await import('../pages/backend/ministries/Ministry')
                  return await loader({ params })
                },
                element: <Ministry />
              }
            ]
          },
          {
            path: 'settings',
            async lazy () {
              const { Settings } = await import('../pages/backend/Settings')
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

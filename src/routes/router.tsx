import { createBrowserRouter } from 'react-router-dom'

import RootLayout from '../components/layouts/RootLayout'
import PrivateLayout from '../components/layouts/PrivateLayout'
import Login from '../pages/backend/auth/Login'
import Dashboard from '../pages/backend/dashboard'
import Users, { loader as LoaderUsers } from '../pages/backend/Users'
import IndexMinistries from '../pages/backend/ministries/index'
import ListMinistries, { loader as LoaderListMinistries } from '../pages/backend/ministries/ListMinistries'
import Ministry from '../pages/backend/ministries/Ministry'
import Advertisements from '../pages/backend/advertisements'
import WebPageLayout from '../components/layouts/WebPageLayout'
import PageUnderConstruction from '../components/common/PageUnderConstruction'
import MemberAttendance from '../pages/backend/member-attendance'
import ListAssists from '../pages/backend/member-attendance/ListMemberAttendance'
import Error404 from '../components/common/errors/Error404'
import Attendance from '../pages/backend/member-attendance/Attendance'
import RoleRoute from './RoleRoute'
import Settings from '../pages/backend/Settings'
import Welcome from '../pages/backend/Welcome'

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
        element: <Login />
      },
      {
        element: <PrivateLayout />,
        children: [
          {
            index: true,
            path: 'dashboard',
            element: (
              <RoleRoute
                allowedRoles={['admin']}
                element={<Dashboard />}
              />
            )
          },
          {
            path: 'users',
            element: (
              <RoleRoute
                allowedRoles={['admin']}
                element={<Users />}
              />
            ),
            loader: LoaderUsers
          },
          {
            path: 'ministries',
            element: (
              <RoleRoute
                allowedRoles={['leader', 'admin']}
                element={<IndexMinistries />}
              />
            ),
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
            element: (
              <RoleRoute
                allowedRoles={['admin']}
                element={<Settings />}
              />
            )
          },
          {
            path: 'advertisements',
            element: (
              <RoleRoute
                allowedRoles={['admin', 'leader', 'member']}
                element={<Advertisements />}
              />
            )
          },
          {
            path: 'member-attendance',
            element: (
              <RoleRoute
                allowedRoles={['admin', 'attendance']}
                element={<MemberAttendance />}
              />
            ),
            children: [
              {
                index: true,
                element: <ListAssists />
              },
              {
                path: 'create',
                element: <Attendance />
              },
              {
                path: ':attendanceId',
                async loader ({ params }: any) {
                  const { loader } = await import('../pages/backend/member-attendance/Attendance')
                  return await loader({ params })
                },
                element: <Attendance />
              }
            ]
          },
          {
            path: 'home',
            element: (
              <RoleRoute
                allowedRoles={['admin', 'leader', 'member']}
                element={<Welcome />}
              />
            )
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Error404 />
  }
])

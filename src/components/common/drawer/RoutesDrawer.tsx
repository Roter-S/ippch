import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import { Stack, Typography } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import { NavLink, useLocation } from 'react-router-dom'
import { getCollection } from '../../../utils/firestoreUtils'
import { useEffect, useState } from 'react'
import { type Setting } from '../../../types/Types'
import SkeletonNameApp from '../skeleton/SkeletonNameApp'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'

const RoutesDrawer = () => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [settings, setSettings] = useState<Setting[]>([])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingDocuments = await getCollection('settings')
        setSettings(settingDocuments as Setting[])
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    void fetchSettings()
  }, [])

  return (
    <>
    {isLoading
      ? (<SkeletonNameApp />)
      : (
          <Stack spacing={2} padding={2}>
            <List>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <Avatar
                  alt="log"
                  src={settings.length > 0 ? settings[0].image : ''}
                />
                <ListItemText sx={{ py: 0, mt: 0.45, mb: 0.45, ml: 1 }}
                          primary={
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                              {settings.length > 0 ? settings[0].name : ''}
                            </Typography>
                          }
                        />
                </ListItem>
            </List>
          </Stack>
        )}
      <List>
        {[
          {
            title: 'Dashboard',
            icon: <DashboardIcon />,
            to: '/admin/dashboard'
          },
          {
            title: 'Usuarios',
            icon: <GroupIcon />,
            to: '/admin/users'
          },
          {
            title: 'Ministerios',
            icon: <AccountTreeIcon />,
            to: '/admin/ministries'
          },
          {
            title: 'Noticicias',
            icon: <NewspaperIcon />,
            to: '/admin/advertisements'
          },
          {
            title: 'Asistencias',
            icon: <ChecklistRtlIcon />,
            to: '/admin/assists'
          },
          {
            title: 'Donaciones',
            icon: <VolunteerActivismIcon />,
            to: '/admin/donations'
          }
        ].map((text, index) => (
          <ListItem
            key={index}
            sx={{
              '& .MuiListItemButton-root, & .MuiListItemIcon-root, & .MuiListItemText-root':
                {
                  color: '#dfdfdf'
                },
              '& .isActive': {
                '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                  color: '#1e88e5'
                }
              },
              '&:hover .MuiListItemButton-root': {
                backgroundColor: '#0a3068'
              }
            }}
            disablePadding
          >
            <NavLink
              to={text.to}
              style={{
                textDecoration: 'none',
                width: '100%'
              }}
              className={location.pathname === text.to ? 'isActive' : ''}
            >
              <ListItemButton>
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.title} />
              </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  )
}

export default RoutesDrawer

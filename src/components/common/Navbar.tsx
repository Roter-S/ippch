import React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  MenuItem,
  Button,
  Divider
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { auth, logOut } from '../../services/firebase'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  drawerWidth: number
  handleDrawerToggle: () => void
}

interface User {
  displayName?: string | null
  photoURL?: string | null
}

const Navbar = ({ drawerWidth, handleDrawerToggle }: NavbarProps) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const navigate = useNavigate()

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const redirect = (path: string) => {
    navigate(path)
    handleCloseUserMenu()
  }

  const handleLogout = (): void => {
    logOut()
      .then(() => {
        navigate('/admin')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const user = auth.currentUser as User

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(98.1% - ${drawerWidth}px)` },
        mr: { sm: '18.5px' },
        mt: '10px'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}>
            <Typography variant="h6" noWrap component="div"></Typography>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Button onClick={handleOpenUserMenu}
            sx={{
              paddingX: 1,
              paddingY: 0.5,
              '&:hover': {
                borderRadius: '8px'
              },
              '&:active': {
                borderRadius: '8px'
              }
            }}>
              { (user.displayName != null) && (user.photoURL != null)
                ? (
                  <>
                    <Typography sx={{ marginRight: '4px' }}>{user.displayName}</Typography>
                    <Avatar alt="photoURL" src={user.photoURL} />
                  </>
                  )
                : (
                    <Typography sx={{ marginRight: '4px' }}>Usuario</Typography>
                  )
              }
            </Button>

            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              keepMounted
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                <AccountBoxIcon />
                <Typography textAlign="center">Perfil</Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => { redirect('/admin/settings') } }
              >
                <SettingsApplicationsIcon />
                <Typography textAlign="center">Configuración</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleLogout() }}>
                <ExitToAppIcon />
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar

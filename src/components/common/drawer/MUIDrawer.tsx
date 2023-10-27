import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import RoutesDrawer from './RoutesDrawer'

interface MuiDrawerProps {
  mobileOpen: boolean
  handleDrawerToggle: () => void
  drawerWidth?: number
  container?: () => HTMLElement
}

const MuiDrawer: React.FC<MuiDrawerProps> = ({
  mobileOpen,
  handleDrawerToggle,
  drawerWidth,
  container
}) => {
  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 }
      }}
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        <RoutesDrawer />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            border: 'none',
            backgroundColor: '#101935',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.4)'
          }
        }}
        open
      >
        <RoutesDrawer />
      </Drawer>
    </Box>
  )
}

export default MuiDrawer

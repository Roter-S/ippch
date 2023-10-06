import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import RoutesDrawer from "./RoutesDrawer";

interface MuiDrawerProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  drawerWidth?: number;
  container?: () => HTMLElement;
}

const MuiDrawer: React.FC<MuiDrawerProps> = ({
  mobileOpen,
  handleDrawerToggle,
  drawerWidth,
  container,
}) => {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <RoutesDrawer />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "transparent",
            borderRight: "1px solid #232E4F",
          },
        }}
        open
      >
        <RoutesDrawer />
      </Drawer>
    </Box>
  );
};

export default MuiDrawer;

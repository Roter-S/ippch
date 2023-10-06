import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Navbar from "../common/Navbar";
import MuiDrawer from "../common/drawer/MUIDrawer";

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

const Private: React.FC<Props> = (props) => {
  const { user } = useUserContext();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return user ? (
    <Box sx={{ display: "flex" }}>
      <Navbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="options folders"
      >
        <MuiDrawer
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth}
          container={container}
        />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 5,
          py: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  ) : (
    <Navigate to="/" />
  );
};

export default Private;

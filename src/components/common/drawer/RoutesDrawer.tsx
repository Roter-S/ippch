import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import { NavLink, useLocation } from "react-router-dom";

const RoutesDrawer = () => {
  const location = useLocation();
  return (
    <div>
      <Toolbar>Logo</Toolbar>
      <List>
        {[
          { title: "Dashboard", icon: <DashboardIcon />, to: "/admin" },
          { title: "Usuarios", icon: <GroupIcon />, to: "/admin/users" },
        ].map((text, index) => (
          <ListItem key={index} disablePadding>
            <NavLink
              to={text.to}
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
              className={
                location.pathname === text.to ? "isActive" : "isPending"
              }
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
    </div>
  );
};

export default RoutesDrawer;

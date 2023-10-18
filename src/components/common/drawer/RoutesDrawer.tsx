import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink, useLocation } from "react-router-dom";
import { listDocuments } from "../../../utils/firestoreUtils";
import { useEffect, useState } from "react";

interface Setting {
  image: string;
  name: string;
}
interface Settings {
  id: string;
  data: Setting;
}

const RoutesDrawer = () => {
  const location = useLocation();
  const [settings, setSettings] = useState<Settings[]>([]);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingDocuments = await listDocuments("settings");
        setSettings(settingDocuments as Settings[]);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Avatar
          alt="log"
          src={settings.length > 0 ? settings[0].data.image : ""}
        />
        <Toolbar>{settings.length > 0 ? settings[0].data.name : ""}</Toolbar>
      </Box>
      <List>
        {[
          {
            title: "Dashboard",
            icon: <DashboardIcon />,
            to: "/admin/dashboard",
          },
          {
            title: "Usuarios",
            icon: <GroupIcon />,
            to: "/admin/users",
          },
          {
            title: "Configuración",
            icon: <SettingsIcon />,
            to: "/admin/settings",
          },
        ].map((text, index) => (
          <ListItem
            key={index}
            sx={{
              "& .MuiListItemButton-root, & .MuiListItemIcon-root, & .MuiListItemText-root":
                {
                  color: "#dfdfdf",
                },
              "& .isActive": {
                "& .MuiListItemIcon-root, & .MuiListItemText-root": {
                  color: "#1e88e5",
                },
              },
              "&:hover .MuiListItemButton-root": {
                backgroundColor: "#0a3068",
              },
            }}
            disablePadding
          >
            <NavLink
              to={text.to}
              style={{
                textDecoration: "none",
                width: "100%",
              }}
              className={location.pathname === text.to ? "isActive" : ""}
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
  );
};

export default RoutesDrawer;

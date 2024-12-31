import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import { Link, useLocation } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import "./DashboardStyles.css";
import { Outlet, useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
const drawerWidth = 220;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const BolderTypography = styled(Typography)({
  fontWeight: "bold",
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "white",
  color: "#000000",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  height: "100px",
}));

export default function SuperAdminDashboard() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard/order":
        return "Order";
      case "/dashboard/orderhistory":
        return "Order History";
      case "/dashboard/menu":
        return "Menu";
      case "/dashboard/analytics":
        return "Analytics";
      case "/dashboard/settings":
        return "Settings";
      default:
        return "Hello, SuperAdmin";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("super_admin_token");
    window.location.href = "/";
  };

  const handleSetting = () => {
    navigate("settings");
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <CustomToolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <BolderTypography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {getTitle()}
          </BolderTypography>
          <div className="datime">
            <p className="insidedateime">
              {currentTime.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
              | {currentTime.toLocaleTimeString("en-US")}
            </p>
          </div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <AccountCircle style={{ fontSize: "30px" }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
            <MenuItem onClick={handleSetting}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
          </Menu>
        </CustomToolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            button
            component={Link}
            to="/dashboard/surveyor"
            selected={location.pathname === "/dashboard/surveyor"}
            sx={{
              backgroundColor:
                location.pathname === "/dashboard/surveyor"
                  ? "blue"
                  : "inherit",
            }}
          >
            <ListItemIcon>
              <AssignmentIndIcon />
            </ListItemIcon>
            <ListItemText primary="Surveyor" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dashboard/admin"
            selected={location.pathname === "/dashboard/admin"}
            sx={{
              backgroundColor:
                location.pathname === "/dashboard/admin" ? "blue" : "inherit",
            }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dashboard/fadadmin"
            selected={location.pathname === "/dashboard/fadadmin"}
            sx={{
              backgroundColor:
                location.pathname === "/dashboard/fadadmin"
                  ? "blue"
                  : "inherit",
            }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="ATE" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dashboard/vfa_admin"
            selected={location.pathname === "/dashboard/vfa_admin"}
            sx={{
              backgroundColor:
                location.pathname === "/dashboard/vfa_admin"
                  ? "blue"
                  : "inherit",
            }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="ATCR" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dashboard/addpropcsv"
            selected={location.pathname === "/dashboard/addpropcsv"}
            sx={{
              backgroundColor:
                location.pathname === "/dashboard/addpropcsv"
                  ? "blue"
                  : "inherit",
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText primary="AddPropCsv" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dashboard/adddronecsv"
            selected={location.pathname === "/dashboard/adddronecsv"}
            sx={{
              backgroundColor:
                location.pathname === "/dashboard/adddronecsv"
                  ? "blue"
                  : "inherit",
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText primary="AddDroneCsv" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/dashboard/addexistaxcsv"
            selected={location.pathname === "/dashboard/addexistaxcsv"}
            sx={{
              backgroundColor:
                location.pathname === "/dashboard/addexistaxcsv"
                  ? "blue"
                  : "inherit",
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText primary="AddExistingTaxcsv" />
          </ListItem>
          {/* Add more menu items with icons as needed */}
        </List>

        <div>
          <p className="contact">
            Reach us through
            <br />
            <div style={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon style={{ fontSize: "20px", marginRight: "5px" }} />
              <span>8056457791</span>
            </div>
          </p>
        </div>
      </Drawer>
      <Main
        style={{
          margin: "0",
          width: "100%",
          marginTop: "100px",
        }}
        open={open}
      >
        <Outlet />
      </Main>
    </Box>
  );
}
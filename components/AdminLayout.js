import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import PersonIcon from "@mui/icons-material/Person";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import useUser from "@/hooks/useUser";
import Link from "./Link";
import BackgroundLetterAvatars from "./BackgroundLetterAvatars";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    backgroundColor: "whitesmoke",
    height: "100vh",
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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const ADMIN_MENUS = [
  { icon: <TwoWheelerIcon />, text: "Bikes", href: "/admin/manage-bike" },
  { icon: <PersonIcon />, text: "Users", href: "/admin/manage-user" },
  {
    icon: <SupervisedUserCircleIcon />,
    text: "Managers",
    href: "/admin/manage-manager",
  },
];

export default function AdminLayout({ title, children }) {
  const user = useUser();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "avatar-popover" : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          </Box>
          <Box>
            <BackgroundLetterAvatars
              aria-describedby={id}
              sx={{ cursor: "pointer" }}
              email={user.email}
              onClick={handleClick}
            ></BackgroundLetterAvatars>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              PaperProps={{ sx: { mt: 0.5 } }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">Manager</Typography>
                <Typography>{user.email}</Typography>
                <Button
                  sx={{ mt: 2 }}
                  type="button"
                  variant="contained"
                  onClick={user.signOut}
                  fullWidth
                >
                  Sign Out
                </Button>
              </Box>
            </Popover>
          </Box>
        </Toolbar>
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
        variant="persistent"
        anchor="left"
        open
      >
        <DrawerHeader>
          <Typography variant="h6" noWrap component="div">
            Bike Rent Dashboard
          </Typography>
        </DrawerHeader>
        <Divider />
        <List>
          {ADMIN_MENUS.map(({ href, text, icon }) => (
            <Link noLinkStyle key={text} href={href}>
              <ListItem button>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <Main open>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}

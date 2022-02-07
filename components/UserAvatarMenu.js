import { Box, Button, Popover, Typography } from "@mui/material";
import React from "react";
import BackgroundLetterAvatars from "./BackgroundLetterAvatars";

function UserAvatarMenu({ email, role, extraMenus, onSignOut }) {
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
    <Box>
      <BackgroundLetterAvatars
        aria-describedby={id}
        sx={{ cursor: "pointer" }}
        email={email}
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
          {role && <Typography variant="h6">{role}</Typography>}
          <Typography>Welcome, {email}!</Typography>
          {extraMenus}
          <Button
            sx={{ mt: 2 }}
            type="button"
            variant="contained"
            onClick={onSignOut}
            fullWidth
          >
            Sign Out
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}

export default UserAvatarMenu;

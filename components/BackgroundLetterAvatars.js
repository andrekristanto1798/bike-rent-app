import * as React from "react";
import Avatar from "@mui/material/Avatar";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(email) {
  return {
    sx: {
      bgcolor: stringToColor(email[0].toUpperCase()),
    },
    children: email[0].toUpperCase(),
  };
}

export default function BackgroundLetterAvatars({ sx, email, ...restProps }) {
  const { sx: avatarSx, ...avatarProps } = stringAvatar(email);
  return <Avatar sx={{ ...sx, ...avatarSx }} {...restProps} {...avatarProps} />;
}

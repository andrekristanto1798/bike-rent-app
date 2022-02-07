import { Box } from "@mui/material";
import React from "react";

function DotColor({ color, ...sx }) {
  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: color,
        ...sx,
      }}
    ></Box>
  );
}

export default DotColor;

import React from "react";
import { Grid, Typography } from "@mui/material";

const GridDescription = ({ left, right, equals }) => (
  <Grid container spacing={2}>
    <Grid item xs={equals ? 6 : 4}>
      {typeof left === "string" ? (
        <Typography whiteSpace="pre-wrap" color="secondary">
          {left}
        </Typography>
      ) : (
        left
      )}
    </Grid>
    <Grid item xs={equals ? 6 : 8}>
      {typeof right === "string" ? (
        <Typography whiteSpace="pre-wrap">{right}</Typography>
      ) : (
        right
      )}
    </Grid>
  </Grid>
);

export default GridDescription;

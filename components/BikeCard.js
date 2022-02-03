import React from "react";
import {
  Card,
  CardContent,
  Box,
  Rating,
  Typography,
  Tooltip,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";

function BikeCard({
  bike: {
    model,
    color,
    rating,
    totalBookings,
    location: { name, address },
  },
  onClick,
}) {
  return (
    <Card sx={{ minWidth: 275, cursor: "pointer" }} onClick={onClick}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          component="div"
        >
          {model}
          <Box
            sx={{
              width: 12,
              height: 12,
              ml: 2,
              borderRadius: "50%",
              backgroundColor: color,
            }}
          ></Box>
        </Typography>
        <Tooltip sx={{ preWrap: "wrap" }} title={address}>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            component="div"
          >
            <LocationOn></LocationOn>
            {name}
          </Typography>
        </Tooltip>
        <Typography component="div" color="secondary">
          {totalBookings || 0} bookings made
        </Typography>
        <Rating name="bike-rating" value={rating} precision={0.5} readOnly />
      </CardContent>
    </Card>
  );
}

export default BikeCard;

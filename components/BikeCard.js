import React from "react";
import { Card, CardContent, Box, Rating, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";

function BikeCard({
  bike: { model, color, rating, totalBookings, location, isAvailable },
  onClick,
}) {
  return (
    <Card
      sx={{
        minWidth: 275,
        cursor: "pointer",
        background: isAvailable ? undefined : "burlywood",
      }}
      onClick={onClick}
    >
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
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          component="div"
        >
          <LocationOn></LocationOn>
          {location}
        </Typography>
        <Typography component="div" color="secondary">
          {totalBookings || 0} bookings made {!isAvailable && " (Not Avail.)"}
        </Typography>
        <Rating name="bike-rating" value={rating} precision={0.5} readOnly />
      </CardContent>
    </Card>
  );
}

export default BikeCard;

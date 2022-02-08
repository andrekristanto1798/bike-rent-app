import React from "react";
import { Card, CardContent, Rating, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import DotColor from "./DotColor";

function BikeCard({
  bike: { model, color, rating, totalBookings, location, isAvailable },
  onClick,
  hideTotalBookings,
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
          {model} <DotColor color={color} ml={2} />
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          component="div"
        >
          <LocationOn></LocationOn>
          {location}
        </Typography>
        {!hideTotalBookings && (
          <Typography component="div" color="secondary">
            {totalBookings || 0} bookings made {!isAvailable && " (Not Avail.)"}
          </Typography>
        )}
        {rating ? (
          <Rating name="bike-rating" value={rating} precision={0.5} readOnly />
        ) : (
          "No Rating Yet."
        )}
      </CardContent>
    </Card>
  );
}

export default BikeCard;

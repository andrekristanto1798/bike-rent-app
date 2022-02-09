import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import Link from "@/components/Link";
import DotColor from "@/components/DotColor";

function ReservationCard({
  viewMode,
  reservation: {
    id,
    startDate,
    endDate,
    bike,
    bikeId,
    startTime,
    endTime,
    status,
  },
  onCancel,
  bikePrefixURL = "/rent-bike",
}) {
  const { model, color, location } = bike || {};
  const isExpired =
    (startTime <= Date.now() && endTime <= Date.now()) ||
    status === "CANCELLED";
  const expiredText = status === "CANCELLED" ? "(Cancelled)" : "(Expired)";
  return (
    <Paper
      key={id}
      elevation={3}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        p={2}
        flex={1}
        sx={{
          width: "300px",
          ...(isExpired && {
            background: "darkgray",
            color: "white",
          }),
        }}
      >
        <Typography>
          {isExpired && expiredText} {startDate} - {endDate}
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          component="div"
        >
          {model} <DotColor color={color} ml={1} />
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          component="div"
        >
          <LocationOn></LocationOn>
          {location}
        </Typography>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Link href={`${bikePrefixURL}/${bikeId}`}>
            <Button type="text" sx={{ ...(isExpired && { color: "white" }) }}>
              View Bike Details
            </Button>
          </Link>
          {!isExpired && !viewMode && (
            <Button onClick={onCancel}>Cancel Reservation</Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default ReservationCard;

import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import Link from "@/components/Link";
import DotColor from "@/components/DotColor";

const ONE_DAY = 24 * 60 * 60 * 1000;

const StatusText = {
  Future: "(Future)",
  Ongoing: "(Ongoing)",
  Cancelled: "(Cancelled)",
  Expired: "(Expired)",
};

const getStatusText = (status, startTime, endTime) => {
  if (status === "ACTIVE" && startTime > Date.now()) {
    return StatusText.Future;
  }
  if (
    status === "ACTIVE" &&
    startTime <= Date.now() &&
    endTime + ONE_DAY >= Date.now()
  ) {
    return StatusText.Ongoing;
  }
  return status === "CANCELLED" ? StatusText.Cancelled : StatusText.Expired;
};

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
  const statusText = getStatusText(status, startTime, endTime);
  const isExpired =
    // at least give 1 day distance
    (startTime + ONE_DAY <= Date.now() && endTime + ONE_DAY <= Date.now()) ||
    status === "CANCELLED";
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
          ...(statusText === StatusText.Ongoing && {
            background: "seagreen",
            color: "white",
          }),
        }}
      >
        <Typography>
          {statusText} {startDate} - {endDate}
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
            <Button
              type="text"
              sx={{
                ...((isExpired || statusText === StatusText.Ongoing) && {
                  color: "white",
                }),
              }}
            >
              View Bike Details
            </Button>
          </Link>
          {statusText === "(Future)" && !viewMode && (
            <Button onClick={onCancel}>Cancel Reservation</Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default ReservationCard;

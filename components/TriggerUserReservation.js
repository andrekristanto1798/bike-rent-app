import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useCurrentUser from "@/hooks/useCurrentUser";
import ReservationCard from "./ReservationCard";

function TriggerUserReservation({ open, userId, email, onClose }) {
  const { fetchWithToken } = useCurrentUser();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (open) {
      setReservations([]);
      setLoading(true);
      fetchWithToken(`/api/reservations?userId=${userId}`).then(
        ({ reservations }) => {
          setReservations(reservations);
          setLoading(false);
        }
      );
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`${email}'s Reservations`}</DialogTitle>
      <DialogContent sx={{ "> *": { my: 2 } }}>
        {loading && <CircularProgress />}
        {!loading &&
          reservations.length === 0 &&
          "No reservations found for this user!"}
        {!loading && reservations.length > 0 && (
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
            gap={2}
            rowGap={2}
            p={2}
          >
            {reservations.map((reservation) => {
              return (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  bikePrefixURL="/admin/manage-bike"
                  viewMode
                />
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TriggerUserReservation;

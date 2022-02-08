import React from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import withAuthSSR from "@/hoc/withAuthSSR";
import UserLayout from "@/components/UserLayout";
import Link from "@/components/Link";
import DotColor from "@/components/DotColor";
import useCurrentUser from "@/hooks/useCurrentUser";

const Home = ({ reservations }) => {
  const router = useRouter();
  const { fetchWithToken } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <UserLayout>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={2}
        rowGap={2}
        p={2}
      >
        {reservations.length === 0 && (
          <Typography>You have not made any reservations.</Typography>
        )}
        {reservations.map((reservation) => {
          const { id, startDate, endDate, bikeId, startTime, endTime, status } =
            reservation;
          const { model, color, location } = reservation.bike || {};
          const isExpired =
            (startTime <= Date.now() && endTime <= Date.now()) ||
            status === "CANCELLED";
          const expiredText =
            status === "CANCELLED" ? "(Cancelled)" : "(Expired)";
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
                  <Link href={`/rent-bike/${bikeId}`}>
                    <Button
                      type="text"
                      sx={{ ...(isExpired && { color: "white" }) }}
                    >
                      View Bike Details
                    </Button>
                  </Link>
                  {!isExpired && (
                    <Button
                      onClick={async () => {
                        await fetchWithToken(`/api/reservations/${id}/cancel`, {
                          method: "POST",
                        });
                        enqueueSnackbar(
                          "Your reservation is cancelled successfully",
                          {
                            variant: "success",
                          }
                        );
                        router.replace(router.asPath);
                      }}
                    >
                      Cancel Reservation
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </UserLayout>
  );
};

export const getServerSideProps = withAuthSSR(
  false,
  async ({ currentUser, fetchWithToken }) => {
    if (currentUser.isManager) {
      return { redirect: { destination: "/admin", permanent: false } };
    }
    const { reservations } = await fetchWithToken(`/api/reservations`);
    return {
      props: { currentUser, reservations },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

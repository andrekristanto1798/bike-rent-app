import React from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import withAuthSSR from "@/hoc/withAuthSSR";
import UserLayout from "@/components/UserLayout";
import useCurrentUser from "@/hooks/useCurrentUser";
import ReservationCard from "@/components/ReservationCard";

const Home = ({ reservations }) => {
  const router = useRouter();
  const { fetchWithToken } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <UserLayout title="My Reservations">
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
          return (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={async () => {
                await fetchWithToken(
                  `/api/reservations/${reservation.id}/cancel`,
                  { method: "POST" }
                );
                enqueueSnackbar("Your reservation is cancelled successfully", {
                  variant: "success",
                });
                router.replace(router.asPath);
              }}
            />
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

import React, { useState } from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Box, Button, Rating, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import withAuthSSR from "@/hoc/withAuthSSR";
import UserLayout from "@/components/UserLayout";
import Link from "@/components/Link";
import DotColor from "@/components/DotColor";
import { formatYYYYMMDD } from "@/utils/date";
import useCurrentUser from "@/hooks/useCurrentUser";

const RentBikeById = ({ bikeId, bike, startDate, endDate }) => {
  const router = useRouter();
  const [rating, setRating] = useState(bike.userRating);
  const [reserved, setReserved] = useState(false);
  const { fetchWithToken } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  const title = bike.model ? `Rent Bike ${bike.model}` : `Rent Bike`;
  return (
    <UserLayout title={title}>
      {bike === null && (
        <Typography variant="h6">
          Sorry Your Bike is not available for viewing.&nbsp;
          <Link href="/">Go back to Home now</Link>
        </Typography>
      )}
      <Box>
        <Typography>Model: {bike.model}</Typography>
        <Typography>Location: {bike.location}</Typography>
        <Typography>Rating: {bike.rating || "No rating yet"}</Typography>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          Color: <DotColor color={bike.color} ml={1} />
        </Typography>
      </Box>
      {!reserved && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>
            Reserving for {startDate} to {endDate}
          </Typography>
          <Typography variant="subtitle2">
            To change the date, please go back to the{" "}
            <Link href={{ pathname: "/" }}>Home</Link>
          </Typography>

          <Button
            sx={{ my: 2 }}
            variant="contained"
            onClick={async () => {
              await fetchWithToken("/api/reservations", {
                method: "POST",
                body: JSON.stringify({ bikeId, startDate, endDate }),
              });
              enqueueSnackbar("Your bike is reserved successfully", {
                variant: "success",
              });
              setReserved(true);
            }}
          >
            Reserve Bike
          </Button>
        </Box>
      )}
      {reserved && (
        <Box p={4}>
          Congrats! You have reserved this bike successfully from {startDate} to{" "}
          {endDate}.
        </Box>
      )}
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography>
          {bike.userRating === false
            ? "You have not rate this bike. Rate now"
            : `You have rated this bike ${bike.userRating}`}
        </Typography>
        <Rating
          name="bike-rating"
          value={rating}
          precision={1}
          onChange={(_, value) => {
            setRating(value);
          }}
        />
        <Button
          disabled={rating <= 0 || rating === false}
          onClick={async () => {
            await fetchWithToken(`/api/bikes/${bikeId}/ratings`, {
              method: "PUT",
              body: JSON.stringify({ rating: +rating }),
            });
            router.replace(router.asPath);
          }}
        >
          {bike.userRating === false ? "Rate Bike" : "Change Rate"}
        </Button>
      </Box>
    </UserLayout>
  );
};

export const getServerSideProps = withAuthSSR(
  false,
  async ({ currentUser, query, fetchWithToken }) => {
    if (currentUser.isManager) {
      return {
        redirect: {
          destination: `/admin/manage-bike/${query.id}`,
          permanent: false,
        },
      };
    }
    const { bike } = await fetchWithToken(`/api/bikes/${query.id}`);
    return {
      props: {
        bikeId: query.id,
        currentUser,
        bike,
        startDate:
          formatYYYYMMDD(query.startDate) || formatYYYYMMDD(new Date()),
        endDate: formatYYYYMMDD(query.endDate) || formatYYYYMMDD(new Date()),
      },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(RentBikeById);

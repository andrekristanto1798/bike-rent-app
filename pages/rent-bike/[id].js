import React, { useState } from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Box, Button, Rating, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import withAuthSSR from "@/hoc/withAuthSSR";
import UserLayout from "@/components/UserLayout";
import Link from "@/components/Link";
import DotColor from "@/components/DotColor";
import { formatYYYYMMDD } from "@/utils/date";
import useCurrentUser from "@/hooks/useCurrentUser";

const RentBikeById = ({ bikeId, bike, startDate, endDate, userRate }) => {
  const [rating, setRating] = useState(userRate || 0);
  const [reserved, setReserved] = useState(false);
  const { fetchWithToken } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <UserLayout>
      {bike === null && (
        <Typography variant="h6">
          Sorry Your Bike is not available for viewing.&nbsp;
          <Link href="/">Go back to Home now</Link>
        </Typography>
      )}
      <Box>
        <Typography>Model: {bike.model}</Typography>
        <Typography>Location: {bike.location}</Typography>
        <Typography>Rating: {bike.rating}</Typography>
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
          {userRate === false
            ? "You have not rate this bike. Rate now"
            : `You have rated this bike ${userRate}`}
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
          onClick={() => {
            // change rate
          }}
        >
          {userRate === false ? "Rate Bike" : "Change Rate"}
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
        userRate: false,
      },
    };
  }
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(RentBikeById);

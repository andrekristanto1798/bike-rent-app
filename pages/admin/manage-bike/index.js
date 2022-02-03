import React from "react";
import { useRouter } from "next/router";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { Box } from "@mui/material";
import withManagerSSR from "@/hoc/withManagerSSR";
import AdminLayout from "@/components/AdminLayout";
import BikeCard from "@/components/BikeCard";

const storeA = {
  name: "Store A",
  address: "138 Address St\nUstania, TX, 12399",
};
const storeB = {
  name: "Store B",
  address: "120 Ukansfr St\nUstania, TX, 12399",
};

const bikes = [
  { id: 1, model: "Yamaha FZ-X", rating: 4, location: storeA, color: "red" },
  { id: 2, model: "TVS Raider 125", rating: 4, location: storeA, color: "red" },
  { id: 3, model: "KTM RC 200", rating: 4, location: storeA, color: "red" },
  { id: 4, model: "KTM RC 390", rating: 4, location: storeA, color: "red" },
  {
    id: 5,
    model: "Hero Splendor Plus",
    rating: 4,
    location: storeB,
    color: "red",
  },
  { id: 6, model: "Honda Shine", rating: 4, location: storeB, color: "red" },
  { id: 7, model: "Honda SP 125", rating: 4, location: storeB, color: "red" },
  {
    id: 8,
    model: "Royal Enfield Meteor 350",
    rating: 4,
    location: storeB,
    color: "red",
  },
];

const Home = () => {
  const router = useRouter()
  return (
    <AdminLayout title={`Bikes (${bikes.length} found)`}>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={2}
        rowGap={2}
      >
        {bikes.map((bike) => {
          return (
            <BikeCard
              key={bike.id}
              bike={bike}
              onClick={() => {
                router.push(`/admin/manage-bike/${bike.id}`);
              }}
            />
          );
        })}
      </Box>
    </AdminLayout>
  );
};

export const getServerSideProps = withManagerSSR(async ({ req, user }) => {
  return {
    props: { user },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

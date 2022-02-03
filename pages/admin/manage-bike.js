import React from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import Header from "../../components/Header";
import withManagerSSR from "../../components/withManagerSSR";
import useUser from "../../hooks/useUser";
import AdminLayout from "../../components/AdminLayout";
import { Box } from "@mui/material";

const storeA = {
  name: "Store A",
  address: "138 Address St\nUstania, TX, 12399",
};
const storeB = {
  name: "Store B",
  address: "120 Ukansfr St\nUstania, TX, 12399",
};

const bikes = [
  { id: 1, model: "Yamaha FZ-X", rating: 4, location: storeA },
  { id: 2, model: "TVS Raider 125", rating: 4, location: storeA },
  { id: 3, model: "KTM RC 200", rating: 4, location: storeA },
  { id: 4, model: "KTM RC 390", rating: 4, location: storeA },
  { id: 5, model: "Hero Splendor Plus", rating: 4, location: storeB },
  { id: 6, model: "Honda Shine", rating: 4, location: storeB },
  { id: 7, model: "Honda SP 125", rating: 4, location: storeB },
  { id: 8, model: "Royal Enfield Meteor 350", rating: 4, location: storeB },
];

const Home = () => {
  const user = useUser();
  return (
    <AdminLayout title={`Bikes (${bikes.length} found)`}>
      {bikes.map((bike) => {
        return <Box>{JSON.stringify(bike)}</Box>;
      })}
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

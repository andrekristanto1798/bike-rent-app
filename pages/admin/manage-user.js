import React from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import withManagerSSR from "@/hoc/withManagerSSR";
import AdminLayout from "@/components/AdminLayout";

const Home = () => {
  return <AdminLayout title={`Manage Users`}>Users ...</AdminLayout>;
};

export const getServerSideProps = withManagerSSR(async ({ user }) => {
  return {
    props: { user },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

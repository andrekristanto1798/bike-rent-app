import React from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import withManagerSSR from "@/hoc/withManagerSSR";
import AdminLayout from "@/components/AdminLayout";

const Home = () => {
  return <AdminLayout title={`Admin Dashboard`}>Dashboard</AdminLayout>;
};

export const getServerSideProps = withManagerSSR(async ({ req, user }) => {
  return {
    props: { user },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

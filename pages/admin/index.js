import React from "react";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import withAuthSSR from "@/hoc/withAuthSSR";
import AdminLayout from "@/components/AdminLayout";

const Home = () => {
  return <AdminLayout title={`Admin Dashboard`}>Dashboard</AdminLayout>;
};

export const getServerSideProps = withAuthSSR(true, async ({ currentUser }) => {
  return {
    props: { currentUser },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

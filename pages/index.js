import React from "react";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import Header from "@/components/Header";
import withUserSSR from "@/hoc/withUserSSR";

const Home = ({ user }) => {
  const AuthUser = useAuthUser();
  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      {JSON.stringify(user)}
    </div>
  );
};

export const getServerSideProps = withUserSSR(({ user }) => {
  return {
    props: { user },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

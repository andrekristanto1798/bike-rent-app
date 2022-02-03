import React from "react";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import Header from "../../components/Header";
import withManagerSSR from "../../components/withManagerSSR";

const Home = ({ user }) => {
  const AuthUser = useAuthUser();
  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      Admin Page
      {JSON.stringify(user)}
    </div>
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

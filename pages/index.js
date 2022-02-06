import React from "react";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import Header from "@/components/Header";
import withAuthSSR from "@/hoc/withAuthSSR";

const Home = ({ user }) => {
  const AuthUser = useAuthUser();
  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      {JSON.stringify(user)}
    </div>
  );
};

export const getServerSideProps = withAuthSSR(false, ({ currentUser }) => {
  return {
    props: { currentUser },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

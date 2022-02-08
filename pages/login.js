import React from "react";
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import FirebaseAuth from "@/components/FirebaseAuth";
import UserLayout from "@/components/UserLayout";

const Auth = () => (
  <UserLayout>
    <FirebaseAuth />
  </UserLayout>
);

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Auth);

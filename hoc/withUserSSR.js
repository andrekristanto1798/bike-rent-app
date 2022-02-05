import { AuthAction, withAuthUserTokenSSR } from "next-firebase-auth";

const withUserSSR = (fn) =>
  withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })(async ({ AuthUser, req }) => {
    return fn({ req, user: AuthUser });
  });

export default withUserSSR;

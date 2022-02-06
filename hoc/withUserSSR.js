import { AuthAction, withAuthUserTokenSSR } from "next-firebase-auth";

const withUserSSR = (fn) =>
  withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })(async ({ AuthUser, req }) => {
    return fn({
      req,
      user: { email: AuthUser.email, token: await AuthUser.getIdToken() },
    });
  });

export default withUserSSR;

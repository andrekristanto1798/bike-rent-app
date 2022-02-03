import { AuthAction, withAuthUserTokenSSR } from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";

const withManagerSSR = (fn) =>
  withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })(async ({ AuthUser, req, ...rest }) => {
    // Optionally, get other props.
    // You can return anything you'd normally return from
    // `getServerSideProps`, including redirects.
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    const token = await AuthUser.getIdToken();
    // Note: you shouldn't typically fetch your own API routes from within
    // `getServerSideProps`. This is for example purposes only.
    // https://github.com/gladly-team/next-firebase-auth/issues/264
    const endpoint = getAbsoluteURL("/api/is-manager", req);
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const { user, message } = await response.json();

    if (!response.ok) {
      throw new Error(
        `Data fetching failed with status ${response.status}: ${JSON.stringify(
          message
        )}`
      );
    }

    return fn({ ...rest, req, user: user });
  });

export default withManagerSSR;

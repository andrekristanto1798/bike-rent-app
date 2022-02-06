import { AuthAction, withAuthUserTokenSSR } from "next-firebase-auth";
import getAbsoluteURL from "@/utils/getAbsoluteURL";

const withAuthSSR = (managerOnly, fn) =>
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

    const fetchWithToken = async (url, options = {}) => {
      const resp = await fetch(getAbsoluteURL(url, req), {
        ...rest,
        headers: {
          ...options?.headers,
          Authorization: token,
        },
      });
      return resp.json();
    };

    if (managerOnly && !AuthUser.claims.isManager) {
      console.error(
        `[withAuthSSR] Current user does not have valid 'isManager' claims`
      );
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return fn({
      ...rest,
      req,
      currentUser: { email: AuthUser.email, token },
      token,
      fetchWithToken,
    });
  });

export default withAuthSSR;

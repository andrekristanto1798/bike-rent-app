import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useAuthUser } from "next-firebase-auth";
import { useSnackbar } from "notistack";

const CurrentUserContext = React.createContext(null);

function useCurrentUser() {
  const { enqueueSnackbar } = useSnackbar();
  const user = useContext(CurrentUserContext);
  const { signOut, getIdToken } = useAuthUser();
  const getIdTokenRef = useRef(getIdToken);
  const fetchWithToken = useCallback(async (url, options) => {
    // for first render, fallback to user.token since
    // AuthUser.getIdToken => null
    const token = (await getIdTokenRef.current()) || user?.token;
    const resp = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) {
      let data = {};
      let errorMsg = "Unable to proceed your request!";
      try {
        data = await resp.json();
        errorMsg = data.error;
      } catch {
        // do nothing
      }
      enqueueSnackbar(errorMsg, { variant: "error" });
      return Promise.reject(errorMsg);
    }
    return resp.json();
  }, []);
  useEffect(() => {
    getIdTokenRef.current = getIdToken;
  }, [getIdToken]);
  return useMemo(
    () => ({ ...user, signOut, fetchWithToken }),
    [user, signOut, fetchWithToken]
  );
}

export const CurrentUserProvider = ({ user, children }) => {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default useCurrentUser;

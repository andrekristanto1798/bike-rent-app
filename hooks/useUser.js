import React, { useCallback, useContext, useMemo } from "react";
import { useAuthUser } from "next-firebase-auth";

const UserContext = React.createContext(null);

function useUser() {
  const user = useContext(UserContext);
  const { getIdToken, signOut } = useAuthUser();
  const fetchWithToken = useCallback(
    async (url, options) => {
      const token = await getIdToken();
      const resp = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: token,
        },
      });
      return resp.json();
    },
    [getIdToken]
  );
  return useMemo(
    () => ({ ...user, signOut, fetchWithToken }),
    [user, signOut, fetchWithToken]
  );
}

export const UserProvider = ({ user, children }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default useUser;

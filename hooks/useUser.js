import { useAuthUser } from "next-firebase-auth";
import React, { useContext } from "react";

const UserContext = React.createContext(null);

function useUser() {
  const user = useContext(UserContext);
  const { signOut } = useAuthUser();
  return { ...user, signOut };
}

export const UserProvider = ({ user, children }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default useUser;

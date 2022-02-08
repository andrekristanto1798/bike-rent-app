import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useCurrentUser from "./useCurrentUser";

const UserContext = React.createContext(null);

function useUserList() {
  const value = useContext(UserContext);
  return value;
}

export const UserProvider = ({ initialUsers, children }) => {
  const { fetchWithToken } = useCurrentUser();
  const [users, setUsers] = useState(initialUsers || []);
  const fetchUsers = useCallback(async () => {
    const { users } = await fetchWithToken(
      `/api/users${window.location.search}`
    );
    if (users) {
      setUsers(users);
    }
  }, []);
  const addUser = useCallback(async (user) => {
    await fetchWithToken("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
    await fetchUsers();
  }, []);
  const updateUser = useCallback(async (userId, user) => {
    await fetchWithToken(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(user),
    });
  }, []);
  const removeUser = useCallback(async (userId) => {
    await fetchWithToken(`/api/users/${userId}`, {
      method: "DELETE",
    });
    await fetchUsers();
  }, []);
  const value = useMemo(() => {
    return { users, addUser, updateUser, removeUser, fetchUsers };
  }, [users, addUser, updateUser, removeUser, fetchUsers]);
  useEffect(() => {
    setUsers(initialUsers || []);
  }, [initialUsers]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default useUserList;

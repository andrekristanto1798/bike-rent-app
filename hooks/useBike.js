import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useEnumTypes from "./useEnumTypes";
import useCurrentUser from "./useCurrentUser";

const BikeContext = React.createContext(null);

function useBike() {
  const value = useContext(BikeContext);
  return value;
}

export const BikeProvider = ({ initialBikes, children }) => {
  const { fetchWithToken } = useCurrentUser();
  const { fetchEnums } = useEnumTypes();
  const [bikes, setBikes] = useState(initialBikes || []);
  const fetchBikes = useCallback(async () => {
    const { bikes } = await fetchWithToken(
      `/api/bikes${window.location.search}`
    );
    if (bikes) {
      setBikes(bikes);
    }
  }, []);
  const addBike = useCallback(async (bike) => {
    await fetchWithToken("/api/bikes", {
      method: "POST",
      body: JSON.stringify(bike),
    });
    fetchEnums();
    await fetchBikes();
  }, []);
  const updateBike = useCallback(async (bikeId, bike) => {
    await fetchWithToken(`/api/bikes/${bikeId}`, {
      method: "PUT",
      body: JSON.stringify(bike),
    });
    fetchEnums();
  }, []);
  const removeBike = useCallback(async (bikeId) => {
    await fetchWithToken(`/api/bikes/${bikeId}`, {
      method: "DELETE",
    });
    await fetchBikes();
  }, []);
  const value = useMemo(() => {
    return { bikes, addBike, updateBike, removeBike, fetchBikes };
  }, [bikes, addBike, updateBike, removeBike, fetchBikes]);
  useEffect(() => {
    setBikes(initialBikes || []);
  }, [initialBikes]);
  return <BikeContext.Provider value={value}>{children}</BikeContext.Provider>;
};

export default useBike;

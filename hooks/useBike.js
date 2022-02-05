import React, { useCallback, useContext, useMemo, useState } from "react";
import useEnumTypes from "./useEnumTypes";
import useUser from "./useUser";

const BikeContext = React.createContext(null);

function useBike() {
  const value = useContext(BikeContext);
  return value;
}

export const BikeProvider = ({ initialBikes, children }) => {
  const { fetchWithToken } = useUser();
  const { fetchEnums } = useEnumTypes();
  const [bikes, setBikes] = useState(initialBikes || []);
  const fetchBikes = useCallback(async () => {
    const data = await fetchWithToken("/api/bikes");
    if (data) {
      setBikes(data);
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
  const value = useMemo(() => {
    return { bikes, addBike };
  }, [bikes, addBike]);
  return <BikeContext.Provider value={value}>{children}</BikeContext.Provider>;
};

export default useBike;

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useUser from "./useUser";

const EnumTypesContext = React.createContext(null);

function useEnumTypes() {
  const value = useContext(EnumTypesContext);
  return value;
}

export const EnumTypesProvider = ({ children }) => {
  const { fetchWithToken } = useUser();
  const [models, setModels] = useState([]);
  const [stores, setStores] = useState([]);
  const fetchBikeModels = useCallback(async () => {
    const data = await fetchWithToken("/api/enums/bike-model");
    if (data.models) {
      setModels(data.models);
    }
  }, []);
  const fetchStores = useCallback(async () => {
    const data = await fetchWithToken("/api/enums/bike-store");
    if (data.stores) {
      setStores(data.stores);
    }
  }, []);
  const fetchEnums = useCallback(() => {
    fetchBikeModels();
    fetchStores();
  }, []);
  useEffect(() => {
    fetchEnums();
  }, []);
  const enumTypes = useMemo(
    () => ({ models, stores, fetchEnums }),
    [models, stores, fetchEnums]
  );
  return (
    <EnumTypesContext.Provider value={enumTypes}>
      {children}
    </EnumTypesContext.Provider>
  );
};

export default useEnumTypes;

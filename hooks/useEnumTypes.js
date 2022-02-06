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
  const [colors, setColors] = useState([]);
  const fetchBikeModels = useCallback(async () => {
    const { models } = await fetchWithToken("/api/enums/bike-model");
    if (models) {
      setModels(models);
    }
  }, []);
  const fetchStores = useCallback(async () => {
    const { stores } = await fetchWithToken("/api/enums/bike-store");
    if (stores) {
      setStores(stores);
    }
  }, []);
  const fetchColors = useCallback(async () => {
    const { colors } = await fetchWithToken("/api/enums/bike-color");
    if (colors) {
      setColors(colors);
    }
  }, []);
  const fetchEnums = useCallback(() => {
    fetchBikeModels();
    fetchStores();
    fetchColors();
  }, []);
  useEffect(() => {
    fetchEnums();
  }, []);
  const enumTypes = useMemo(
    () => ({ models, stores, colors, fetchEnums }),
    [models, stores, colors, fetchEnums]
  );
  return (
    <EnumTypesContext.Provider value={enumTypes}>
      {children}
    </EnumTypesContext.Provider>
  );
};

export default useEnumTypes;

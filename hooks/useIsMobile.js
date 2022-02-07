import { useEffect } from "react";
import useViewportSizes from "use-viewport-sizes";

function useIsMobile() {
  const [vpW, , updateVpSizes] = useViewportSizes();
  useEffect(() => {
    updateVpSizes();
  }, []);
  return vpW < 640;
}

export default useIsMobile;

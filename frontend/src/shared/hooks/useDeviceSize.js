import { useState, useEffect } from "react";

const useDeviceSize = () => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;

      setDevice({
        isMobile: width <= 640, // Mobile devices (e.g., phones)
        isTablet: width > 640 && width <= 1024, // Tablets
        isDesktop: width > 1024, // Desktops
      });
    };
    
    updateDevice();
    window.addEventListener("resize", updateDevice);

    return () => {
      window.removeEventListener("resize", updateDevice);
    };
  }, []);

  return device;
};

export default useDeviceSize;

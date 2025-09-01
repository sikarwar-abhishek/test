"use client";

import { useEffect, useState } from "react";

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 1000);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile };
}

export default useMobile;

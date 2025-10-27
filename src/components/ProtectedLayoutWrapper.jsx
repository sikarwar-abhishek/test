"use client";

import SideBar from "@/src/components/common/SideBar";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getUserProfile } from "@/src/api/auth";
import { useEffect, useState } from "react";
import MobileSideBar from "./common/MobileSideBar";
import Image from "next/image";

function ProtectedLayoutWrapper({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  const { isLoading, error } = useQueryHandler(getUserProfile, {
    queryKey: ["user_profile"],
  });

  if (isLoading) {
    return (
      <div className="flex">
        <div className="w-64 hidden sm:block h-screen bg-gray-100 animate-pulse"></div>
        <div className="flex-1 h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching user profile:", error);
    return (
      <div className="flex">
        {/* <div className="w-64 h-screen bg-gray-100 animate-pulse"></div> */}
        <div className="flex-1 flex items-center flex-col justify-center min-h-screen gap-4">
          <div className="relative aspect-video md:h-[400px] h-[150px]">
            <Image
              src={"/asset/server-down.png"}
              fill
              className="w-full h-full object-cover"
              alt="server-down"
            />
          </div>
          <div className="text-center font-poppins text-xl sm:text-4xl font-semibold p-2 place-content-center">
            <p>
              {!navigator.onLine
                ? "You are offline. Please check you internet connection!"
                : "Something went wrong. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {isMobile ? <MobileSideBar /> : <SideBar />}
      {children}
    </div>
  );
}

export default ProtectedLayoutWrapper;

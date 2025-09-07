"use client";

import SideBar from "@/src/components/common/SideBar";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getUserProfile } from "@/src/api/auth"; // Assuming this API exists
import Spinner from "./common/Spinner";

function ProtectedLayoutWrapper({ children }) {
  const { isLoading, error } = useQueryHandler(getUserProfile, {
    queryKey: ["user_profile"],
  });

  if (isLoading) {
    return (
      <div className="flex">
        <div className="w-64 h-screen bg-gray-100 animate-pulse"></div>
        <div className="flex-1 flex items-center justify-center">
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
        <div className="w-64 h-screen bg-gray-100 animate-pulse"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p>
              {!navigator.onLine &&
                "You are offline. Please check you internet connection!"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar />
      {children}
    </div>
  );
}

export default ProtectedLayoutWrapper;

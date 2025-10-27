"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./Icon";

function MobileSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname.split("/")[1] || "home");

  const navigationItems = [
    {
      name: "Home",
      icon: 'home',
      path: "/home",
      color: "text-blue-500",
    },
    {
      name: "Practice",
      icon: 'rank',
      path: "/practice",
      color: "text-gray-400",
    },
    {
      name: "Challenges",
      icon: 'games',
      path: "/challenges",
      color: "text-gray-400",
    },
    {
      name: "Lounge",
      icon: 'person',
      path: "/lounge",
      color: "text-gray-400",
    },
    // {
    //   name: "My Profile",
    //   icon: 'avatar',
    //   path: "/myprofile",
    //   color: "text-gray-400",
    // },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.name.toLowerCase());
    router.push(item.path);
  };

  return (
    <div className="fixed bottom-2 left-0 right-0 bg-white border border-gray-200 z-50 rounded-full m-2 md:hidden" style={{
      display: pathname === "/home" || pathname === "/practice" || pathname === "/challenges" || pathname === "/lounge" || pathname === "/myprofile" ? "block" : "none",
    }}>
      <div className="flex items-center justify-evenly py-1 px-2">
        {navigationItems.map((item) => {
          // const Icon = item.icon;
          const isActive = activeTab === item.name.toLowerCase();

          return (
            <button
              key={item.icon}
              onClick={() => handleNavigation(item)}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-0 flex-1"
            >
              <Icon
                name={item.icon}
                // className={`mb-1 ${isActive ? "text-blue-500" : "text-gray-400"
                //   }`}
                className={`w-5 h-5 transition-colors duration-200 ease-in-out
            ${isActive ? "text-blue-600" : "text-[rgba(185,187,191,0.8)]"}
          `}
              />
              <span
                className={`text-xs font-poppins font-medium ${isActive ? "text-blue-500" : "text-gray-400"
                  }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileSideBar;

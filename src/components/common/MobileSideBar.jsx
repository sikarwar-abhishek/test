"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, BarChart3, Gamepad2, Users } from "lucide-react";

function MobileSideBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Home");

  const navigationItems = [
    {
      name: "Home",
      icon: Home,
      path: "/home",
      color: "text-blue-500",
    },
    {
      name: "Practice",
      icon: BarChart3,
      path: "/practice",
      color: "text-gray-400",
    },
    {
      name: "Challenges",
      icon: Gamepad2,
      path: "/challenges",
      color: "text-gray-400",
    },
    {
      name: "Lounge",
      icon: Users,
      path: "/lounge",
      color: "text-gray-400",
    },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.name);
    router.push(item.path);
  };

  return (
    <div className="fixed bottom-2 left-0 right-0 bg-white border border-gray-200 z-50 rounded-full m-2 md:hidden">
      <div className="flex items-center justify-around py-1 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1"
            >
              <Icon
                size={24}
                className={`mb-1 ${
                  isActive ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs font-poppins font-medium ${
                  isActive ? "text-blue-500" : "text-gray-400"
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

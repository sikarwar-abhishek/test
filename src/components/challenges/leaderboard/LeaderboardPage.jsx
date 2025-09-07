"use client";

import { useState } from "react";
import HomePageHeader from "../../common/HomePageHeader";
import CurrentWeekLeaderboard from "./CurrentWeekLeaderboard";
import PreviousWeekLeaderboard from "./PreviousWeekLeaderboard";

function LeaderboardPage({ challengeId }) {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
        <HomePageHeader text={"Leaderboard"} backBtn />

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="flex border border-[#E5E7EB] shadow-sm rounded-full p-1 max-w-md font-poppins">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-8 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "current"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`px-8 py-1 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "previous"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-blue-500 hover:text-blue-600"
              }`}
            >
              Previous week
            </button>
          </div>
        </div>
        <div className="overflow-auto no-scrollbar">
          {activeTab === "current" ? (
            <CurrentWeekLeaderboard challengeId={challengeId} />
          ) : (
            <PreviousWeekLeaderboard />
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;

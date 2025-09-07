"use client";

import { Calendar, ArrowRight } from "lucide-react";

function PastLeaderboardItem({ leaderboard, onClick }) {
  return (
    <div
      onClick={() => onClick(leaderboard)}
      className="flex items-center justify-between border-b last:border-none py-2 cursor-pointer group"
    >
      <div className="flex items-center gap-4 hover:text-blue-500">
        <div className="p-3 rounded-lg">
          <Calendar className="w-7 h-7 group-hover:text-blue-500" />
        </div>
        <div className="flex flex-col gap-2 font-rubik">
          <h3 className="sm:text-lg font-medium text-gray-900 group-hover:text-blue-500 transition-colors">
            {leaderboard.challenge_name}
          </h3>
          <p className="text-gray-500 group-hover:text-blue-500 sm:text-sm text-xs">
            {leaderboard.date}
          </p>
        </div>
      </div>

      <ArrowRight className="w-5 h-5 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
    </div>
  );
}

export default PastLeaderboardItem;

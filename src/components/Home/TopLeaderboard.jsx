"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
function transformUrl(url) {
  const match = url.match(/\/api\/leaderboard\/(\d+)\/(.*)/);
  if (!match) return null;
  const id = match[1];
  return `/challenges/${id}/leaderboard`;
}

function LeaderboardItem({ player }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 text-sm text-center content-center border border-gray-200 rounded-full text-gray-600">
          {player.rank}
        </span>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 relative">
          <Image
            src={player.profile_picture || "/asset/avatar.png"}
            alt={player.name}
            fill
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/asset/avatar.png";
            }}
          />
        </div>

        <span className="text-gray-800 font-medium">{player.name}</span>
      </div>

      <span className="text-gray-500 text-sm">
        {player.points.toLocaleString()} points
      </span>
    </div>
  );
}

export default function TopLeaderboard({ leaderboard = "" }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border font-poppins">
      <Link
        href={transformUrl(leaderboard?.action_url)}
        className="flex items-center justify-between mb-4 group"
      >
        <h3 className="text-lg font-medium text-gray-900 group-hover:cursor-pointer ">
          Leaderboard
        </h3>
        <ArrowRight
          size={20}
          className="group-hover:cursor-pointer  group-hover:translate-x-1 transition-all duration-200"
        />
      </Link>

      <div className="space-y-1">
        {leaderboard?.top_users.map((player, index) => (
          <div key={player.user_id}>
            <LeaderboardItem player={player} />
            {index < leaderboard?.top_users?.length - 1 && (
              <div className="border-b border-gray-100"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

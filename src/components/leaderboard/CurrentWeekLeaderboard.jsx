import Image from "next/image";
import LeaderboardList from "./LeaderboardList";

function CurrentWeekLeaderboard() {
  const currentUser = {
    rank: 143,
    name: "Me",
    points: 2569,
    avatar: "/asset/avatars/user-avatar.jpg",
  };

  return (
    <div className="py-4 flex flex-col gap-4">
      {/* Current User Position */}
      <div className="bg-white rounded-2xl p-6 font-poppins shadow-sm border border-[#E5E7EB] max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 text-xs text-center content-center border rounded-full">
              {currentUser.rank}
            </span>
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={"/asset/avatar.png"}
                fill
                alt={currentUser.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/asset/avatars/default-avatar.jpg";
                }}
              />
            </div>
            <span className="text-lg font-medium text-gray-800">
              {currentUser.name}
            </span>
          </div>
          <span className="font-medium font-rubik text-orange-500">
            {currentUser.points.toLocaleString()} points
          </span>
        </div>
      </div>

      {/* Leaderboard List */}
      <LeaderboardList />
    </div>
  );
}

export default CurrentWeekLeaderboard;

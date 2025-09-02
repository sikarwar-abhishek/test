import { getAvatarBorderColor, getMedalIcon } from "@/src/utils/helper";
import Image from "next/image";

const leaderboardData = [
  {
    rank: 1,
    name: "Davis Curtis",
    points: 2569,
    avatar: "/asset/avatars/avatar-1.jpg",
    medal: "gold",
  },
  {
    rank: 2,
    name: "Davis Curtis",
    points: 2569,
    avatar: "/asset/avatars/avatar-2.jpg",
    medal: "silver",
  },
  {
    rank: 3,
    name: "Davis Curtis",
    points: 2569,
    avatar: "/asset/avatars/avatar-3.jpg",
    medal: "bronze",
  },
  {
    rank: 4,
    name: "Davis Curtis",
    points: 2569,
    avatar: "/asset/avatars/avatar-4.jpg",
  },
  {
    rank: 5,
    name: "Davis Curtis",
    points: 2569,
    avatar: "/asset/avatars/avatar-5.jpg",
  },
  {
    rank: 6,
    name: "Davis Curtis",
    points: 2569,
    avatar: "/asset/avatars/avatar-6.jpg",
  },
];
function LeaderboardList({ date = "" }) {
  return (
    <div className="bg-blue-50 rounded-3xl p-6 max-w-5xl mx-auto w-full">
      {date ? (
        <div className="text-center mb-6">
          <span className="bg-white px-4 py-2 text-blue-600 font-poppins rounded-lg font-medium text-lg drop-shadow-[0_0_2px_#4676FA33]">
            {date}
          </span>
        </div>
      ) : (
        <div className="w-[25px] h-[10px] rounded-[100px/50px] bg-orange-400 mx-auto -mt-4 mb-2"></div>
      )}
      <div className="space-y-4">
        {leaderboardData.map((player) => (
          <div
            key={`${player.rank}-${player.name}`}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all font-rubik duration-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 text-xs text-center content-center border rounded-full">
                  {player.rank}
                </span>

                <div
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 relative ${getAvatarBorderColor(
                    player.rank
                  )}`}
                >
                  <Image
                    src={"/asset/avatar.png"}
                    alt={player.name}
                    fill
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/asset/avatars/default-avatar.jpg";
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-gray-800">
                    {player.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {player.points.toLocaleString()} points
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {getMedalIcon(player.rank)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardList;

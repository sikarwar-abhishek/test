import Image from "next/image";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getCurrentLeaderboard } from "@/src/api/leaderboard";
import { getAvatarBorderColor, getMedalIcon } from "@/src/utils/helper";
import { isToday } from "date-fns";
function LeaderboardListItem({ player, currentUser }) {
  if (player?.rank === null || player?.rank === undefined) return null;
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 transition-all font-rubik duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <span className="w-6 h-6 sm:w-8 sm:h-8 text-xs text-center content-center border rounded-full flex-shrink-0">
            {player.rank}
          </span>

          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 relative flex-shrink-0 ${getAvatarBorderColor(
              player.rank
            )}`}
          >
            <Image
              src={"/asset/avatar.png"}
              alt={player.username}
              fill
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/asset/avatars/default-avatar.jpg";
              }}
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm sm:text-lg font-medium text-gray-800 truncate">
              {player.username}
              {currentUser?.rank === player.rank && " (Me)"}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">{player.score} points</span>
          </div>
        </div>
        <div className="flex items-center flex-shrink-0 ml-2">{getMedalIcon(player.rank)}</div>
      </div>
    </div>
  );
}
function List({ currentUser, results, date }) {
  const today = isToday(date);

  return (
    <div className="bg-blue-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {today ? (
        <div className="w-[20px] h-[8px] sm:w-[25px] sm:h-[10px] rounded-[100px/50px] bg-orange-400 mx-auto -mt-3 sm:-mt-4 mb-2"></div>
      ) : (
        <div className="text-center mb-4 sm:mb-6">
          <span className="bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-blue-600 font-poppins rounded-lg font-medium text-sm sm:text-lg drop-shadow-[0_0_2px_#4676FA33]">
            {date}
          </span>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {results.map((player) => (
          <LeaderboardListItem
            currentUser={currentUser}
            key={player.user_id}
            player={player}
          />
        ))}
      </div>
    </div>
  );
}
function CurrentWeekLeaderboard({ challengeId }) {
  const {
    data: leaderboard,
    error,
    isLoading,
  } = useQueryHandler(getCurrentLeaderboard, {
    queryKey: ["currentLeaderboard"],
    query: challengeId,
  });
  if (isLoading) return null;
  if (error) return <p>No leaderboard found</p>;
  const { user_best_score: currentUser, results, date } = leaderboard;
  const hasValidResults =
    results &&
    results.length > 0 &&
    results.some(
      (player) => player.score !== null && player.score !== undefined
    );
  return (
    <div className="py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 px-4 sm:px-0">
      {/* <Leaderboard /> */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 font-poppins shadow-sm border border-[#E5E7EB] max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <span className="w-6 h-6 sm:w-8 sm:h-8 text-xs text-center content-center border rounded-full flex-shrink-0">
              {currentUser?.rank ?? "-"}
            </span>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
              <Image
                src={"/asset/avatar.png"}
                fill
                alt={"avatar"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/asset/avatar.png";
                }}
              />
            </div>
            <span className="text-sm sm:text-lg font-medium text-gray-800">Me</span>
          </div>
          <span className="font-medium font-rubik text-orange-500 text-sm sm:text-base flex-shrink-0 ml-2">
            {currentUser?.score} points
          </span>
        </div>
      </div>

      {hasValidResults ? (
        <List currentUser={currentUser} date={date} results={results} />
      ) : (
        <div className="flex items-center justify-center flex-1 py-12 sm:py-20 px-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins text-gray-400 text-center">
            No leaderboard available
          </h2>
        </div>
      )}
    </div>
  );
}

export default CurrentWeekLeaderboard;

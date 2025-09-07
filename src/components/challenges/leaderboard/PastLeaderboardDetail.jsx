"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { getPastLeaderboardByDate } from "@/src/api/leaderboard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Image from "next/image";
import Spinner from "../../common/Spinner";
import { getAvatarBorderColor, getMedalIcon } from "@/src/utils/helper";

function LeaderboardListItem({ player, currentUser }) {
  if (
    player?.rank === null ||
    player?.rank === undefined ||
    player?.score === null ||
    player?.score === undefined
  )
    return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all font-rubik duration-300 hover:shadow-md">
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
              src={player.avatar || "/asset/avatar.png"}
              alt={player.username}
              fill
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/asset/avatar.png";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-medium text-gray-800">
              {player.username || `User ${player.rank}`}
              {currentUser?.rank === player.rank && " (Me)"}
            </span>
            <span className="text-sm text-gray-500">{player.score} points</span>
          </div>
        </div>
        <div className="flex items-center">{getMedalIcon(player.rank)}</div>
      </div>
    </div>
  );
}

function PastLeaderboardDetail({ leaderboard, onBack }) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "pastLeaderboardDetail",
      leaderboard.date,
      leaderboard.challenge_id,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getPastLeaderboardByDate(
        leaderboard.date,
        leaderboard.challenge_id,
        pageParam
      ),
    getNextPageParam: (lastPage) => {
      const nextPageUrl = lastPage?.next;
      if (!nextPageUrl) return undefined;

      const pageParam = new URLSearchParams(nextPageUrl.split("?")[1]).get(
        "page"
      );
      return pageParam ? parseInt(pageParam) : undefined;
    },
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="py-4 flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold">
              {leaderboard.challenge_name}
            </h2>
            <p className="text-gray-500">{leaderboard.date}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 font-poppins shadow-sm border border-[#E5E7EB] max-w-5xl mx-auto w-full">
          <div className="text-center py-8 text-red-500">
            Error loading leaderboard data
          </div>
        </div>
      </div>
    );
  }

  // Get the first page data for current user info
  const firstPageData = data?.pages?.[0];
  const currentUser = firstPageData?.user_best_score;

  // Flatten all results from all pages and filter out null scores
  const allResults = data?.pages?.flatMap((page) => page.results) || [];
  const validResults = allResults.filter(
    (player) =>
      player?.score !== null &&
      player?.score !== undefined &&
      player?.rank !== null &&
      player?.rank !== undefined
  );

  // Check if we should show "No leaderboard available"
  const shouldShowNoLeaderboard =
    (allResults.length === 1 && validResults.length === 0) ||
    validResults.length === 0;

  return (
    <div className="py-4 flex flex-col gap-4">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-semibold">
            {leaderboard.challenge_name}
          </h2>
          <p className="text-gray-500">{leaderboard.date}</p>
        </div>
      </div>

      {/* Current user card (if available and has valid score) */}
      {currentUser &&
        currentUser.score !== null &&
        currentUser.score !== undefined && (
          <div className="bg-white rounded-2xl p-6 font-poppins shadow-sm border border-[#E5E7EB] max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 text-xs text-center content-center border rounded-full">
                  {currentUser?.rank ?? "-"}
                </span>
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
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
                <span className="text-lg font-medium text-gray-800">Me</span>
              </div>
              <span className="font-medium font-rubik text-orange-500">
                {currentUser?.score} points
              </span>
            </div>
          </div>
        )}

      {/* Leaderboard list with infinite scroll - matching CurrentWeekLeaderboard design */}
      <div className="bg-blue-50 rounded-3xl p-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-6">
          <span className="bg-white px-4 py-2 text-blue-600 font-poppins rounded-lg font-medium text-lg drop-shadow-[0_0_2px_#4676FA33]">
            {leaderboard.date}
          </span>
        </div>

        {shouldShowNoLeaderboard ? (
          <div className="text-center py-8 text-gray-500 font-poppins">
            No leaderboard available
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {validResults.map((player, index) => (
                <LeaderboardListItem
                  key={`${player.id || player.rank}-${index}`}
                  player={player}
                  currentUser={currentUser}
                />
              ))}
            </div>

            {/* Intersection observer trigger element */}
            {hasNextPage && (
              <div
                ref={ref}
                className="flex items-center justify-center py-4 mt-4"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                ) : (
                  <div className="text-gray-400">Scroll for more</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PastLeaderboardDetail;

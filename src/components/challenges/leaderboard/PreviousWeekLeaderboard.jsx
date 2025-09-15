"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getPastLeaderboard } from "@/src/api/leaderboard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Spinner from "../../common/Spinner";
import PastLeaderboardItem from "./PastLeaderboardItem";
import PastLeaderboardDetail from "./PastLeaderboardDetail";

function PreviousWeekLeaderboard({ challengeId }) {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["pastLeaderboard", challengeId],
    queryFn: ({ pageParam = 1 }) => getPastLeaderboard(challengeId, pageParam),
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

  const handleLeaderboardClick = (leaderboard) => {
    setSelectedLeaderboard(leaderboard);
  };

  const handleBackToList = () => {
    setSelectedLeaderboard(null);
  };

  // If a leaderboard is selected, show the detail view
  if (selectedLeaderboard) {
    return (
      <PastLeaderboardDetail
        leaderboard={selectedLeaderboard}
        onBack={handleBackToList}
      />
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4 border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="text-center py-8 text-red-500">
          Error loading past leaderboards
        </div>
      </div>
    );
  }

  const allLeaderboards = data?.pages?.flatMap((page) => page.results) || [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full p-4 border border-gray-200 rounded-xl shadow-sm mb-6">
      {/* Render all leaderboard items */}
      {allLeaderboards.map((leaderboard, index) => (
        <PastLeaderboardItem
          key={`${leaderboard.challenge_id}-${leaderboard.date}-${index}`}
          leaderboard={leaderboard}
          onClick={handleLeaderboardClick}
        />
      ))}

      {/* Intersection observer trigger element */}
      {hasNextPage && (
        <div ref={ref} className="flex items-center justify-center py-4">
          {isFetchingNextPage ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          ) : (
            <div className="text-gray-400">Scroll for more</div>
          )}
        </div>
      )}
    </div>
  );
}

export default PreviousWeekLeaderboard;

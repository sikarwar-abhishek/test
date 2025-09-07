"use client";

import HomePageHeader from "../common/HomePageHeader";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { getPastChallenges } from "@/src/api/challenges";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Spinner from "../common/Spinner";
import { useRouter } from "next/navigation";

function SolutionPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["pastChallenges"],
    queryFn: ({ pageParam = 1 }) => getPastChallenges(pageParam),
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

  const handleChallengeClick = (challengeId, date) => {
    console.log(`Viewing solution for challenge ${challengeId}`);
    router.push(
      `/solution/previous/view?challengeId=${challengeId}&date=${date}`
    );
  };

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
          <HomePageHeader backBtn text={"Previous Challenges Solutions"} />
          <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full p-4 border border-gray-200 rounded-xl shadow-sm">
            <div className="text-center py-8 text-red-500">
              Error loading challenges data
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Flatten all results from all pages
  const allChallenges = data?.pages?.flatMap((page) => page.results) || [];

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader backBtn text={"Previous Challenges Solutions"} />

        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full p-4 border border-gray-200 rounded-xl shadow-sm overflow-auto no-scrollbar">
          {allChallenges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No previous challenges available
            </div>
          ) : (
            <>
              {allChallenges.map((challenge, index) => (
                <div
                  key={`${challenge.id || challenge.challenge_id}-${index}`}
                  onClick={() =>
                    handleChallengeClick(challenge.challenge_id, challenge.date)
                  }
                  className="flex items-center justify-between border-b last:border-none py-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 hover:text-blue-500">
                    <div className="p-3 rounded-lg">
                      <Calendar className="w-7 h-7 group-hover:text-blue-500" />
                    </div>
                    <div className="flex flex-col gap-2 font-rubik">
                      <h3 className="sm:text-lg font-medium text-gray-900 group-hover:text-blue-500 transition-colors">
                        {challenge.challenge_name || "Daily Challenge"}
                      </h3>
                      <p className="text-gray-500 group-hover:text-blue-500 sm:text-sm text-xs">
                        {challenge.date ?? "-"}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              ))}

              {/* Intersection observer trigger element */}
              {hasNextPage && (
                <div
                  ref={ref}
                  className="flex items-center justify-center py-4"
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
    </div>
  );
}

export default SolutionPage;

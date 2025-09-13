import { SimplePostCard } from "@/src/components/common/Cards";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { recommendations } from "@/src/api/home";
import { useInfiniteQuery } from "@tanstack/react-query";
import RightSection from "./RightSection";
import TopRecommendation from "./TopRecommendation";

function RecommendedSection() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["recommendations"],
    queryFn: ({ pageParam = 1 }) => recommendations(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        try {
          // Handle both absolute and relative URLs
          const url = lastPage.next.startsWith("http")
            ? new URL(lastPage.next)
            : new URL(lastPage.next, window.location.origin);
          return parseInt(url.searchParams.get("page")) || undefined;
        } catch (error) {
          console.error("Error parsing next page URL:", error);
          return undefined;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single array
  const allRecommendations = data?.pages?.flatMap((page) => page.results) || [];

  // Function to map backend URLs to frontend routes
  const mapActionUrl = (actionUrl) => {
    if (!actionUrl) return "#";

    // Map backend API URLs to frontend routes
    if (actionUrl.includes("/api/challenges/")) {
      const challengeId = actionUrl.match(/\/api\/challenges\/(\d+)\//)?.[1];
      return challengeId ? `/challenges/${challengeId}` : "/challenges";
    }

    if (actionUrl.includes("/api/lounge-posts/")) {
      const postId = actionUrl.match(/\/api\/lounge-posts\/(\d+)\//)?.[1];
      return postId ? `/lounge?postId=${postId}` : "/lounge";
      // return "/lounge";
    }

    if (actionUrl.includes("/api/training/goals/")) {
      return "/myprofile/edit";
    }

    // Default fallback
    return actionUrl.startsWith("/api/") ? "#" : actionUrl;
  };
  return (
    <div className="flex gap-8 mt-6 overflow-auto no-scrollbar">
      {/* left section side */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="z-20 space-y-4 p-4 rounded-2xl shadow-md text-[15px] bg-[#4676FA05]">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-center gap-4 p-4 border-b">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-8 text-red-500">
              <p>Failed to load recommendations. Please try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-blue-500 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : allRecommendations.length > 0 ? (
            // Render recommendations
            allRecommendations.map((recommendation) => {
              // Customize display based on recommendation type
              const getDisplayProps = (rec) => {
                switch (rec.recommendation_type) {
                  case "challenge_new":
                    return {
                      authorName: rec.title,
                      postTitle: rec.subtitle,
                      actionText: rec.action_text || "Join Challenge",
                    };
                  case "engagement_based":
                    return {
                      authorName: rec.title,
                      postTitle: rec.subtitle,
                      actionText: rec.action_text || "View Post",
                    };
                  case "training_suggestion":
                    return {
                      authorName: rec.title,
                      postTitle: rec.subtitle,
                      actionText: rec.action_text || "Start Training",
                    };
                  case "collaborative":
                    return {
                      authorName: rec.title,
                      postTitle: rec.subtitle,
                      actionText: rec.action_text || "View Post",
                    };
                  default:
                    return {
                      authorName: rec.title,
                      postTitle: rec.subtitle,
                      actionText: rec.action_text || "View",
                    };
                }
              };

              const displayProps = getDisplayProps(recommendation);

              return (
                <SimplePostCard
                  key={recommendation.id}
                  avatarSrc="/asset/avatar.png"
                  authorName={displayProps.authorName}
                  postTitle={displayProps.postTitle}
                  postUrl={mapActionUrl(recommendation.action_url)}
                  timestamp={recommendation.time}
                  actionText={displayProps.actionText}
                  showAction={true}
                />
              );
            })
          ) : (
            // Empty state
            <div className="text-center py-8 text-gray-500">
              <p>No recommendations available at the moment.</p>
            </div>
          )}
        </div>

        {hasNextPage && (
          <div className="flex gap-2 text-[#1877F2] justify-center">
            <button
              className="font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "View More"}
            </button>
            <ChevronDown className={isFetchingNextPage ? "animate-spin" : ""} />
          </div>
        )}

        <TopRecommendation />
      </div>

      {/* right section side */}
      <RightSection />
    </div>
  );
}

export default RecommendedSection;

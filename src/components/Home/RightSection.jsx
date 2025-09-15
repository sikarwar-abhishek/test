"use client";

import { getAllRecommendationBasedOnUser } from "@/src/api/home";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TopLeaderboard from "./TopLeaderboard";

const DIFFICULTY_MAP = {
  1: "Easy",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Hard",
};

function RightSection() {
  const {
    data: recommendations,
    isLoading,
    error,
  } = useQueryHandler(getAllRecommendationBasedOnUser, {
    queryKey: ["recommendations_based_on_user"],
  });

  if (isLoading)
    return (
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
    );

  const {
    whats_new: { daily_challenge },
    ongoing_challenge,
    recently_attempted,
    leaderboard,
  } = recommendations;
  return (
    <div className="sm:w-96 w-full space-y-6 font-poppins hidden sm:block">
      {/* What's New Section */}
      {daily_challenge && (
        <div className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">What&apos;s New</h3>
            <ArrowRight size={20} />
          </div>

          <div className="relative rounded-xl overflow-hidden">
            <div className="relative h-48">
              <Image
                src={daily_challenge.image || "/asset/mug.jpg"}
                alt={daily_challenge?.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-4 drop-shadow-lg">
                <div className="flex flex-col gap-2 items-center">
                  <h4 className="text-white text-xl font-semibold">
                    {daily_challenge?.name}
                  </h4>
                  <div className="flex items-center font-inter gap-2 text-white">
                    <Clock size={16} />
                    <span className="text-sm">
                      {daily_challenge?.time_remaining}
                    </span>
                  </div>
                  <Link
                    href={daily_challenge?.action_url.split("/api")[1]}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-xs rounded-lg font-bold transition-colors"
                  >
                    {daily_challenge?.action_text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ongoing Challenge Section */}
      {ongoing_challenge && (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Ongoing Challenge</h3>
            <ArrowRight size={20} />
          </div>

          <div className="relative rounded-xl overflow-hidden mb-4">
            <div className="relative h-48">
              <Image
                src="/asset/mug.jpg"
                alt="Challenge"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-3 drop-shadow-sm">
            <h4 className="font-semibold text-gray-800">Challenge_1</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="text-orange-500 font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-sm text-white py-3 rounded-lg font-bold transition-colors">
              Continue
            </button>
          </div>
        </div>
      )}

      {recently_attempted && recently_attempted.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Recently Attempted</h3>
            <ArrowRight size={20} />
          </div>

          {recently_attempted.map((challenge) => (
            <div
              key={challenge.id}
              className="relative rounded-xl overflow-hidden"
            >
              <div className="relative h-48 rounded-xl">
                <Image
                  src={challenge.image || "/asset/mug.jpg"}
                  alt={challenge?.challenge_name}
                  fill
                  className="object-cover rounded-xl"
                />
                <div className="absolute rounded-xl inset-0 bg-black bg-opacity-40 flex justify-end items-start p-4 drop-shadow-lg">
                  <span className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-xs rounded-lg font-bold transition-colors">
                    {DIFFICULTY_MAP[challenge.difficulty]}
                  </span>
                </div>
              </div>
              <div className="relative flex justify-between items-center pt-4">
                <h4 className="font-poppins font-medium">
                  {challenge?.challenge_name}
                </h4>

                <Link
                  href={`/solution${
                    challenge?.action_url.split(
                      "/api/past-challenges/landing"
                    )[1]
                  }previous`}
                  className="text-[#FF7F4C] rounded-lg font-opensans font-semibold hover:underline transition-colors"
                >
                  {challenge?.action_text}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {leaderboard && leaderboard?.top_users?.length > 0 && (
        <TopLeaderboard leaderboard={leaderboard} />
      )}
    </div>
  );
}

export default RightSection;

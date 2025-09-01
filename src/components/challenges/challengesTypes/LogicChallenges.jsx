"use client";

import Image from "next/image";
import HomePageHeader from "../../common/HomePageHeader";
import ChallengeStart from "./ChallengeStart";
import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function PlayChallenge({ onBack }) {
  const router = useRouter();
  const difficultyLevel = 3;
  const maxStars = 5;

  return (
    <>
      <div className="border border-[#000000] max-w-5xl mx-auto rounded-xl p-6 border-opacity-[0.12]">
        <div className="text-center space-y-4">
          {/* Difficulty Level Number */}
          <div className="text-4xl font-semibold font-poppins text-blue-500">
            {difficultyLevel}
          </div>

          {/* Star Rating */}
          <div className="flex justify-center items-center gap-2">
            {[...Array(maxStars)].map((_, index) => (
              <Star
                key={index}
                className={`w-9 h-9 ${
                  index < difficultyLevel
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Difficulty Label */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold font-poppins text-black mb-2">
              DIFFICULTY
            </h2>
          </div>

          {/* Instructions Section */}
          <div className="text-left space-y-6">
            <div>
              <h3 className="text-lg font-semibold font-monserrat text-black mb-2">
                INSTRUCTIONS
              </h3>
              <div className="space-y-4 text-[#757575] text-sm font-opensans">
                <p className="leading-relaxed">
                  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Integer nec odio. Praesent libero. Sed cursus ante dapibus
                  diam. Sed nisi.
                </p>
                <p className="leading-relaxed">
                  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Integer nec odio. Praesent libero. Sed cursus ante dapibus
                  diam. Sed nisi.
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div>
              <h3 className="text-lg font-semibold font-monserrat text-black mb-2">
                BENEFITS
              </h3>
              <div className="space-y-4 text-[#757575] text-sm font-opensans">
                <p className="leading-relaxed">
                  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Integer nec odio. Praesent libero. Sed cursus ante dapibus
                  diam. Sed nisi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center">
        <button
          onClick={() => router.push("logic/play")}
          className="py-2 px-16 sm:py-2 sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-poppins font-bold flex items-center justify-center text-lg
            transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
        >
          Play
        </button>
      </div>
    </>
  );
}

function LogicChallenges() {
  const [showPlayChallenge, setShowPlayChallenge] = useState(false);
  const handleStartChallenge = () => {
    setShowPlayChallenge(true);
  };

  const handleBackToSelection = () => {
    setShowPlayChallenge(false);
  };
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader backBtn text={"Logic Challenges"} />
        {!showPlayChallenge ? (
          <div className="flex flex-col justify-center mx-auto w-[1000px]">
            <div className="flex max-h-44 gap-6">
              <Link
                href={"/leaderboard"}
                className="relative flex-1 aspect-video max-h-44"
              >
                <Image
                  fill
                  src={"/asset/leaderboard.png"}
                  alt="leaderboard"
                  className="w-full h-full"
                />
              </Link>
              <Link
                href={"/solution/previous"}
                className="relative flex-1 max-h-44"
              >
                <Image
                  fill
                  src={"/asset/previous-challenges.png"}
                  alt="leaderboard"
                  className="w-full h-full"
                />
              </Link>
            </div>
            <ChallengeStart handleStartChallenge={handleStartChallenge} />
          </div>
        ) : (
          <PlayChallenge onBack={handleBackToSelection} />
        )}
      </div>
    </div>
  );
}

export default LogicChallenges;

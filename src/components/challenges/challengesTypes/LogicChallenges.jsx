"use client";

import Image from "next/image";
import HomePageHeader from "../../common/HomePageHeader";
import ChallengeStart from "./ChallengeStart";
import Link from "next/link";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getChallengesList } from "@/src/api/challenges";
import Spinner from "../../common/Spinner";

function LogicChallenges({ challengeId }) {
  const {
    data: challengesList,
    isLoading,
    error,
  } = useQueryHandler(getChallengesList, {
    queryKey: ["challengesList", challengeId],
    staleTime: 0,
    query: challengeId,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex-1 justify-center place-content-center">
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
          <HomePageHeader text={"Challenges"} backBtn />
          <div className="flex items-center justify-center flex-1">
            <p className="text-xl sm:text-5xl lg:text-6xl font-bold font-poppins text-gray-400 text-center">
              No challenges found.
            </p>
          </div>
        </div>
      </div>
    );
  const { puzzles, name } = challengesList;

  const handleBackToSelection = () => {
    setShowPlayChallenge(false);
  };

  return (
    <div className="flex flex-1 max-h-screen overflow-hidden">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col bg-background">

        {/* Non-scrollable Header */}
        <HomePageHeader backBtn text={name} />

        {/* Scrollable content container */}
        <div className="flex-1 overflow-auto mt-6 flex flex-col gap-12 no-scrollbar">
          <div className="flex flex-col justify-center w-full max-w-[1100px] mx-auto">
            <div className="flex gap-2 sm:gap-6 flex-col sm:flex-row select-none">
              <Link
                href={`/challenges/${challengeId}/leaderboard`}
                className="w-full sm:flex-1"
              >
                <Image
                  src={"/asset/leaderboard.png"}
                  alt="leaderboard"
                  width={800}
                  height={450}
                  className="w-full h-auto rounded-lg"
                />
              </Link>
              <Link
                href={`/solution/${challengeId}/previous`}
                className="w-full sm:flex-1"
              >
                <Image
                  src={"/asset/previous-challenges.png"}
                  alt="previous challenges"
                  width={800}
                  height={450}
                  className="w-full h-auto rounded-lg"
                />
              </Link>
            </div>
            <ChallengeStart challengeId={challengeId} puzzles={puzzles} />
          </div>
        </div>



      </div>
    </div>

  );
}

export default LogicChallenges;

"use client";

import Image from "next/image";
import HomePageHeader from "../../common/HomePageHeader";
import ChallengeStart from "./ChallengeStart";
import Link from "next/link";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getChallengesList } from "@/src/api/challenges";

function LogicChallenges({ challengeId }) {
  const {
    data: challengesList,
    isLoading,
    error,
  } = useQueryHandler(getChallengesList, {
    queryKey: ["challengesList", challengeId],
    query: challengeId,
  });

  if (isLoading) return <p>Loading..</p>;
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
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader backBtn text={name} />

        <div className="flex flex-col justify-center  md:w-[800px] lg:w-[1000px] w-full mx-auto">
          <div className="flex gap-2 sm:gap-6 flex-col sm:flex-row">
            <Link
              href={`/challenges/${challengeId}/leaderboard`}
              className="relative h-32 sm:flex-1 sm:min-h-44 sm:aspect-video"
            >
              <Image
                fill
                src={"/asset/leaderboard.png"}
                alt="leaderboard"
                className="w-full h-full object-contain sm:object-fill"
              />
            </Link>
            <Link
              href={`/solution/${challengeId}/previous`}
              className="relative h-32 sm:flex-1 sm:min-h-44 sm:aspect-video"
            >
              <Image
                fill
                src={"/asset/previous-challenges.png"}
                alt="previous challenges"
                className="w-full h-full object-contain sm:object-fill"
              />
            </Link>
          </div>
          <ChallengeStart challengeId={challengeId} puzzles={puzzles} />
        </div>
      </div>
    </div>
  );
}

export default LogicChallenges;

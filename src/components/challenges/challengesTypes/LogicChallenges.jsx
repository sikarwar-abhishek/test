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
  if (error) return <p> Error</p>;
  const { puzzles, name } = challengesList;

  const handleBackToSelection = () => {
    setShowPlayChallenge(false);
  };

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader backBtn text={name} />

        <div className="flex flex-col justify-center mx-auto w-[1000px]">
          <div className="flex max-h-44 gap-6">
            <Link
              href={`/challenges/${challengeId}/leaderboard`}
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
          <ChallengeStart challengeId={challengeId} puzzles={puzzles} />
        </div>
      </div>
    </div>
  );
}

export default LogicChallenges;

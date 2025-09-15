"use client";

import useQueryHandler from "@/src/hooks/useQueryHandler";
import HomePageHeader from "../../common/HomePageHeader";
import { getChallengesList } from "@/src/api/challenges";
import Instructions from "./Instructions";
import { useState, useEffect } from "react";
import { redirect, RedirectType, useRouter } from "next/navigation";
import PlaySubjectiveChallenge from "./PlaySubjectiveChallenge";

function Subjective({ challengeId, puzzleId }) {
  const router = useRouter();
  const [play, setPlay] = useState(false);
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
  if (challengesList.puzzles.length < 1)
    redirect(`/challenges/${challengeId}/`, RedirectType.replace);
  const [currentPuzzle] = challengesList.puzzles.filter(
    (puzzle) => puzzle.puzzleId === puzzleId
  );
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader backBtn text={currentPuzzle.title} />
        {!play ? (
          <Instructions setPlay={setPlay} currentPuzzle={currentPuzzle} />
        ) : (
          <PlaySubjectiveChallenge
            challengeId={challengeId}
            currentPuzzle={currentPuzzle}
          />
        )}
      </div>
    </div>
  );
}

export default Subjective;

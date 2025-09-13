"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import HomePageHeader from "../common/HomePageHeader";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getPracticePuzzlesDaily } from "@/src/api/practice";
import PlayPracticeSubjective from "./PlayPracticeSubjective";
import PlayPracticeGrid from "./PlayPracticeGrid";
import PlayPracticeChess from "./PlayPracticeChess";

function PracticePuzzleFlow() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzleStates, setPuzzleStates] = useState({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const { data, isLoading, error } = useQueryHandler(getPracticePuzzlesDaily, {
    queryKey: ["practice_puzzles_daily"],
    staleTime: 0, // Always refetch to get latest puzzle states
  });

  // Ensure fresh data on component mount
  useEffect(() => {
    queryClient.invalidateQueries(["practice_puzzles_daily"]);
  }, [queryClient]);

  useEffect(() => {
    if (data?.data?.puzzles) {
      // Initialize puzzle states and find first unsubmitted puzzle
      const puzzles = data.data.puzzles;
      const states = {};
      let firstUnsubmitted = null;
      let allSubmitted = true;

      puzzles.forEach((puzzle, index) => {
        const isSubmitted = puzzle.is_submitted || false;
        states[index] = {
          submitted: isSubmitted,
          result: isSubmitted
            ? {
                is_correct: puzzle.is_correct,
                user_answer: puzzle.user_answer,
                solution: puzzle.solution,
              }
            : null,
        };

        // Find first unsubmitted puzzle (only set if not already found)
        if (!isSubmitted && firstUnsubmitted === null) {
          firstUnsubmitted = index;
          allSubmitted = false;
        } else if (!isSubmitted) {
          allSubmitted = false;
        }
      });

      setPuzzleStates(states);
      setAllCompleted(allSubmitted);

      // If no unsubmitted puzzle found, start from the beginning
      setCurrentPuzzleIndex(firstUnsubmitted !== null ? firstUnsubmitted : 0);
    }
  }, [data]);

  if (isLoading) return <p>Loading..</p>;
  if (error) return <p>Error loading puzzles</p>;

  const puzzles = data?.data?.puzzles || [];
  const totalPuzzles = puzzles.length;
  const currentPuzzle = puzzles[currentPuzzleIndex];
  const puzzleTitle = currentPuzzle?.title || "Practice Section";

  if (totalPuzzles === 0) {
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
          <HomePageHeader text={"Practice Section"} backBtn />
          <div className="flex items-center justify-center flex-1">
            <p className="text-xl text-gray-500">
              No practice puzzles available today.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitSuccess = (result) => {
    // Update puzzle state with result
    setPuzzleStates((prev) => ({
      ...prev,
      [currentPuzzleIndex]: {
        submitted: true,
        result: result,
      },
    }));

    // Move to next puzzle or show completion
    if (currentPuzzleIndex < totalPuzzles - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      // Only invalidate queries when moving to next puzzle
      queryClient.invalidateQueries(["practice_puzzles_daily"]);
      queryClient.invalidateQueries(["practice_progress"]);
    } else {
      // All puzzles completed - show modal first, invalidate queries later
      setShowCompletionModal(true);
    }
  };

  const handleFinish = () => {
    setShowCompletionModal(false);
    // Invalidate queries to refresh practice page data
    queryClient.invalidateQueries(["practice_puzzles_daily"]);
    queryClient.invalidateQueries(["practice_progress"]);
    router.push("/practice");
  };

  const renderPuzzlePlayer = () => {
    if (!currentPuzzle) return null;

    const puzzleType = currentPuzzle.type?.toLowerCase();

    if (puzzleType === "subjective") {
      return (
        <PlayPracticeSubjective
          currentPuzzle={currentPuzzle}
          onSubmitSuccess={handleSubmitSuccess}
        />
      );
    } else if (puzzleType === "grid") {
      return (
        <PlayPracticeGrid
          currentPuzzle={currentPuzzle}
          onSubmitSuccess={handleSubmitSuccess}
        />
      );
    } else if (puzzleType === "chess") {
      return (
        <PlayPracticeChess
          currentPuzzle={currentPuzzle}
          onSubmitSuccess={handleSubmitSuccess}
        />
      );
    }

    return <div>Unsupported puzzle type: {puzzleType}</div>;
  };

  // Practice Completion Modal with custom content
  const PracticeCompletionModal = () => {
    if (!showCompletionModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border-0 shadow-xl">
          <div className="text-center space-y-6">
            {/* Celebration Illustration */}
            <div className="relative mx-auto aspect-square max-h-24">
              <Image
                fill
                quality={100}
                src="/asset/party-popper.svg"
                alt="Celebration"
                className="w-24 h-24 object-cover"
              />
            </div>

            {/* Congratulations Text */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium font-poppins text-gray-900 leading-tight">
                Congratulations, you have completed all practice puzzles!
              </h2>

              <p className="text-[22px] font-poppins font-semibold text-blue-500">
                Great job on your training today!
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleFinish}
              className="w-full bg-blue-500 hover:bg-blue-600 font-poppins font-bold text-white py-3 px-6 rounded-xl text-lg h-auto
                transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:shadow-md hover:shadow-blue-400/40"
            >
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Show "already completed" message if all puzzles are submitted
  if (allCompleted) {
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
          <HomePageHeader text={"Practice Section"} backBtn />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold font-poppins text-gray-900">
                You have already completed your training
              </h2>
              <p className="text-gray-600 font-opensans">
                Come back tomorrow for new practice puzzles!
              </p>
              <button
                onClick={() => router.push("/practice")}
                className="py-2 px-6 bg-blue-500 text-white font-poppins font-bold rounded-lg
                  transition-all duration-300 ease-in-out
                  hover:-translate-y-1 hover:shadow-md hover:shadow-blue-400/40"
              >
                Back to Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader text={puzzleTitle} backBtn />

        <div className="flex flex-col gap-4 overflow-auto no-scrollbar pb-4">
          {/* Progress indicator */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">
              {currentPuzzleIndex + 1}/{totalPuzzles}
            </div>
          </div>

          {/* Puzzle Content */}
          {renderPuzzlePlayer()}
        </div>
      </div>

      {/* Completion Modal */}
      <PracticeCompletionModal />
    </div>
  );
}

export default PracticePuzzleFlow;

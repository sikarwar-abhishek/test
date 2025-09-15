"use client";

import { useState } from "react";
import { Check, Play } from "lucide-react";
import HomePageHeader from "../common/HomePageHeader";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { pastChallengesDetails } from "@/src/api/challenges";
import Spinner from "../common/Spinner";
import PuzzleSolutionViewer from "./PuzzleSolutionViewer";
import GridSolutionViewer from "./GridSolutionViewer";
import ChessSolutionViewer from "./ChessSolutionViewer";

const customStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes statusChange {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-statusChange {
    animation: statusChange 0.6s ease-in-out;
  }
`;

const DIFFICULTY_MAP = {
  1: "Easy",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Hard",
};

function ViewPastPuzzles({ challengeId, date }) {
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);

  const {
    data: challengeData,
    isLoading,
    error,
  } = useQueryHandler((params) => pastChallengesDetails(params[0], params[1]), {
    queryKey: ["pastChallengeDetails", challengeId, date],
    query: [challengeId, date],
  });

  const handlePuzzleClick = (puzzle) => {
    // Handle subjective, grid, and chess puzzles
    const puzzleType = puzzle.type?.toLowerCase();
    if (puzzleType === "subjective" || puzzleType === "grid" || puzzleType === "chess") {
      setSelectedPuzzle(puzzle);
    }
  };

  const handleBackToList = () => {
    setSelectedPuzzle(null);
  };

  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-4 sm:py-6 flex-1 flex flex-col gap-6 sm:gap-12 bg-background">
          <HomePageHeader backBtn text={"Puzzles"} />
          <div className="flex items-center justify-center flex-1 py-12 sm:py-20 px-4">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins text-gray-400 text-center">
              No puzzles available
            </h2>
          </div>
        </div>
      </div>
    );
  }

  const puzzles = challengeData?.puzzles || [];

  // If a puzzle is selected, show the appropriate solution viewer
  if (selectedPuzzle) {
    const puzzleType = selectedPuzzle.type?.toLowerCase();

    if (puzzleType === "grid") {
      return (
        <GridSolutionViewer
          puzzle={selectedPuzzle}
          onBack={handleBackToList}
          challengeId={challengeId}
          date={date}
        />
      );
    } else if (puzzleType === "chess") {
      return (
        <ChessSolutionViewer
          puzzle={selectedPuzzle}
          onBack={handleBackToList}
          challengeId={challengeId}
          date={date}
        />
      );
    } else {
      return (
        <PuzzleSolutionViewer
          puzzle={selectedPuzzle}
          onBack={handleBackToList}
          challengeId={challengeId}
          date={date}
        />
      );
    }
  }

  if (!puzzles || puzzles.length === 0) {
    return (
      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-4 sm:py-6 flex-1 flex flex-col gap-6 sm:gap-12 bg-background">
          <HomePageHeader backBtn text={"Puzzles"} />
          <div className="flex items-center justify-center flex-1 py-12 sm:py-20 px-4">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins text-gray-400 text-center">
              No puzzles available
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Inject custom styles */}
      <style jsx>{customStyles}</style>

      <div className="flex flex-1 max-h-screen overflow-auto">
        <div className="relative min-h-screen sm:px-10 px-4 py-4 sm:py-6 flex-1 flex flex-col gap-6 sm:gap-12 bg-background">
          <HomePageHeader backBtn text={`Puzzles`} />

          <div className="border border-[#000000] rounded-xl drop-shadow-md border-opacity-[0.12] bg-gray-50 p-3 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex gap-3 sm:gap-8">
                {/* Left Progress Column */}
                <div className="flex flex-col flex-shrink-0">
                  {puzzles.map((puzzle, index) => (
                    <div
                      key={puzzle.puzzleId || index}
                      className="flex flex-col items-center"
                    >
                      {/* Progress Icon - aligned with puzzle card height */}
                      <div className="flex items-center h-12 sm:h-16">
                        <div
                          className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transform ${
                            puzzle.is_submitted
                              ? "bg-green-500 text-white scale-110"
                              : "bg-blue-500 text-white hover:scale-105"
                          }`}
                        >
                          <div className="">
                            {puzzle.is_submitted ? (
                              <Check className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                            ) : (
                              <Play className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-white transition-transform duration-200 hover:scale-110" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Connecting Line */}
                      {index < puzzles.length - 1 && (
                        <div className="h-2 sm:h-3 w-0.5 border-l-2 border-blue-400" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Right Content Area */}
                <div className="flex-1 space-y-2 sm:space-y-4 min-w-0">
                  {puzzles.map((puzzle, index) => (
                    <div
                      key={puzzle.puzzleId || index}
                      className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out transform ${
                        puzzle.type?.toLowerCase() === "subjective" ||
                        puzzle.type?.toLowerCase() === "grid" ||
                        puzzle.type?.toLowerCase() === "chess"
                          ? "cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 hover:shadow-blue-500/30"
                          : "cursor-not-allowed opacity-75"
                      } ${puzzle.is_submitted ? "animate-statusChange" : ""}`}
                      onClick={() => handlePuzzleClick(puzzle)}
                    >
                      <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm sm:text-xl font-poppins font-bold truncate">
                            {puzzle.title || `Puzzle_Name_${index + 1}`}
                          </h2>
                        </div>

                        <div className="flex gap-1.5 sm:gap-4 items-center flex-shrink-0">
                          {puzzle.is_submitted ? (
                            <span className="px-2 py-1 sm:px-4 sm:py-1 bg-green-500 rounded-lg text-white font-opensans font-bold text-xs sm:text-sm transition-all duration-300 ease-in-out transform hover:scale-105 animate-fadeIn whitespace-nowrap">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 sm:px-6 sm:py-1 whitespace-nowrap bg-orange-400 rounded-lg text-white font-poppins font-bold text-xs sm:text-sm transition-all duration-300 ease-in-out transform hover:scale-105">
                              Not Attempted
                            </span>
                          )}
                          <span className="border rounded-xl px-2 py-1 sm:px-3 sm:py-1 font-opensans font-bold text-xs sm:text-sm transition-all duration-200 hover:bg-gray-100 whitespace-nowrap">
                            {DIFFICULTY_MAP[puzzle.difficultyLevel] || "Medium"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewPastPuzzles;

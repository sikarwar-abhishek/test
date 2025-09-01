"use client";

import { useState } from "react";
import { Play, Check, Lock } from "lucide-react";

export default function ChallengeStart({ handleStartChallenge }) {
  const [puzzles, setPuzzles] = useState([
    {
      id: 1,
      name: "Puzzle_Name_1",
      difficulty: "Easy",
      completed: false,
      unlocked: true,
    },
    {
      id: 2,
      name: "Puzzle_Name_2",
      difficulty: "Medium",
      completed: false,
      unlocked: false,
    },
    {
      id: 3,
      name: "Puzzle_Name_3",
      difficulty: "Hard",
      completed: false,
      unlocked: false,
    },
  ]);

  const [currentPuzzle, setCurrentPuzzle] = useState(1);

  const completePuzzle = (puzzleId) => {
    setPuzzles((prev) =>
      prev.map((puzzle) => {
        if (puzzle.id === puzzleId) {
          return { ...puzzle, completed: true };
        }
        if (puzzle.id === puzzleId + 1) {
          return { ...puzzle, unlocked: true };
        }
        return puzzle;
      })
    );

    // Move to next puzzle after a short delay
    setTimeout(() => {
      if (puzzleId < puzzles.length) {
        setCurrentPuzzle(puzzleId + 1);
      }
    }, 500);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-blue-100 text-blue-700";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <div className="border border-[#000000] rounded-xl drop-shadow-md mt-6 border-opacity-[0.12] bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-8">
            {/* Left Progress Column */}
            <div className="flex flex-col items-center pt-4">
              {puzzles.map((puzzle, index) => (
                <div key={puzzle.id} className="flex flex-col items-center">
                  {/* Progress Icon */}
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out transform
                    ${
                      puzzle.completed
                        ? "bg-green-500 text-white scale-110"
                        : puzzle.unlocked && currentPuzzle === puzzle.id
                        ? "bg-blue-500 text-white shadow-lg scale-105"
                        : "bg-white border-2 border-blue-200 text-blue-300"
                    }
                  `}
                  >
                    {puzzle.completed ? (
                      <Check className="w-4 h-4 animate-in zoom-in duration-300" />
                    ) : puzzle.unlocked ? (
                      <Play className="w-4 h-4" fill="white" />
                    ) : (
                      <div className="w-4 h-4 rounded-full" />
                    )}
                  </div>

                  {/* Connecting Line */}
                  {index < puzzles.length - 1 && (
                    <div className="h-8 w-0.5 border-l-2 border-dashed border-blue-200" />
                  )}
                </div>
              ))}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 space-y-4">
              {puzzles.map((puzzle) => (
                <div
                  key={puzzle.id}
                  className={`
                  rounded-2xl p-4 transition-all duration-500 ease-in-out transform
                  ${
                    puzzle.unlocked && !puzzle.completed
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                      : puzzle.completed
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-[#CADBFF] text-white cursor-not-allowed"
                  }
                `}
                  // onClick={() => {
                  //   if (puzzle.unlocked && !puzzle.completed) {
                  //     completePuzzle(puzzle.id);
                  //   }
                  // }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-full flex justify-center">
                      {!puzzle.unlocked ? (
                        <Lock className="w-8 h-8" />
                      ) : (
                        puzzle.completed && null
                      )}

                      {puzzle.unlocked && (
                        <h2 className="text-xl mr-auto font-poppins font-bold">
                          {puzzle.name}
                        </h2>
                      )}
                    </div>

                    {puzzle.unlocked && (
                      <span
                        className={`
                        text-sm font-opensans font-bold transition-all duration-300
                        ${
                          puzzle.completed
                            ? ""
                            : puzzle.unlocked
                            ? "text-white rounded-xl"
                            : getDifficultyColor(puzzle.difficulty)
                        }
                      `}
                      >
                        {puzzle.completed ? (
                          <div className="flex gap-4 items-center">
                            <span className="px-4 py-1 bg-[#45B39C] rounded-lg drop-shadow-md text-white">
                              Completed
                            </span>
                            <span className="border rounded-xl px-3 py-1 font-opensans font-bold text-sm">
                              {puzzle.difficulty}
                            </span>
                          </div>
                        ) : (
                          <span className="border rounded-xl px-3 py-1 font-opensans font-bold text-sm">
                            {puzzle.difficulty}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleStartChallenge}
        className="mx-auto self-start py-2 px-6 sm:py-2 sm:px-8 mt-6 rounded-lg gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-poppins font-bold flex items-center justify-center text-lg
  transition-all duration-300 ease-in-out
  hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
      >
        Start Challenge
      </button>
    </>
  );
}

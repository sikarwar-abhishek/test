"use client";

import { DIFFICULTY_MAP, getDifficultyColor } from "@/src/constants/constant";
import { Play, Check, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChallengeStart({ challengeId, puzzles }) {
  const router = useRouter();

  const [currentPuzzle] = puzzles.filter((puzzle) => !puzzle.locked);

  if (!puzzles || puzzles.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 py-20">
        <h2 className="text-xl sm:text-5xl lg:text-6xl font-bold font-poppins text-gray-400 text-center">
          No puzzles available
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="border border-[#000000] rounded-xl drop-shadow-md mt-6 border-opacity-[0.12] bg-gray-50 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 sm:gap-6 lg:gap-8 select-none">
            {/* Left Progress Column */}
            <div className="flex flex-col flex-shrink-0">
              {puzzles.map((puzzle, index) => (
                <div
                  key={puzzle.puzzleId}
                  className="flex flex-col items-center"
                >
                  {/* Progress Icon - aligned with puzzle card height */}
                  <div className="flex items-center h-[48px] sm:h-[52px] lg:h-[60px]">
                    <div
                      className={`
                      w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out transform
                      ${
                        puzzle.is_submitted
                          ? "bg-green-500 text-white scale-110"
                          : !puzzle.locked
                          ? "bg-blue-500 text-white shadow-lg scale-105"
                          : "bg-white border-2 border-blue-200 text-blue-300"
                      }
                    `}
                    >
                      {puzzle.is_submitted ? (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 animate-in zoom-in duration-300" />
                      ) : !puzzle.locked ? (
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" fill="white" />
                      ) : (
                        <div className="w-3 h-3  sm:w-4 sm:h-4 rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {index < puzzles.length - 1 && (
                    <div className="h-2 sm:h-4 md:h-5 lg:h-4 w-0.5 border-l-2 border-dashed border-blue-200" />
                  )}
                </div>
              ))}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 space-y-2 sm:space-y-3 lg:space-y-4 min-w-0">
              {puzzles.map((puzzle) => (
                <div
                  key={puzzle.puzzleId}
                  className={`
                  rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center transition-all duration-500 ease-in-out transform h-12 sm:h-[56px] md:h-[60px]
                  ${
                    !puzzle.locked && !puzzle.completed
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                      : puzzle.is_submitted
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-[#CADBFF] text-white cursor-not-allowed"
                  }
                `}
                >
                  <div className="flex items-center justify-between w-full min-w-0">
                    <div
                      onClick={() => {
                        if (!puzzle.locked) {
                          router.push(
                            `/challenges/${challengeId}/${puzzle.type.toLowerCase()}/${
                              puzzle.puzzleId
                            }`
                          );
                        }
                      }}
                      className="flex-1 flex justify-center min-w-0"
                    >
                      {puzzle.locked && !puzzle.is_submitted ? (
                        <Lock className="w-[26px] h-[26px] sm:w-7 sm:h-7" />
                      ) : (
                        puzzle.is_submitted && (
                          <h2 className="text-sm max-w-24 sm:max-w-64 overflow-hidden text-ellipsis sm:text-lg lg:text-xl mr-auto font-poppins font-bold truncate">
                            {puzzle.title}
                          </h2>
                        )
                      )}

                      {!puzzle.locked && (
                        <h2 className="text-sm max-w-24 sm:max-w-64 overflow-hidden text-ellipsis sm:text-lg lg:text-xl mr-auto font-poppins font-bold truncate">
                          {puzzle.title}
                        </h2>
                      )}
                    </div>

                    {(!puzzle.locked || puzzle.is_submitted) && (
                      <div
                        className={`
                        text-xs sm:text-sm font-opensans font-bold transition-all duration-300 flex-shrink-0 ml-2
                        ${
                          puzzle.is_submitted
                            ? ""
                            : !puzzle.locked
                            ? "text-white rounded-xl"
                            : getDifficultyColor(
                                DIFFICULTY_MAP[puzzle.difficultyLevel]
                              )
                        }
                      `}
                      >
                        {/* {puzzle.is_submitted ? (
                          <div className="flex flex-row gap-2 sm:gap-4 sm:items-center max-h-fit">
                            <span className="px-2 sm:px-4 bg-[#45B39C] font-bold rounded-lg flex justify-center items-center drop-shadow-md text-white text-xs sm:text-sm whitespace-nowrap">
                              {"Completed"}
                            </span>
                            <span className="border rounded-xl px-2 sm:px-3 font-opensans flex justify-center items-center font-bold text-xs sm:text-sm whitespace-nowrap">
                              {DIFFICULTY_MAP[puzzle.difficultyLevel]}
                            </span>
                          </div>
                        ) : (
                          <span className="border rounded-xl px-2 sm:px-3 py-1 font-opensans font-bold text-xs sm:text-sm whitespace-nowrap">
                            {DIFFICULTY_MAP[puzzle.difficultyLevel]}
                          </span>
                        )} */}
                        <div className="flex flex-row gap-2 sm:gap-4 sm:items-center max-h-fit">
                          {puzzle.is_submitted ? (
                            <>
                              <span className="px-2 sm:px-4 sm:py-1 bg-[#45B39C] font-bold rounded-lg flex justify-center items-center drop-shadow-md text-white text-xs sm:text-sm whitespace-nowrap">
                                {"Completed"}
                              </span>
                              <span className="border rounded-xl py-1 px-2 sm:px-3 font-opensans flex justify-center items-center font-bold text-xs sm:text-sm whitespace-nowrap">
                                {DIFFICULTY_MAP[puzzle.difficultyLevel]}
                              </span>
                            </>
                          ) : (
                            <span className="border rounded-xl px-2 sm:px-3 py-1 font-opensans font-bold text-xs sm:text-sm whitespace-nowrap">
                              {DIFFICULTY_MAP[puzzle.difficultyLevel]}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {currentPuzzle && (
        <StartChallenge
          challengeId={challengeId}
          currentPuzzle={currentPuzzle}
        />
      )}
    </>
  );
}

function StartChallenge({ challengeId, currentPuzzle }) {
  return (
    <div className="hidden sm:flex justify-center mt-4 sm:mt-6 ">
      <Link
        href={`/challenges/${challengeId}/${currentPuzzle.type.toLowerCase()}/${
          currentPuzzle.puzzleId
        }`}
        className="w-full sm:w-auto max-w-xs sm:max-w-none py-3 px-6 sm:py-2 sm:px-8 rounded-lg gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-poppins font-bold flex items-center justify-center text-base sm:text-lg
    transition-all duration-300 ease-in-out
    hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
      >
        Start Challenge
      </Link>
    </div>
  );
}

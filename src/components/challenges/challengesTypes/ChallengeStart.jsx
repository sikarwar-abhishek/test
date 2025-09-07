import { Play, Check, Lock } from "lucide-react";
import Link from "next/link";

const DIFFICULTY_MAP = {
  1: "Easy",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Hard",
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

export default function ChallengeStart({ challengeId, puzzles }) {
  console.log(puzzles);

  const [currentPuzzle] = puzzles.filter((puzzle) => !puzzle.locked);
  console.log(currentPuzzle);
  if (!puzzles || puzzles.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1 py-20">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins text-gray-400 text-center">
          No puzzles available
        </h2>
      </div>
    );
  }
  return (
    <>
      <div className="border border-[#000000] rounded-xl drop-shadow-md mt-6 border-opacity-[0.12] bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-8">
            {/* Left Progress Column */}
            <div className="flex flex-col">
              {puzzles.map((puzzle, index) => (
                <div
                  key={puzzle.puzzleId}
                  className="flex flex-col items-center"
                >
                  {/* Progress Icon - aligned with puzzle card height */}
                  <div className="flex items-center h-16">
                    {" "}
                    {/* Match the height of puzzle cards */}
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out transform
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
                        <Check className="w-4 h-4 animate-in zoom-in duration-300" />
                      ) : !puzzle.locked ? (
                        <Play className="w-4 h-4" fill="white" />
                      ) : (
                        <div className="w-4 h-4 rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {index < puzzles.length - 1 && (
                    <div className="h-3 w-0.5 border-l-2 border-dashed border-blue-200" />
                  )}
                </div>
              ))}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 space-y-4">
              {puzzles.map((puzzle) => (
                <div
                  key={puzzle.puzzleId}
                  className={`
                  rounded-2xl p-4 flex items-center transition-all duration-500 ease-in-out transform
                  ${
                    !puzzle.locked && !puzzle.completed
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                      : puzzle.is_submitted
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-[#CADBFF] text-white cursor-not-allowed"
                  }
                `}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-full flex justify-center">
                      {puzzle.locked && !puzzle.is_submitted ? (
                        <Lock className="w-8 h-8" />
                      ) : (
                        puzzle.is_submitted && (
                          <h2 className="text-xl mr-auto font-poppins font-bold">
                            {puzzle.title}
                          </h2>
                        )
                      )}

                      {!puzzle.locked && (
                        <h2 className="text-xl mr-auto font-poppins font-bold">
                          {puzzle.title}
                        </h2>
                      )}
                    </div>

                    {(!puzzle.locked || puzzle.is_submitted) && (
                      <span
                        className={`
                        text-sm font-opensans font-bold transition-all duration-300
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
                        {puzzle.is_submitted ? (
                          <div className="flex gap-4 items-center">
                            <span className="px-4 py-1 bg-[#45B39C] rounded-lg drop-shadow-md text-white">
                              Completed
                            </span>
                            <span className="border rounded-xl px-3 py-1 font-opensans font-bold text-sm">
                              {DIFFICULTY_MAP[puzzle.difficultyLevel]}
                            </span>
                          </div>
                        ) : (
                          <span className="border rounded-xl px-3 py-1 font-opensans font-bold text-sm">
                            {DIFFICULTY_MAP[puzzle.difficultyLevel]}
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
      {currentPuzzle && (
        <Link
          href={`/challenges/${challengeId}/${currentPuzzle.type.toLowerCase()}/${
            currentPuzzle.puzzleId
          }`}
          className="mx-auto mb-6 self-start py-2 px-6 sm:py-2 sm:px-8 mt-6 rounded-lg gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-poppins font-bold flex items-center justify-center text-lg
  transition-all duration-300 ease-in-out
  hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
        >
          Start Challenge
        </Link>
      )}
    </>
  );
}

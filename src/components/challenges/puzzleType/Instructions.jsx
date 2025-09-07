import { Star } from "lucide-react";

export default function Instructions({ currentPuzzle, setPlay, onBack }) {
  console.log(currentPuzzle);
  const { instruction, difficultyLevel } = currentPuzzle;
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
                {instruction}
              </div>
            </div>

            {/* Benefits Section */}
            <div>
              <h3 className="text-lg font-semibold font-monserrat text-black mb-2">
                BENEFITS
              </h3>
              <ul className="space-y-4 text-[#757575] text-sm font-opensans list-disc px-4">
                <li>
                  Working on a puzzle reinforces connections between brain
                  cells.
                </li>
                <li>
                  Improves mental speed and is an effective way to improve
                  short-term memory
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center">
        <button
          onClick={() => setPlay(true)}
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

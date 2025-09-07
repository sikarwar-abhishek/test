"use client";

import { Check, X } from "lucide-react";
import HomePageHeader from "../common/HomePageHeader";

function PuzzleSolutionViewer({ puzzle, onBack }) {
  const puzzleDetail = puzzle.puzzleDetail || puzzle;
  console.log(puzzleDetail);
  const renderSolutionFeedback = () => {
    // If puzzle was submitted and correct
    if (puzzle.is_submitted && puzzle.correct) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-semibold font-monserrat text-[#2C9D00]">
              Correct
            </span>
          </div>

          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-2">
              Your Answer :
            </h3>
            <p className="text-gray-600 font-opensans">
              {puzzleDetail.user_answer || "No answer provided"}
            </p>
          </div>

          <p className="text-blue-500 font-medium font-poppins">
            You nailed it! Keep up the great work.
          </p>

          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-2">
              Solution
            </h3>
            <p className="text-gray-600 font-opensans">
              {puzzleDetail.correct_answer || "Solution not available"}
            </p>
          </div>
        </div>
      );
    }

    // If puzzle was submitted but incorrect
    if (puzzle.is_submitted && !puzzle.correct) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-semibold">Incorrect</span>
          </div>

          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-2">
              Your Answer :
            </h3>
            <p className="text-gray-600 font-opensans">
              {puzzleDetail.user_answer || "No answer provided"}
            </p>
          </div>

          <p className="text-blue-500 font-medium">Better Luck Next Time!</p>

          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-2">
              Solution
            </h3>
            <p className="text-gray-600 font-opensans">
              {puzzleDetail.correct_answer || "Solution not available"}
            </p>
          </div>
        </div>
      );
    }

    // If puzzle was not attempted - just show the solution
    return (
      <div className="space-y-4">
        <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
          <h3 className="font-medium font-poppins text-gray-900 mb-2">
            Solution :
          </h3>
          <p className="text-gray-600 font-opensans">
            {puzzleDetail.correct_answer || "Solution not available"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader
          text={puzzleDetail.title || puzzle.title || "Puzzle Solution"}
          backBtn
          onBack={onBack}
        />

        <div className="flex flex-col gap-4 overflow-auto no-scrollbar pb-4">
          {/* Puzzle Question */}
          <div className="flex flex-col border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg font-poppins items-center justify-center p-4">
            <p className="text-center self-start">Question: </p>
            <p className="self-start text-gray-600 font-opensans">
              {puzzleDetail.question ||
                puzzleDetail.description ||
                "Question not available"}
            </p>
          </div>

          {/* Solution Feedback */}
          {renderSolutionFeedback()}
        </div>
      </div>
    </div>
  );
}

export default PuzzleSolutionViewer;

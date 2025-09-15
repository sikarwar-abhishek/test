"use client";
import { Info, X, Star, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { submitPracticeSubjectiveAnswer } from "@/src/api/practice";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";

export default function PlayPracticeSubjective({
  currentPuzzle,
  onSubmitSuccess,
}) {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset submission state when puzzle changes
  useEffect(() => {
    setSubmissionResult(null);
    setIsSubmitted(false);
    setAnswer(""); // Also reset the answer input
  }, [currentPuzzle.puzzleId]);

  const submitMutation = useMutationHandler(
    ({ puzzleId, answerData }) =>
      submitPracticeSubjectiveAnswer(puzzleId, answerData),
    {
      onSuccess: (data) => {
       
        // Extract the puzzle data from the response
        const puzzleData =
          data.puzzles && data.puzzles.length > 0 ? data.puzzles[0] : null;
        setSubmissionResult(puzzleData);
        setIsSubmitted(true);
        // Don't call onSubmitSuccess immediately, let user see result first
      },
    }
  );

  const handleSubmit = () => {
    if (!answer.trim()) {
      alert("Please enter an answer before submitting.");
      return;
    }

    const answerData = {
      answer: answer.trim(),
    };

    submitMutation.mutate({ puzzleId: currentPuzzle.puzzleId, answerData });
  };

  const handleInfoClick = () => {
    setIsInstructionsOpen(true);
  };

  const handleCloseInstructions = () => {
    setIsInstructionsOpen(false);
  };

  // Instructions Popup Component
  const InstructionsPopup = () => {
    const { instruction, difficultyLevel } = currentPuzzle;
    const maxStars = 5;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleCloseInstructions}
      >
        <div
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold font-poppins text-black">
              Instructions
            </h2>
            <button
              onClick={handleCloseInstructions}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Difficulty Level */}
            <div className="text-center space-y-4">
              <div className="text-3xl font-semibold font-poppins text-blue-500">
                {difficultyLevel}
              </div>

              {/* Star Rating */}
              <div className="flex justify-center items-center gap-2">
                {[...Array(maxStars)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-6 h-6 ${
                      index < difficultyLevel
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>

              <h3 className="text-lg font-semibold font-poppins text-black">
                DIFFICULTY
              </h3>
            </div>

            {/* Instructions Section */}
            <div className="text-left space-y-4">
              <div>
                <h4 className="text-lg font-semibold font-monserrat text-black mb-3">
                  INSTRUCTIONS
                </h4>
                <div className="text-[#757575] text-sm font-opensans leading-relaxed">
                  {instruction}
                </div>
              </div>

              {/* Benefits Section */}
              <div>
                <h4 className="text-lg font-semibold font-monserrat text-black mb-3">
                  BENEFITS
                </h4>
                <ul className="space-y-3 text-[#757575] text-sm font-opensans list-disc pl-5">
                  <li>
                    Working on a puzzle reinforces connections between brain
                    cells.
                  </li>
                  <li>
                    Improves mental speed and is an effective way to improve
                    short-term memory.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleNext = () => {
    // Clear submission state before moving to next puzzle
    setSubmissionResult(null);
    setIsSubmitted(false);
    setAnswer(""); // Also reset the answer input
    onSubmitSuccess(submissionResult);
  };

  // Render solution feedback similar to past challenges
  const renderSolutionFeedback = () => {
    if (!isSubmitted || !submissionResult) return null;

    const { is_correct, puzzleDetail } = submissionResult;
    const user_answer = puzzleDetail?.user_answer;
    const correct_answer = puzzleDetail?.correct_answer;

    if (is_correct) {
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
              {user_answer || answer || "No answer provided"}
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
              {correct_answer || "Solution not available"}
            </p>
          </div>
        </div>
      );
    } else {
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
              {user_answer || answer || "No answer provided"}
            </p>
          </div>

          <p className="text-blue-500 font-medium">Better Luck Next Time!</p>

          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-2">
              Solution
            </h3>
            <p className="text-gray-600 font-opensans">
              {correct_answer || "Solution not available"}
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <button
            onClick={handleInfoClick}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Info fill="#75757580" stroke="white" className="cursor-pointer" />
          </button>
        </div>

        <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 p-6 font-poppins font-semibold">
          <span className="text-2xl underline mb-2 block">Question</span>
          <p className="text-2xl">{currentPuzzle.puzzleDetail.description}</p>
        </div>

        {!isSubmitted ? (
          <>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer"
              className="border w-full min-h-40 resize-none rounded-lg p-4 font-roboto"
            />

            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || !answer.trim()}
              className="py-2 px-16 sm:py-2 self-center sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent font-poppins font-bold flex items-center justify-center text-lg
                bg-blue-500 text-white transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </>
        ) : (
          <>
            {/* Show solution feedback */}
            {renderSolutionFeedback()}

            {/* Next button */}
            <button
              onClick={handleNext}
              className="py-2 px-16 sm:py-2 self-center sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent font-poppins font-bold flex items-center justify-center text-lg
                bg-blue-500 text-white transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
            >
              Next
            </button>
          </>
        )}
      </div>

      {/* Instructions Popup */}
      {isInstructionsOpen && <InstructionsPopup />}
    </div>
  );
}

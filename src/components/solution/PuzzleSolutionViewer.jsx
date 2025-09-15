"use client";

import { useState, useRef, useCallback } from "react";
import { Check, X, Info, Star } from "lucide-react";
import HomePageHeader from "../common/HomePageHeader";
import Icon from "../common/Icon";
import { puzzleFeedback } from "@/src/api/feedback";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function PuzzleSolutionViewer({ puzzle, onBack, challengeId, date }) {
  const puzzleDetail = puzzle.puzzleDetail || puzzle;
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const queryClient = useQueryClient();

  const initializeLikeState = () => {
    const feedback = puzzle.feedback || puzzleDetail.feedback;
    if (feedback === "like") return 1;
    if (feedback === "unlike") return -1;
    return 0;
  };

  const [like, setLike] = useState(initializeLikeState);
  const debounceTimeoutRef = useRef(null);
  const lastActionRef = useRef(null);

  const feedbackMutation = useMutationHandler(puzzleFeedback, {
    onSuccess: (data) => {
      // Invalidate pastChallengesDetails query to refresh data
      if (challengeId && date) {
        queryClient.invalidateQueries([
          "pastChallengeDetails",
          challengeId,
          date,
        ]);
      }
      toast.success("feedback submitted successfully.");
    },
    onError: (error) => {
      console.error("Error sending feedback:", error);
    },
  });

  const debouncedFeedbackCall = useCallback(
    (action) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        const feedbackData = {
          puzzle: puzzle.puzzleId || puzzleDetail.puzzleId,
          action: action,
        };

        feedbackMutation.mutate(feedbackData);
      }, 1000);
    },
    [puzzle.puzzleId, puzzleDetail.puzzleId, feedbackMutation]
  );

  const handleInfoClick = () => {
    setIsInstructionsOpen(true);
  };

  const handleCloseInstructions = () => {
    setIsInstructionsOpen(false);
  };

  function handleLikeOrDislike(value) {
    let newLikeState;
    let apiAction;

    // Update UI state immediately for smooth UX
    if (!like) {
      newLikeState = value;
      apiAction = value === 1 ? "like" : "unlike";
    } else {
      if (value === like) {
        newLikeState = 0;
        apiAction = "unlike";
      } else {
        newLikeState = value;
        apiAction = value === 1 ? "like" : "unlike";
      }
    }

    setLike(newLikeState);
    lastActionRef.current = apiAction;

    // Make debounced API call
    debouncedFeedbackCall(apiAction);
  }

  // Instructions Popup Component
  const InstructionsPopup = () => {
    const { instruction, difficultyLevel } = puzzle;
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
          {/* Puzzle Question with Icons */}
          <div className="flex flex-col gap-4">
            {/* Info and Like/Dislike Icons */}
            <div className="flex justify-between">
              <button
                onClick={handleInfoClick}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Info
                  fill="#75757580"
                  stroke="white"
                  className="cursor-pointer"
                />
              </button>
              <div className="flex gap-2">
                <div onClick={() => handleLikeOrDislike(1)}>
                  <Icon
                    name={"like"}
                    className={`w-8 h-8 cursor-pointer ${
                      like === 1 ? "text-[#4676FA]" : "text-[#A3A3A3]"
                    }`}
                  />
                </div>
                <div onClick={() => handleLikeOrDislike(-1)}>
                  <Icon
                    name={"dislike"}
                    className={`w-8 h-8 cursor-pointer ${
                      like === -1 ? "text-[#4676FA]" : "text-[#A3A3A3]"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Question Container */}
            {puzzle.is_submitted ? (
              // Submitted puzzle styling - matches PlaySubjectiveChallenge.jsx
              <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 p-6 font-poppins font-semibold">
                <span className="text-2xl underline mb-2 block">Question</span>
                <p className="text-2xl">
                  {puzzleDetail.question ||
                    puzzleDetail.description ||
                    "Question not available"}
                </p>
              </div>
            ) : (
              // Non-submitted puzzle styling - original styling
              <div className="flex flex-col border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg font-poppins items-center justify-center p-4">
                <p className="text-center self-start">Question: </p>
                <p className="self-start text-gray-600 font-opensans">
                  {puzzleDetail.question ||
                    puzzleDetail.description ||
                    "Question not available"}
                </p>
              </div>
            )}
          </div>

          {/* Solution Feedback */}
          {renderSolutionFeedback()}
        </div>
      </div>

      {/* Instructions Popup */}
      {isInstructionsOpen && <InstructionsPopup />}
    </div>
  );
}

export default PuzzleSolutionViewer;

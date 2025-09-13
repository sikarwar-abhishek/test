"use client";

import { useState, useRef, useCallback } from "react";
import { Check, X, Info, Star } from "lucide-react";
import Image from "next/image";
import HomePageHeader from "../common/HomePageHeader";
import Icon from "../common/Icon";
import { puzzleFeedback } from "@/src/api/feedback";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { useQueryClient } from "@tanstack/react-query";
import Markdown from "react-markdown";

function ChessSolutionViewer({ puzzle, onBack, challengeId, date }) {
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

  console.log("Chess puzzle data:", puzzle);
  console.log(
    "Chess puzzle feedback:",
    puzzle.feedback || puzzleDetail.feedback
  );

  const feedbackMutation = useMutationHandler(puzzleFeedback, {
    onSuccess: (data) => {
      console.log("Feedback sent successfully:", data);

      if (challengeId && date) {
        queryClient.invalidateQueries([
          "pastChallengeDetails",
          challengeId,
          date,
        ]);
      }
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

        console.log("Sending feedback:", feedbackData);
        feedbackMutation.mutate(feedbackData);
      }, 1000);
    },
    [puzzle.puzzleId, puzzleDetail.puzzleId, feedbackMutation]
  );

  const handleLikeOrDislike = useCallback(
    (value) => {
      let newLikeState;
      let apiAction;

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

      debouncedFeedbackCall(apiAction);
    },
    [like, debouncedFeedbackCall]
  );
  const handleInfoClick = () => {
    setIsInstructionsOpen(true);
  };

  const handleCloseInstructions = () => {
    setIsInstructionsOpen(false);
  };

  const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const mediaUrl = puzzleDetail.media_url || puzzle.media_url;

  const InstructionsPopup = () => {
    const { instruction, difficultyLevel } = puzzleDetail;
    const processEscapeSequences = (text) => {
      if (!text || typeof text !== "string") {
        return "No instructions available";
      }
      return text
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\")
        .replace(/^"/, "")
        .replace(/"$/, "");
    };

    const processedInstructions = processEscapeSequences(instruction);
    const maxStars = 5;
    if (!puzzle) {
      return <div>No puzzle data available</div>;
    }

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
                {difficultyLevel || puzzle.difficultyLevel || 2}
              </div>

              {/* Star Rating */}
              <div className="flex justify-center items-center gap-2">
                {[...Array(maxStars)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-6 h-6 ${
                      index < (difficultyLevel || puzzle.difficultyLevel || 2)
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
                  <Markdown>{processedInstructions}</Markdown>
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

  // const renderUserMoves = () => {
  //   const userAnswer =
  //     puzzleDetail.user_answer || puzzle.user_answer || puzzleDetail.userAnswer;
  //   if (!userAnswer || !Array.isArray(userAnswer)) {
  //     return <p className="text-gray-600 font-opensans">No moves provided</p>;
  //   }

  //   return (
  //     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  //       {userAnswer.map((move, index) => (
  //         <div
  //           key={index}
  //           className="bg-green-100 border border-green-300 rounded-lg p-3 text-center"
  //         >
  //           <span className="font-semibold text-green-800">{move}</span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // const renderCorrectMoves = () => {
  //   // Try different possible locations for correct answer
  //   const correctAnswer =
  //     puzzleDetail.correct_answer ||
  //     puzzle.correct_answer ||
  //     puzzleDetail.correctAnswer;
  //   if (!correctAnswer || !Array.isArray(correctAnswer)) {
  //     return (
  //       <p className="text-gray-600 font-opensans">Solution not available</p>
  //     );
  //   }

  //   return (
  //     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  //       {correctAnswer.map((move, index) => (
  //         <div
  //           key={index}
  //           className="bg-green-100 border border-green-300 rounded-lg p-2 text-center"
  //         >
  //           <span className="font-semibold text-green-800">{move}</span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const renderUserMoves = () => {
    const userAnswer =
      puzzleDetail.user_answer || puzzle.user_answer || puzzleDetail.userAnswer;
    const correctAnswer =
      puzzleDetail.correct_answer ||
      puzzle.correct_answer ||
      puzzleDetail.correctAnswer;

    if (!userAnswer || !Array.isArray(userAnswer)) {
      return <p className="text-gray-600 font-opensans">No moves provided</p>;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {userAnswer.map((move, index) => {
          // Check if this move matches the correct answer at the same index
          const isCorrect = correctAnswer && correctAnswer[index] == move;

          return (
            <div
              key={index}
              className={`border rounded-lg p-3 text-center ${
                isCorrect
                  ? "bg-green-100 border-green-300"
                  : "bg-[#FF383C66] border-red-300"
              }`}
            >
              <span
                className={`font-poppins ${
                  isCorrect ? "text-green-800" : "text-red-800"
                }`}
              >
                {move}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCorrectMoves = () => {
    // Try different possible locations for correct answer
    const correctAnswer =
      puzzleDetail.correct_answer ||
      puzzle.correct_answer ||
      puzzleDetail.correctAnswer;
    if (!correctAnswer || !Array.isArray(correctAnswer)) {
      return (
        <p className="text-gray-600 font-opensans">Solution not available</p>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {correctAnswer.map((move, index) => (
          <div
            key={index}
            className="bg-green-100 border border-green-300 rounded-lg p-3 text-center"
          >
            <span className="font-poppins">{move}</span>
          </div>
        ))}
      </div>
    );
  };
  const renderSolutionFeedback = () => {
    // If puzzle was submitted and correct
    if (puzzle.is_submitted && (puzzle.correct || puzzle.is_correct)) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-semibold font-monserrat text-[#2C9D00]">
              Correct
            </span>
          </div>

          <p className="text-blue-500 font-medium font-poppins">
            You nailed it! Keep up the great work.
          </p>

          {/* User's Solution */}
          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-4">
              Your Solution:
            </h3>
            {renderUserMoves()}
          </div>
        </div>
      );
    }

    // If puzzle was submitted but incorrect
    if (puzzle.is_submitted && !(puzzle.correct || puzzle.is_correct)) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-semibold">Incorrect</span>
          </div>

          <p className="text-blue-500 font-medium">Better Luck Next Time!</p>

          {/* User's Solution */}
          <div className="rounded-lg">{renderUserMoves()}</div>

          {/* Correct Solution */}
          <div className="rounded-lg">
            <h3 className="font-medium font-poppins text-gray-900 mb-4">
              Solution:
            </h3>
            {renderCorrectMoves()}
          </div>
        </div>
      );
    }

    // If puzzle was not attempted - just show the correct solution
    return (
      <div className="space-y-6">
        <div className="rounded-lg">
          <h3 className="font-medium font-poppins text-gray-900 mb-4">
            Solution:
          </h3>
          {renderCorrectMoves()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader
          text={puzzleDetail.title || puzzle.title || "Chess Solution"}
          backBtn
          onBack={onBack}
        />

        <div className="overflow-auto no-scrollbar">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <button
                onClick={handleInfoClick}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open instructions"
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

            {/* Top prompt */}
            <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 p-6 font-poppins font-semibold">
              <p className="text-2xl">
                {puzzleDetail.description ||
                  "Enter the moves in chess notation to checkmate the opponent."}
              </p>
            </div>

            {/* Chess image with rank/file labels */}
            {mediaUrl && (
              <div className="flex w-full justify-center p-6">
                <div className="relative w-full max-w-xs aspect-square">
                  <Image
                    src={mediaUrl}
                    alt={puzzleDetail.title || "Chess puzzle"}
                    fill
                    sizes="(max-width: 768px) 90vw, 500px"
                    className="object-contain rounded-lg"
                    priority
                  />

                  {/* Files (A-H) - Top */}
                  <div className="pointer-events-none absolute -top-6 left-0 right-0 grid grid-cols-8 text-center text-gray-500 text-sm font-semibold tracking-wider">
                    {files.map((f) => (
                      <span key={`ft-${f}`}>{f}</span>
                    ))}
                  </div>

                  {/* Files (A-H) - Bottom */}
                  <div className="pointer-events-none absolute -bottom-6 left-0 right-0 grid grid-cols-8 text-center text-gray-500 text-sm font-semibold tracking-wider">
                    {files.map((f) => (
                      <span key={`fb-${f}`}>{f}</span>
                    ))}
                  </div>

                  {/* Ranks (8-1) - Left */}
                  <div className="pointer-events-none absolute -left-6 top-0 bottom-0 grid grid-rows-8 text-gray-500 text-sm font-semibold">
                    {ranks.map((r) => (
                      <div
                        key={`rl-${r}`}
                        className="flex items-center justify-center"
                      >
                        {r}
                      </div>
                    ))}
                  </div>

                  {/* Ranks (8-1) - Right */}
                  <div className="pointer-events-none absolute -right-6 top-0 bottom-0 grid grid-rows-8 text-gray-500 text-sm font-semibold">
                    {ranks.map((r) => (
                      <div
                        key={`rr-${r}`}
                        className="flex items-center justify-center"
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Solution Feedback */}
            <div className="shadow-sm rounded-lg p-6">
              {renderSolutionFeedback()}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Popup */}
      {isInstructionsOpen && <InstructionsPopup />}
    </div>
  );
}

export default ChessSolutionViewer;

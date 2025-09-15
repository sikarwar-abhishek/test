"use client";
import { Info, X, Star } from "lucide-react";
import Icon from "../../common/Icon";
import { useState, useRef, useCallback } from "react";
import { Modal } from "../../common/Modal";
import { useRouter } from "next/navigation";
import { submitSubjectiveAnswer } from "@/src/api/challenges";
import { puzzleFeedback } from "@/src/api/feedback";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function PlaySubjectiveChallenge({
  challengeId,
  currentPuzzle,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Initialize like state based on existing feedback
  const initializeLikeState = () => {
    const feedback =
      currentPuzzle.feedback || currentPuzzle.puzzleDetail?.feedback;
    if (feedback === "like") return 1;
    if (feedback === "unlike") return -1;
    return 0;
  };

  const [like, setLike] = useState(initializeLikeState);
  const debounceTimeoutRef = useRef(null);
  const lastActionRef = useRef(null);
  const [answer, setAnswer] = useState("");

  const submitMutation = useMutationHandler(
    ({ puzzleId, answerData }) => submitSubjectiveAnswer(puzzleId, answerData),
    {
      onSuccess: (data) => {
        setIsModalOpen(true);
      },
    }
  );

  // Mutation for sending feedback to API
  const feedbackMutation = useMutationHandler(puzzleFeedback, {
    onSuccess: (data) => {
      // Invalidate challengesList query to refresh data
      queryClient.invalidateQueries(["challengesList", challengeId]);
      toast.success("feedback submitted successfully.");
    },
    onError: (error) => {
      console.error("Error sending feedback:", error);
    },
  });

  // Debounced API call function
  const debouncedFeedbackCall = useCallback(
    (action) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        const feedbackData = {
          puzzle: currentPuzzle.puzzleId,
          action: action,
        };
        feedbackMutation.mutate(feedbackData);
      }, 1000); // 1 second debounce
    },
    [currentPuzzle.puzzleId, feedbackMutation]
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

  function handleLikeOrDislike(value) {
    let newLikeValue;
    let action;

    if (!like) {
      newLikeValue = value;
      action = value === 1 ? "like" : "unlike";
    } else {
      if (value === like) {
        newLikeValue = 0;
        action = "neutral";
      } else {
        newLikeValue = value;
        action = value === 1 ? "like" : "unlike";
      }
    }

    setLike(newLikeValue);
    lastActionRef.current = action;

    // Send feedback to API with debounce
    debouncedFeedbackCall(action);
  }

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

        <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 p-4 sm:p-6 font-poppins font-semibold">
          <span className="sm:text-2xl underline mb-2 block">Question</span>
          <p className="sm:text-2xl">
            {currentPuzzle.puzzleDetail.description}
          </p>
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer"
          className="border w-full min-h-40 resize-none rounded-lg p-4 sm:p-6 font-roboto"
        />
        {/* </div> */}
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
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          router.replace(`/challenges/${challengeId}`);
          setIsModalOpen(false);
          queryClient.invalidateQueries(["challengesList", challengeId]);
        }}
      />

      {/* Instructions Popup */}
      {isInstructionsOpen && <InstructionsPopup />}
    </div>
  );
}

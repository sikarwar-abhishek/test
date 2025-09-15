"use client";
import { Info, X, Star } from "lucide-react";
import Image from "next/image";
import Icon from "../../common/Icon";
import { useState, useRef, useCallback, useMemo } from "react";
import { Modal } from "../../common/Modal";
import { useRouter } from "next/navigation";
import { submitChessAnswer } from "@/src/api/challenges";
import { puzzleFeedback } from "@/src/api/feedback";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { useQueryClient } from "@tanstack/react-query";
import Markdown from "react-markdown";
import { toast } from "react-toastify";

function PlayChessChallenge({ challengeId, currentPuzzle }) {
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

  // Steps count and regex from puzzle detail
  const stepsCount = currentPuzzle?.puzzleDetail?.number_of_steps || 4;
  const inputRegexString =
    currentPuzzle?.puzzleDetail?.input_regex ||
    "^(O-O(-O)?|[KQRBN]?[a-h1-8]?x?[a-h][1-8](=[QRBN])?[+#]?|[a-h][1-8](=[QRBN])?[+#]?)$";
  const inputRegex = useMemo(
    () => new RegExp(inputRegexString),
    [inputRegexString]
  );

  const [moves, setMoves] = useState(() =>
    Array.from({ length: stepsCount }, () => "")
  );

  const submitMutation = useMutationHandler(
    ({ puzzleId, answerData }) => submitChessAnswer(puzzleId, answerData),
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
    const trimmedMoves = moves.map((m) => m.trim());

    if (trimmedMoves.some((m) => !m)) {
      alert("Please fill all the steps before submitting.");
      return;
    }

    const invalidIndexes = trimmedMoves
      .map((m, i) => ({ i, valid: inputRegex.test(m) }))
      .filter((x) => !x.valid)
      .map((x) => x.i + 1);

    if (invalidIndexes.length > 0) {
      alert(`Invalid notation at step(s): ${invalidIndexes.join(", ")}`);
      return;
    }

    const answerData = {
      moves: trimmedMoves,
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

  const handleMoveChange = (index, value) => {
    // Normalize whitespace
    const v = value.replace(/\s+/g, "");
    const newMoves = [...moves];
    newMoves[index] = v;
    setMoves(newMoves);
  };

  const isMoveValid = (value) => {
    if (!value) return true; // empty is handled separately
    return inputRegex.test(value);
  };

  // Instructions Popup Component
  const InstructionsPopup = () => {
    const { instruction, difficultyLevel } = currentPuzzle;
    const processEscapeSequences = (text) => {
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

  const allFilled = moves.every((m) => m.trim().length > 0);
  const allValid = moves.every((m) => isMoveValid(m.trim()));

  // Derive heading text from description, otherwise fallback to instruction
  const headingText =
    currentPuzzle?.puzzleDetail?.description ||
    currentPuzzle?.instruction ||
    "";
  const mediaUrl = currentPuzzle?.puzzleDetail?.media_url || "";
  const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  return (
    <div className="overflow-auto no-scrollbar">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <button
            onClick={handleInfoClick}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open instructions"
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

        {/* Top prompt */}
        <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 p-6 font-poppins font-semibold">
          {/* <span className="text-2xl underline mb-2 block">Question</span> */}
          <p className="text-2xl">{headingText}</p>
        </div>

        {/* Chess image with rank/file labels */}
        {mediaUrl ? (
          <div className="flex w-full justify-center p-6">
            <div className="relative w-full max-w-xs aspect-square">
              <Image
                src={mediaUrl}
                alt={currentPuzzle?.title || "Chess puzzle"}
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
        ) : null}

        {/* Steps inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {moves.map((move, idx) => {
            const value = move;
            const valid = isMoveValid(value.trim());
            return (
              <div key={idx} className="flex flex-col">
                <input
                  value={value}
                  onChange={(e) => handleMoveChange(idx, e.target.value)}
                  placeholder={
                    idx === 0 ? `Step ${idx + 1} (eg., e4)` : `Step ${idx + 1}`
                  }
                  className={`border w-full rounded-lg p-4 font-roboto outline-none ${
                    value && !valid
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {value && !valid && (
                  <span className="text-xs text-red-600 mt-1">
                    Invalid notation. Example: e4, Nf3, Qxe5, O-O, Qh7#
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitMutation.isPending || !allFilled || !allValid}
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

export default PlayChessChallenge;

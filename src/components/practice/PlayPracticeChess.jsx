import Markdown from "react-markdown";
import Image from "next/image";
import { Info, X, Star, Check } from "lucide-react";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { submitPracticeChessAnswer } from "@/src/api/practice";
import Icon from "../common/Icon";
import { useState, useMemo, useEffect } from "react";

function PlayPracticeChess({ currentPuzzle, onSubmitSuccess }) {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Steps count and regex from puzzle detail
  const stepsCount =
    currentPuzzle?.puzzleDetail?.number_of_steps ||
    currentPuzzle?.number_of_steps ||
    4;
  const inputRegexString =
    currentPuzzle?.puzzleDetail?.input_regex ||
    currentPuzzle?.input_regex ||
    "^(O-O(-O)?|[KQRBN]?[a-h1-8]?x?[a-h][1-8](=[QRBN])?[+#]?|[a-h][1-8](=[QRBN])?[+#]?)$";
  const inputRegex = useMemo(
    () => new RegExp(inputRegexString),
    [inputRegexString]
  );

  const [moves, setMoves] = useState(() =>
    Array.from({ length: stepsCount }, () => "")
  );

  // Reset submission state when puzzle changes
  useEffect(() => {
    setSubmissionResult(null);
    setIsSubmitted(false);
    setMoves(Array.from({ length: stepsCount }, () => ""));
  }, [currentPuzzle.puzzleId, stepsCount]);

  const submitMutation = useMutationHandler(
    ({ puzzleId, answerData }) =>
      submitPracticeChessAnswer(puzzleId, answerData),
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

    submitMutation.mutate({
      puzzleId: currentPuzzle.puzzleId || currentPuzzle.id,
      answerData,
    });
  };

  const handleInfoClick = () => {
    setIsInstructionsOpen(true);
  };

  const handleCloseInstructions = () => {
    setIsInstructionsOpen(false);
  };

  const handleNext = () => {
    // Reset state and call parent success handler
    setSubmissionResult(null);
    setIsSubmitted(false);
    setMoves(Array.from({ length: stepsCount }, () => ""));
    onSubmitSuccess(submissionResult);
  };

  // Render solution feedback similar to past challenges
  const renderSolutionFeedback = () => {
    if (!isSubmitted || !submissionResult) return null;

    const { is_correct, puzzleDetail } = submissionResult;
    const user_answer = JSON.parse(puzzleDetail?.user_answer);
    const correct_answer = puzzleDetail?.solution_moves;

    const renderUserMoves = () => {
      if (!user_answer || !Array.isArray(user_answer)) {
        return <p className="text-gray-600 font-opensans">No moves provided</p>;
      }

      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {user_answer.map((move, index) => (
            <div
              key={index}
              className="bg-green-100 border border-green-300 rounded-lg p-3 text-center"
            >
              <span className="font-semibold text-green-800">{move}</span>
            </div>
          ))}
        </div>
      );
    };

    const renderCorrectMoves = () => {
      if (!correct_answer || !Array.isArray(correct_answer)) {
        return <p className="text-gray-600 font-opensans">Solution not available</p>;
      }

      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {correct_answer.map((move, index) => (
            <div
              key={index}
              className="bg-green-100 border border-green-300 rounded-lg p-3 text-center"
            >
              <span className="font-semibold text-green-800">{move}</span>
            </div>
          ))}
        </div>
      );
    };

    if (is_correct) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-semibold font-monserrat text-[#2C9D00]">
              Correct
            </span>
          </div>

          <p className="text-blue-500 font-medium font-poppins">
            You nailed it! Keep up the great work.
          </p>

          <div className="rounded-lg">
            <h3 className="font-medium font-poppins text-gray-900 mb-4">
              Your Answer:
            </h3>
            {renderUserMoves()}
          </div>

          {/* <div className="rounded-lg">
            <h3 className="font-medium font-poppins text-gray-900 mb-4">
              Solution:
            </h3>
            {renderCorrectMoves()}
          </div> */}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-semibold">Incorrect</span>
          </div>

          <p className="text-blue-500 font-medium">
            Better Luck Next Time!
          </p>

          <div className="rounded-lg">
            <h3 className="font-medium font-poppins text-gray-900 mb-4">
              Your Answer:
            </h3>
            {renderUserMoves()}
          </div>

          <div className="rounded-lg">
            <h3 className="font-medium font-poppins text-gray-900 mb-4">
              Correct Solution:
            </h3>
            {renderCorrectMoves()}
          </div>
        </div>
      );
    }
  };

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
    const instruction = currentPuzzle?.puzzleDetail?.instruction;
    const difficultyLevel =
      currentPuzzle?.difficultyLevel ||
      currentPuzzle?.puzzleDetail?.difficultyLevel ||
      2;

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
    currentPuzzle?.description ||
    currentPuzzle?.instruction ||
    "";
  const mediaUrl =
    currentPuzzle?.puzzleDetail?.media_url || currentPuzzle?.media_url || "";
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
        </div>

        {/* Top prompt */}
        <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 p-6 font-poppins font-semibold">
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

        {!isSubmitted ? (
          <>
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

export default PlayPracticeChess;

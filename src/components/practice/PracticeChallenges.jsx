"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import HomePageHeader from "../common/HomePageHeader";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getPracticePuzzlesDaily } from "@/src/api/practice";

function PracticeChallenges() {
  const [currentPuzzle, setCurrentPuzzle] = useState(1);
  const [totalPuzzles] = useState(5);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerState, setAnswerState] = useState("initial");
  const [submittedAnswer, setSubmittedAnswer] = useState("");

  const { data, isLoading, error } = useQueryHandler(getPracticePuzzlesDaily, {
    queryKey: ["practice_puzzles_daily"],
  });

  if (isLoading) return <p>Loading..</p>;
  if (error) return <p> Error</p>;
  const { total_puzzles } = data?.data;
  // Mock puzzle data
  const puzzleData = {
    question: "Puzzle from backend",
    correctAnswer: "correct answer",
    solution:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisl eu consectetur convallis, nisl nunc fermentum risus, at commodo lorem lacus non nulla. Morbi faucibus, nisl nec vehicula pretium, metus augue sagittis est, at laoreet nulla sem at enim. Cras ac justo in nibh facilisis sodales. Sed ac sapien et nunc tempor varius.",
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    setSubmittedAnswer(userAnswer);

    const isCorrect =
      userAnswer.toLowerCase().trim() ===
      puzzleData.correctAnswer.toLowerCase();
    setAnswerState(isCorrect ? "correct" : "incorrect");
  };

  const handleNext = () => {
    if (currentPuzzle < totalPuzzles) {
      setCurrentPuzzle(currentPuzzle + 1);
      setUserAnswer("");
      setSubmittedAnswer("");
      setAnswerState("initial");
    } 
  };

  const renderFeedback = () => {
    if (answerState === "correct") {
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
            <p className="text-gray-600 font-opensans">{submittedAnswer}</p>
          </div>

          <p className="text-blue-500 font-medium font-poppins">
            You nailed it! Keep up the great work.
          </p>
        </div>
      );
    }

    if (answerState === "incorrect") {
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
            <p className="text-gray-600 font-opensans">{submittedAnswer}</p>
          </div>

          <p className="text-blue-500 font-medium">Better Luck Next Time!</p>

          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-2">
              Solution
            </h3>
            <p className="text-gray-600 font-opensans">{puzzleData.solution}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader text={"Practice Section"} backBtn />

        <div className="flex flex-col gap-4 overflow-auto no-scrollbar pb-4">
          {/* Progress indicator */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">
              {currentPuzzle}/{total_puzzles}
            </div>
          </div>

          {/* Puzzle */}
          <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 min-h-[40dvh] font-poppins font-semibold flex items-center justify-center p-8">
            <p className="text-2xl text-center">{puzzleData.question}</p>
          </div>

          {/* answer */}
          {answerState === "initial" ? (
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer"
              className="border w-full shadow-sm min-h-32 resize-none rounded-lg p-4 font-opensans"
            />
          ) : (
            renderFeedback()
          )}

          {answerState === "initial" ? (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="py-2 px-16 sm:py-2 self-center sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-poppins font-bold flex items-center justify-center text-lg
                transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="py-2 px-16 sm:py-2 self-center sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-poppins font-bold flex items-center justify-center text-lg
                transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
            >
              {currentPuzzle < totalPuzzles ? "Next" : "Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PracticeChallenges;

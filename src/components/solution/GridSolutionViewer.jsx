"use client";

import { useState, useRef, useCallback } from "react";
import { Check, X, Info, Star } from "lucide-react";
import HomePageHeader from "../common/HomePageHeader";
import Icon from "../common/Icon";
import { puzzleFeedback } from "@/src/api/feedback";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
function GridSolutionViewer({ puzzle, onBack, challengeId, date }) {
  const puzzleDetail = puzzle.puzzleDetail || puzzle;
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Initialize like state based on existing feedback
  const initializeLikeState = () => {
    const feedback = puzzle.feedback || puzzleDetail.feedback;
    if (feedback === "like") return 1;
    if (feedback === "unlike") return -1;
    return 0;
  };

  const [like, setLike] = useState(initializeLikeState);
  const debounceTimeoutRef = useRef(null);
  const lastActionRef = useRef(null);

  // Mutation for sending feedback to API
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
      toast.success("Feedback submitted successfully.");
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
          puzzle: puzzle.puzzleId || puzzleDetail.puzzleId,
          action: action,
        };

        feedbackMutation.mutate(feedbackData);
      }, 1000); // 1 second debounce
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
    const { instruction, description, difficultyLevel } = puzzle;
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
                    className={`w-6 h-6 ${index < difficultyLevel
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
                  DESCRIPTION
                </h4>
                <div className="text-[#757575] text-sm font-opensans leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}></span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold font-monserrat text-black mb-3">
                  INSTRUCTIONS
                </h4>
                <div className="text-[#757575] text-sm font-opensans leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(instruction) }}></span>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    );
  };

  // Parse grid size from puzzleDetail
  const getGridSize = () => {
    const gridSizeStr = puzzleDetail.grid_size || "9,9";
    const [rows, cols] = gridSizeStr.split(",").map(num => parseInt(num.trim()));
    return { rows, cols };
  };

  const { rows: gridRows, cols: gridCols } = getGridSize();

  // Get cage information
  const cageSuperscripts = puzzleDetail.cage_superscripts || [];
  const cageBorders = puzzleDetail.cage_borders || {};

  // Get cage superscript for a cell
  const getCageSuperscript = (row, col) => {
    const cellKey = `${row}_${col}`;
    const superscript = cageSuperscripts.find((cage) => cage.cell === cellKey);
    return superscript ? superscript.text : null;
  };

  // Get cage borders for a cell
  const getCageBorders = (row, col) => {
    const cellKey = `${row}${col}`;
    return cageBorders[cellKey] || [];
  };

  // Parse grid data - assuming it's stored as string or array
  const parseGrid = (gridData) => {
    if (!gridData)
      return Array(gridRows)
        .fill()
        .map(() => Array(gridCols).fill(""));

    if (typeof gridData === "string") {
      // If it's a string, convert to 2D array based on grid size
      const chars = gridData.split("");
      const grid = [];
      for (let i = 0; i < gridRows; i++) {
        grid.push(chars.slice(i * gridCols, (i + 1) * gridCols));
      }
      return grid;
    }

    if (Array.isArray(gridData)) {
      // If it's already a 2D array
      return gridData;
    }

    return Array(gridRows)
      .fill()
      .map(() => Array(gridCols).fill(""));
  };

  const userGrid = parseGrid(puzzleDetail.user_answer_grid);
  const correctGrid = parseGrid(puzzleDetail.solution_grid);
  const initialGrid = parseGrid(puzzleDetail.initial_grid);

  // Check if a cell was initially filled (part of the puzzle)
  const isInitialCell = (row, col) => {
    return (
      initialGrid[row] &&
      initialGrid[row][col] &&
      initialGrid[row][col] !== "" &&
      initialGrid[row][col] !== "0"
    );
  };

  // Check if user's answer matches correct answer for a cell
  const isCellCorrect = (row, col) => {
    if (!userGrid[row] || !correctGrid[row]) return false;
    return userGrid[row][col] == correctGrid[row][col] || userGrid[row][col] === "";
  };

  // Get cell styling based on correctness and initial state
  const getCellStyle = (row, col, isUserGrid = true) => {
    const borders = getCageBorders(row, col);
    let borderStyles = "border border-gray-400";

    // Apply cage borders - use thick black borders for cage boundaries
    if (borders.includes("U")) borderStyles += " border-t-2 border-t-black";
    if (borders.includes("B")) borderStyles += " border-b-2 border-b-black";
    if (borders.includes("L")) borderStyles += " border-l-2 border-l-black";
    if (borders.includes("R")) borderStyles += " border-r-2 border-r-black";

    // Responsive cell sizing
    const sizeClasses = "w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12";
    const textClasses = "text-sm sm:text-base md:text-lg lg:text-xl";

    const baseStyle = `${sizeClasses} ${borderStyles} flex items-center justify-center ${textClasses} font-semibold relative`;

    if (isInitialCell(row, col)) {
      return `${baseStyle} bg-gray-100 text-gray-800`; // Initial puzzle cells
    }

    if (isUserGrid && puzzle.is_submitted) {
      if (isCellCorrect(row, col)) {
        return `${baseStyle}`; // Correct user input
      } else {
        return `${baseStyle} bg-red-400 text-black`; // Incorrect user input
      }
    }

    return `${baseStyle} bg-white text-gray-800`; // Default or correct solution
  };


  // Render a Sudoku grid with dynamic size
  const renderGrid = (grid, title, isUserGrid = false) => (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold font-poppins text-center mb-4">
        {title}
      </h3>
      <div className="flex justify-center">
        <div className="border-2 border-black">
          {Array.from({ length: gridRows }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: gridCols }, (_, col) => {
                const value = grid[row] && grid[row][col] ? grid[row][col] : "";
                const superscript = getCageSuperscript(row, col);

                return (
                  <div
                    key={col}
                    className={getCellStyle(row, col, isUserGrid)}
                  >
                    {superscript && (
                      <div className="absolute top-0.5 left-0.5 font-poppins text-xs sm:text-[13px] text-blue-600 font-bold leading-none">
                        {superscript}
                      </div>
                    )}
                    <span>{value === "0" ? "" : value}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSolutionFeedback = () => {
    // If puzzle was submitted and correct
    if (puzzle.is_submitted && puzzle.correct) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 justify-center">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-semibold font-monserrat text-[#2C9D00]">
              Correct Solution!
            </span>
          </div>

          <p className="text-blue-500 font-medium font-poppins text-center">
            You nailed it! Keep up the great work.
          </p>

          {/* User's Solution Grid */}
          {renderGrid(userGrid, "Your Solution", true)}
        </div>
      );
    }

    // If puzzle was submitted but incorrect
    if (puzzle.is_submitted && !puzzle.correct) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 justify-center">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-semibold">
              Incorrect Solution
            </span>
          </div>

          <p className="text-blue-500 font-medium text-center">
            Better Luck Next Time!
          </p>

          {/* User's Solution Grid */}
          {renderGrid(userGrid, "Your Solution", true)}

          {/* Correct Solution Grid */}
          {renderGrid(correctGrid, "Correct Solution", false)}
        </div>
      );
    }

    // If puzzle was not attempted - just show the correct solution
    return (
      <div className="space-y-6">
        {/* <div className="flex items-center gap-2 justify-center">
          <span className="text-orange-500 font-semibold">Not Attempted</span>
        </div> */}

        {/* Correct Solution Grid */}
        {renderGrid(correctGrid, "Solution", false)}
      </div>
    );
  };

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-8 bg-background">
        <HomePageHeader
          text={puzzleDetail.title || puzzle.title || "Sudoku Solution"}
          backBtn
          onBack={onBack}
        />

        <div className="flex flex-col gap-6 overflow-auto no-scrollbar pb-4">
          {/* Initial Puzzle Grid with Icons */}
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
                <div onClick={() => {
                  if (like === 1) return;
                  else handleLikeOrDislike(1)
                }}>
                  <Icon
                    name={"like"}
                    className={`w-8 h-8 cursor-pointer ${like === 1 ? "text-[#4676FA]" : "text-[#A3A3A3]"
                      }`}
                  />
                </div>
                <div onClick={() => {
                  if (like === -1) return;
                  else handleLikeOrDislike(-1)
                }}>
                  <Icon
                    name={"dislike"}
                    className={`w-8 h-8 cursor-pointer ${like === -1 ? "text-[#4676FA]" : "text-[#A3A3A3]"
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Puzzle Grid Container */}
            <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 p-6">
              <h2 className="text-xl font-semibold font-poppins text-center mb-4">
                Initial Puzzle
              </h2>
              {renderGrid(initialGrid, "", false)}
            </div>
          </div>

          {/* Solution Feedback */}
          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-6">
            {renderSolutionFeedback()}
          </div>
        </div>
      </div>

      {/* Instructions Popup */}
      {isInstructionsOpen && <InstructionsPopup />}
    </div>
  );
}

export default GridSolutionViewer;

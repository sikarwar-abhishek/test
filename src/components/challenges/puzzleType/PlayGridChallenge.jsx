"use client";
import { Info, X, Star } from "lucide-react";
import Icon from "../../common/Icon";
import { useState, useRef, useCallback } from "react";
import { Modal } from "../../common/Modal";
import { useRouter } from "next/navigation";
import { submitGridAnswer } from "@/src/api/challenges";
import { puzzleFeedback } from "@/src/api/feedback";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { useQueryClient } from "@tanstack/react-query";

export default function PlayGridChallenge({ challengeId, currentPuzzle }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  // Initialize like state based on existing feedback
  const initializeLikeState = () => {
    const feedback =
      currentPuzzle.feedback || currentPuzzle.puzzleDetail?.feedback;
    console.log("Grid puzzle feedback:", feedback);
    console.log("Current puzzle data:", currentPuzzle);
    if (feedback === "like") return 1;
    if (feedback === "unlike") return -1;
    return 0;
  };

  const [like, setLike] = useState(initializeLikeState);
  console.log("Grid initial like state:", like);
  const debounceTimeoutRef = useRef(null);
  const lastActionRef = useRef(null);
  const [grid, setGrid] = useState(() => {
    // Initialize grid from puzzle data - for Killer Sudoku, initial_grid is already a 2D array
    const puzzleDetail = currentPuzzle.puzzleDetail;
    if (puzzleDetail.initial_grid && Array.isArray(puzzleDetail.initial_grid)) {
      return puzzleDetail.initial_grid.map((row) => [...row]);
    }
    return Array(9)
      .fill()
      .map(() => Array(9).fill(""));
  });

  // Get cage information
  const cageSuperscripts = currentPuzzle.puzzleDetail.cage_superscripts || [];
  const cageBorders = currentPuzzle.puzzleDetail.cage_borders || {};
  const allowedInputRegex = new RegExp(
    currentPuzzle.puzzleDetail.allowed_input_regex || "^[1-9]$"
  );

  // Parse grid data - same logic as in GridSolutionViewer
  function parseGrid(gridData) {
    if (!gridData)
      return Array(9)
        .fill()
        .map(() => Array(9).fill(""));

    if (typeof gridData === "string") {
      // If it's a string like "123456789012345678901234567890123456789012345678901234567890123456789012345678901"
      const chars = gridData.split("");
      const grid = [];
      for (let i = 0; i < 9; i++) {
        grid.push(chars.slice(i * 9, (i + 1) * 9));
      }
      return grid;
    }

    if (Array.isArray(gridData)) {
      // If it's already a 2D array
      return gridData;
    }

    return Array(9)
      .fill()
      .map(() => Array(9).fill(""));
  }

  const submitMutation = useMutationHandler(
    ({ puzzleId, answerData }) => submitGridAnswer(puzzleId, answerData),
    {
      onSuccess: (data) => {
        console.log("Grid answer submitted successfully:", data);
        setIsModalOpen(true);
      },
    }
  );

  // Mutation for sending feedback to API
  const feedbackMutation = useMutationHandler(puzzleFeedback, {
    onSuccess: (data) => {
      console.log("Feedback sent successfully:", data);
      // Invalidate challengesList query to refresh data
      queryClient.invalidateQueries(["challengesList", challengeId]);
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

        console.log("Sending feedback:", feedbackData);
        feedbackMutation.mutate(feedbackData);
      }, 1000); // 1 second debounce
    },
    [currentPuzzle.puzzleId, feedbackMutation]
  );

  const handleSubmit = () => {
    console.log("Submit button clicked");
    console.log("Current grid state:", grid);

    // Count filled cells and check for meaningful progress
    let filledCellsCount = 0;
    let validFilledCells = 0;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellValue = String(grid[row]?.[col] || "").trim();
        if (cellValue && cellValue !== "" && cellValue !== "0") {
          filledCellsCount++;
          if (isCellValid(row, col)) {
            validFilledCells++;
          }
        }
      }
    }

    console.log("Filled cells count:", filledCellsCount);
    console.log("Valid filled cells:", validFilledCells);

    // Require at least some meaningful progress (more than just 1-2 cells)
    if (filledCellsCount < 3) {
      alert(
        "Please fill in at least 3 cells before submitting to show meaningful progress."
      );
      return;
    }

    // Check if there are any invalid cells
    let hasInvalidCells = false;
    let invalidCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellValue = String(grid[row]?.[col] || "").trim();
        if (cellValue && cellValue !== "" && cellValue !== "0") {
          if (!isCellValid(row, col)) {
            hasInvalidCells = true;
            invalidCells.push(`(${row},${col}): "${cellValue}"`);
          }
        }
      }
    }

    console.log("Has invalid cells:", hasInvalidCells);
    console.log("Invalid cells:", invalidCells);

    if (hasInvalidCells) {
      alert(
        `Please fix the invalid cells (highlighted in red) before submitting.\nInvalid cells: ${invalidCells.join(
          ", "
        )}`
      );
      return;
    }

    // For Killer Sudoku, send the grid as a 2D array
    const answerData = {
      solution_grid: grid,
    };

    console.log(
      "Submitting to puzzleId:",
      currentPuzzle.puzzleId,
      "with data:",
      answerData
    );
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

  // Check if a cell was initially filled (part of the puzzle)
  const isInitialCell = (row, col) => {
    const initialGrid = parseGrid(currentPuzzle.puzzleDetail.initial_grid);
    return (
      initialGrid[row] &&
      initialGrid[row][col] &&
      initialGrid[row][col] !== "" &&
      initialGrid[row][col] !== "0"
    );
  };

  // Handle cell input change
  const handleCellChange = (row, col, value) => {
    // Only allow changes to non-initial cells
    if (isInitialCell(row, col)) return;

    // Use the allowed input regex from puzzle details
    if (value !== "" && !allowedInputRegex.test(value)) return;

    const newGrid = [...grid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  // Handle key press to replace value directly
  const handleKeyPress = (row, col, e) => {
    // Only allow changes to non-initial cells
    if (isInitialCell(row, col)) return;

    const key = e.key;

    // If it's a valid input character, replace the current value
    if (allowedInputRegex.test(key)) {
      e.preventDefault();
      const newGrid = [...grid];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = key;
      setGrid(newGrid);
    }
    // If it's backspace or delete, clear the cell
    else if (key === "Backspace" || key === "Delete") {
      e.preventDefault();
      const newGrid = [...grid];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = "";
      setGrid(newGrid);
    }
  };

  // Handle input focus to select all text (for easy replacement)
  const handleInputFocus = (e) => {
    e.target.select();
  };

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

  // Check if a cell value is valid (no duplicates in row, column, or 3x3 box)
  const isCellValid = (row, col) => {
    const value = grid[row]?.[col];

    // Convert to string and trim for consistent comparison
    const cellValue = String(value || "").trim();

    // Empty cells are valid
    if (!cellValue || cellValue === "" || cellValue === "0") return true;

    console.log(`Validating cell (${row},${col}) with value: "${cellValue}"`);

    // Check row for duplicates
    for (let c = 0; c < 9; c++) {
      if (c !== col) {
        const otherValue = String(grid[row]?.[c] || "").trim();
        if (
          otherValue &&
          otherValue !== "" &&
          otherValue !== "0" &&
          otherValue === cellValue
        ) {
          console.log(
            `Invalid cell at (${row},${col}): duplicate "${cellValue}" in row at column ${c}`
          );
          return false;
        }
      }
    }

    // Check column for duplicates
    for (let r = 0; r < 9; r++) {
      if (r !== row) {
        const otherValue = String(grid[r]?.[col] || "").trim();
        if (
          otherValue &&
          otherValue !== "" &&
          otherValue !== "0" &&
          otherValue === cellValue
        ) {
          console.log(
            `Invalid cell at (${row},${col}): duplicate "${cellValue}" in column at row ${r}`
          );
          return false;
        }
      }
    }

    // Check 3x3 box for duplicates
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r !== row || c !== col) {
          const otherValue = String(grid[r]?.[c] || "").trim();
          if (
            otherValue &&
            otherValue !== "" &&
            otherValue !== "0" &&
            otherValue === cellValue
          ) {
            console.log(
              `Invalid cell at (${row},${col}): duplicate "${cellValue}" in 3x3 box at (${r},${c})`
            );
            return false;
          }
        }
      }
    }

    return true;
  };

  // Get cell styling with cage borders and validation
  const getCellStyle = (row, col) => {
    const borders = getCageBorders(row, col);
    const isValid = isCellValid(row, col);
    const cellValue = grid[row]?.[col];

    // Debug logging for validation (only for invalid cells to reduce noise)
    if (cellValue && cellValue !== "" && cellValue !== "0" && !isValid) {
      console.log(`Invalid cell (${row},${col}) value: ${cellValue}`);
    }

    let borderStyles = "border border-gray-300";

    // Apply cage borders - use thick black borders for cage boundaries
    if (borders.includes("U")) borderStyles += " border-t-2 border-t-black";
    if (borders.includes("B")) borderStyles += " border-b-2 border-b-black";
    if (borders.includes("L")) borderStyles += " border-l-2 border-l-black";
    if (borders.includes("R")) borderStyles += " border-r-2 border-r-black";

    const baseStyle = `w-10 h-10 ${borderStyles} flex items-center justify-center text-base font-semibold text-center relative`;

    if (isInitialCell(row, col)) {
      return `${baseStyle} bg-gray-100 text-gray-800 cursor-not-allowed`; // Initial puzzle cells
    }

    // Invalid cells get red background
    if (!isValid) {
      console.log(`Applying red background to invalid cell (${row},${col})`);
      return `${baseStyle} bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 focus:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500`; // Invalid cells
    }

    return `${baseStyle} bg-white text-gray-800 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500`; // Valid editable cells
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

  // Render a 9x9 Killer Sudoku grid
  const renderGrid = () => (
    <div className="flex justify-center">
      <div className="inline-block">
        {Array.from({ length: 9 }, (_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: 9 }, (_, col) => {
              const value = grid[row] && grid[row][col] ? grid[row][col] : "";
              const displayValue = value === "0" ? "" : value;
              const superscript = getCageSuperscript(row, col);

              return (
                <div key={col} className={getCellStyle(row, col)}>
                  {superscript && (
                    <div className="absolute top-0.5 left-0.5 text-[10px] text-blue-600 font-bold leading-none">
                      {superscript}
                    </div>
                  )}
                  <input
                    type="text"
                    value={displayValue}
                    onChange={(e) => handleCellChange(row, col, e.target.value)}
                    onKeyDown={(e) => handleKeyPress(row, col, e)}
                    onFocus={handleInputFocus}
                    className="w-full h-full text-center bg-transparent border-none outline-none text-base font-semibold"
                    maxLength="1"
                    disabled={isInitialCell(row, col)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

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

        <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 p-6 font-poppins font-semibold">
          {renderGrid()}
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            submitMutation.isPending ||
            (() => {
              // Count filled cells for button state
              let filledCount = 0;
              for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                  const cellValue = String(grid[row]?.[col] || "").trim();
                  if (cellValue && cellValue !== "" && cellValue !== "0") {
                    filledCount++;
                  }
                }
              }
              return filledCount < 3; // Require at least 3 filled cells
            })()
          }
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

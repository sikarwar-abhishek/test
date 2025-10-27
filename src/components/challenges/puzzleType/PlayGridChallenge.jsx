"use client";
import { Info, X, Star, Check } from "lucide-react";
import Icon from "../../common/Icon";
import { useState, useRef, useCallback, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { useRouter } from "next/navigation";
import { submitGridAnswer } from "@/src/api/challenges";
import { puzzleFeedback } from "@/src/api/feedback";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

export default function PlayGridChallenge({ challengeId, currentPuzzle }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Parse grid size from puzzleDetail
  const getGridSize = () => {
    const gridSizeStr = currentPuzzle.puzzleDetail.grid_size || "9,9";
    const [rows, cols] = gridSizeStr
      .split(",")
      .map((num) => parseInt(num.trim()));
    return { rows, cols };
  };

  const { rows: gridRows, cols: gridCols } = getGridSize();

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
  const [grid, setGrid] = useState(() => {
    // Initialize grid from puzzle data - for Killer Sudoku, initial_grid is already a 2D array
    const puzzleDetail = currentPuzzle.puzzleDetail;
    if (puzzleDetail.initial_grid && Array.isArray(puzzleDetail.initial_grid)) {
      return puzzleDetail.initial_grid.map((row) => [...row]);
    }
    return Array(gridRows)
      .fill()
      .map(() => Array(gridCols).fill(""));
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
  }

  const submitMutation = useMutationHandler(
    ({ puzzleId, answerData }) => submitGridAnswer(puzzleId, answerData),
    {
      onSuccess: (data) => {
        // Store the submission result and mark as submitted
        setSubmissionResult(data?.puzzles[0]);
        setIsSubmitted(true);
        // Don't open modal immediately, let user see result first
      },
    }
  );

  // Mutation for sending feedback to API
  const feedbackMutation = useMutationHandler(puzzleFeedback, {
    onSuccess: (data) => {
      // Invalidate challengesList query to refresh data
      queryClient.invalidateQueries(["challengesList", challengeId]);
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
          puzzle: currentPuzzle.puzzleId,
          action: action,
        };

        feedbackMutation.mutate(feedbackData);
      }, 1000); // 1 second debounce
    },
    [currentPuzzle.puzzleId, feedbackMutation]
  );

  const isCellValid = useCallback(
    (row, col) => {
      const isKenken = /kenken/i.test(currentPuzzle.title);
      const value = grid?.[row]?.[col];
      if (!value || value === "" || value === "0") return true; // Empty cells are valid

      // Convert to string and trim for consistent comparison
      const cellValue = String(value || "").trim();

      // Empty cells are valid
      if (!cellValue || cellValue === "" || cellValue === "0") return true;

      // Check row for duplicates
      for (let c = 0; c < gridCols; c++) {
        if (c !== col) {
          const otherValue = String(grid[row]?.[c] || "").trim();
          if (
            otherValue &&
            otherValue !== "" &&
            otherValue !== "0" &&
            otherValue === cellValue
          ) {
            return false;
          }
        }
      }

      // Check column for duplicates
      for (let r = 0; r < gridRows; r++) {
        if (r !== row) {
          const otherValue = String(grid[r]?.[col] || "").trim();
          if (
            otherValue &&
            otherValue !== "" &&
            otherValue !== "0" &&
            otherValue === cellValue
          ) {
            return false;
          }
        }
      }

      // Check box for duplicates - calculate box dimensions based on grid size
      let boxRows, boxCols;

      if (!isKenken) {
        if (gridRows === 6 && gridCols === 6) {
          boxRows = 2;
          boxCols = 3;
        } else if (gridRows === 9 && gridCols === 9) {
          boxRows = 3;
          boxCols = 3;
        } else if (gridRows === 4 && gridCols === 4) {
          boxRows = 2;
          boxCols = 2;
        } else {
          boxRows = boxCols = Math.floor(Math.sqrt(gridRows));
        }

        const boxRow = Math.floor(row / boxRows) * boxRows;
        const boxCol = Math.floor(col / boxCols) * boxCols;

        for (let r = boxRow; r < boxRow + boxRows && r < gridRows; r++) {
          for (let c = boxCol; c < boxCol + boxCols && c < gridCols; c++) {
            if ((r !== row || c !== col) && grid[r][c] === value) return false;
          }
        }
      }

      return true;
    },
    [currentPuzzle.title, grid, gridCols, gridRows]
  );

  const handleSubmit = useCallback(() => {
    // Count filled cells and check for meaningful progress
    let filledCellsCount = 0;
    let validFilledCells = 0;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cellValue = String(grid[row]?.[col] || "").trim();
        if (cellValue && cellValue !== "" && cellValue !== "0") {
          filledCellsCount++;
          if (isCellValid(row, col)) {
            validFilledCells++;
          }
        }
      }
    }

    // Require at least some meaningful progress
    if (filledCellsCount < 1) {
      return;
    }

    // Check for invalid cells
    let hasInvalidCells = false;
    let invalidCells = [];
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cellValue = String(grid[row]?.[col] || "").trim();
        if (cellValue && cellValue !== "" && cellValue !== "0") {
          if (!isCellValid(row, col)) {
            hasInvalidCells = true;
            invalidCells.push(`(${row},${col}): "${cellValue}"`);
          }
        }
      }
    }

    // Uncomment to handle alerts for invalid cells
    // if (hasInvalidCells) {
    //   alert(
    //     `Please fix the invalid cells (highlighted in red) before submitting.\nInvalid cells: ${invalidCells.join(", ")}`
    //   );
    //   return;
    // }

    // For Killer Sudoku, send the grid as a 2D array
    const answerData = {
      solution_grid: grid,
    };
    submitMutation.mutate({ puzzleId: currentPuzzle.puzzleId, answerData });
  }, [grid, gridRows, gridCols, isCellValid, submitMutation, currentPuzzle]);

  const handleInfoClick = () => {
    setIsInstructionsOpen(true);
  };

  const handleCloseInstructions = () => {
    setIsInstructionsOpen(false);
  };

  const handleFinish = () => {
    setIsModalOpen(true);
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

  // Get cell styling with cage borders and validation
  const getCellStyle = (row, col) => {
    const borders = getCageBorders(row, col);
    const isValid = isCellValid(row, col);
    const cellValue = grid[row]?.[col];

    let borderStyles = "border border-gray-300";

    // Apply cage borders - use thick black borders for cage boundaries
    if (borders.includes("U")) borderStyles += " border-t-2 border-t-black";
    if (borders.includes("B")) borderStyles += " border-b-2 border-b-black";
    if (borders.includes("L")) borderStyles += " border-l-2 border-l-black";
    if (borders.includes("R")) borderStyles += " border-r-2 border-r-black";

    // Responsive: flex-1 makes cells divide screen width equally on mobile
    const sizeClasses = "flex-1 aspect-square max-w-[50px]";
    const textClasses = "text-base sm:text-lg md:text-xl lg:text-2xl";

    const baseStyle = `${sizeClasses} ${borderStyles} flex items-center justify-center ${textClasses} font-semibold text-center relative`;

    if (isInitialCell(row, col)) {
      return `${baseStyle} bg-gray-100 text-gray-800 cursor-not-allowed`;
    }

    if (!isValid) {
      return `${baseStyle} bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 focus:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500`;
    }

    return `${baseStyle} bg-white text-gray-800 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  };

  // Instructions Popup Component
  const InstructionsPopup = () => {
    const { description, instruction, difficultyLevel } = currentPuzzle;
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
                  DESCRIPTION
                </h4>
                <div className="text-[#757575] text-sm font-opensans leading-relaxed">
                  {/* {descirption} */}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(description),
                    }}
                  ></span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold font-monserrat text-black mb-3">
                  INSTRUCTIONS
                </h4>
                <div className="text-[#757575] text-sm font-opensans leading-relaxed">
                  {/* {instruction} */}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(instruction),
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render a solution grid (read-only, smaller size) - similar to practice component
  const renderSolutionGrid = (gridData, title) => {
    let parsedGrid = parseGrid(gridData);

    return (
      <div className="inline-block">
        {title && (
          <div className="text-xs text-gray-500 text-center mb-2">{title}</div>
        )}
        <div className="inline-block border border-gray-400">
          {Array.from({ length: gridRows }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: gridCols }, (_, col) => {
                const cellValue =
                  parsedGrid[row] && parsedGrid[row][col] !== undefined
                    ? parsedGrid[row][col]
                    : "";
                const displayValue =
                  cellValue === "" || cellValue === "0" || cellValue === 0
                    ? ""
                    : String(cellValue);
                const superscript = getCageSuperscript(row, col);
                const borders = getCageBorders(row, col);

                let borderStyles = "border border-gray-300";
                if (borders.includes("U"))
                  borderStyles += " border-t-2 border-t-black";
                if (borders.includes("B"))
                  borderStyles += " border-b-2 border-b-black";
                if (borders.includes("L"))
                  borderStyles += " border-l-2 border-l-black";
                if (borders.includes("R"))
                  borderStyles += " border-r-2 border-r-black";

                const sizeClasses =
                  "w-12 h-12 sm:w-10 sm:h-10 md:w-[50px] md:h-[50px]";
                const textClasses =
                  "text-sm sm:text-base md:text-lg lg:text-xl";
                const baseStyle = `${sizeClasses} ${borderStyles} flex items-center justify-center ${textClasses} font-semibold relative`;

                return (
                  <div key={col} className={`${baseStyle}`}>
                    {superscript && (
                      <div className="absolute top-0.5 left-0.5 text-xs sm:text-[13px] font-poppins text-blue-600 font-bold leading-none">
                        {superscript}
                      </div>
                    )}
                    <span className="font-semibold text-base">
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render solution grid with comparison highlighting incorrect cells
  const renderSolutionGridWithComparison = (
    gridData,
    title,
    userGrid,
    correctGrid
  ) => {
    let parsedGrid = parseGrid(gridData);

    // Check if user's answer matches correct answer for a cell
    const isCellCorrect = (row, col) => {
      if (!userGrid[row] || !correctGrid[row]) return false;
      return (
        userGrid[row][col] == correctGrid[row][col] || userGrid[row][col] === ""
      );
    };

    return (
      <div className="inline-block">
        {title && (
          <div className="text-xs text-gray-500 text-center mb-2">{title}</div>
        )}
        <div className="inline-block border border-gray-400">
          {Array.from({ length: gridRows }, (_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: gridCols }, (_, col) => {
                const cellValue =
                  parsedGrid[row] && parsedGrid[row][col] !== undefined
                    ? parsedGrid[row][col]
                    : "";
                const displayValue =
                  cellValue === "" || cellValue === "0" || cellValue === 0
                    ? ""
                    : String(cellValue);
                const superscript = getCageSuperscript(row, col);
                const borders = getCageBorders(row, col);

                let borderStyles = "border border-gray-300";
                if (borders.includes("U"))
                  borderStyles += " border-t-2 border-t-black";
                if (borders.includes("B"))
                  borderStyles += " border-b-2 border-b-black";
                if (borders.includes("L"))
                  borderStyles += " border-l-2 border-l-black";
                if (borders.includes("R"))
                  borderStyles += " border-r-2 border-r-black";

                // Check if cell is incorrect
                const isCorrect = isCellCorrect(row, col);
                const bgColor = isCorrect
                  ? "bg-white text-gray-800"
                  : "bg-red-400 text-black";

                const sizeClasses =
                  "w-12 h-12 sm:w-10 sm:h-10 md:w-[50px] md:h-[50px]";
                const textClasses =
                  "text-sm sm:text-base md:text-lg lg:text-xl";
                const baseStyle = `${sizeClasses} ${borderStyles} flex items-center justify-center ${textClasses} font-semibold relative ${bgColor}`;

                return (
                  <div key={col} className={`${baseStyle}`}>
                    {superscript && (
                      <div className="absolute top-0.5 left-0.5 text-xs font-poppins sm:text-[13px] text-blue-600 font-bold leading-none">
                        {superscript}
                      </div>
                    )}
                    <span className="font-semibold text-base">
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render solution feedback similar to practice component
  const renderSolutionFeedback = () => {
    if (!isSubmitted || !submissionResult) return null;

    const { correct, puzzleDetail } = submissionResult;
    const user_answer_grid = puzzleDetail?.user_answer_grid;
    const solution_grid = puzzleDetail?.solution_grid;

    if (correct) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-semibold font-monserrat text-[#2C9D00]">
              Correct
            </span>
          </div>

          {/* {user_answer_grid && (
            <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
              <h3 className="font-medium font-poppins text-gray-900 mb-2">
                Your Solution :
              </h3>
              <div className="flex justify-center">
                {renderSolutionGrid(user_answer_grid, "")}
              </div>
            </div>
          )} */}

          <p className="text-blue-500 font-medium font-poppins">
            You nailed it! Keep up the great work.
          </p>

          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-2">
              Solution
            </h3>
            <div className="flex justify-center">
              {solution_grid ? (
                renderSolutionGrid(solution_grid, "")
              ) : (
                <p className="text-gray-600 font-opensans">
                  Solution not available
                </p>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      const userGrid = parseGrid(user_answer_grid);
      const correctGrid = parseGrid(solution_grid);

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-semibold">Incorrect</span>
          </div>

          {user_answer_grid && (
            <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
              <h3 className="font-medium font-poppins text-gray-900 mb-2">
                Your Solution :
              </h3>
              <div className="flex justify-center">
                {renderSolutionGridWithComparison(
                  user_answer_grid,
                  "",
                  userGrid,
                  correctGrid
                )}
              </div>
            </div>
          )}

          <p className="text-blue-500 font-medium">Better Luck Next Time!</p>

          <div className="border border-[#000000] border-opacity-[0.12] shadow-sm rounded-lg p-4">
            <h3 className="font-medium font-poppins text-gray-900 mb-2">
              Solution
            </h3>
            <div className="flex justify-center">
              {solution_grid ? (
                renderSolutionGrid(solution_grid, "")
              ) : (
                <p className="text-gray-600 font-opensans">
                  Solution not available
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  const handleNumericInput = (row, col, e) => {
    if (isInitialCell(row, col)) return;

    const raw = e.target.value;
    const value = raw.trim().slice(-1);

    if (allowedInputRegex.test(value)) {
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = value;
        return newGrid;
      });
    } else if (value === "") {
      // allow clearing
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = "";
        return newGrid;
      });
    } else {
      // disallow invalid character
      e.preventDefault();
    }
  };

  // Render a Sudoku grid with dynamic size
  const renderGrid = () => (
    <div className="flex justify-center">
      <div className="inline-block">
        {Array.from({ length: gridRows }, (_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: gridCols }, (_, col) => {
              const value = grid[row] && grid[row][col] ? grid[row][col] : "";
              const displayValue = value === "0" ? "" : value;
              const superscript = getCageSuperscript(row, col);

              return (
                <div key={col} className={getCellStyle(row, col)}>
                  {superscript && (
                    <div className="absolute top-0.5 left-0.5 text-xs sm:text-sm text-blue-600 font-bold leading-none">
                      {superscript}
                    </div>
                  )}
                  <input
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onInput={(e) => handleNumericInput(row, col, e)}
                    onFocus={(e) => e.target.select()}
                    className="focus:bg-blue-100 cursor-pointer w-full h-full text-center bg-transparent border-none outline-none text-base font-semibold"
                    disabled={isInitialCell(row, col) || isSubmitted}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    function handleEnterKey(e) {
      const { key } = e;
      if (key === "Enter") handleSubmit();
    }
    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [handleSubmit]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <button
            onClick={handleInfoClick}
            className="hover:bg-gray-100 rounded-full transition-colors"
          >
            <Info fill="#75757580" stroke="white" className="cursor-pointer" />
          </button>
          <div className="flex gap-2">
            <div
              onClick={() => {
                if (like === 1) return;
                else handleLikeOrDislike(1);
              }}
            >
              <Icon
                name={"like"}
                className={`w-8 h-8 cursor-pointer ${
                  like === 1 ? "text-[#4676FA]" : "text-[#A3A3A3]"
                }`}
              />
            </div>
            <div
              onClick={() => {
                if (like === -1) return;
                else handleLikeOrDislike(-1);
              }}
            >
              <Icon
                name={"dislike"}
                className={`w-8 h-8 cursor-pointer ${
                  like === -1 ? "text-[#4676FA]" : "text-[#A3A3A3]"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 sm:p-6 p-2 font-poppins font-semibold">
          {renderGrid()}
        </div>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={
              submitMutation.isPending ||
              (() => {
                let filledCount = 0;
                for (let row = 0; row < gridRows; row++) {
                  for (let col = 0; col < gridCols; col++) {
                    const cellValue = String(grid[row]?.[col] || "").trim();
                    if (
                      cellValue &&
                      cellValue !== "" &&
                      cellValue !== "0" &&
                      !isInitialCell(row, col)
                    ) {
                      filledCount++;
                    }
                  }
                }
                return filledCount < 1;
              })()
            }
            className="py-2 px-16 sm:py-2 self-center sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent font-poppins font-bold flex items-center justify-center text-lg
                bg-blue-500 text-white transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <>
            {/* Show solution feedback */}
            {renderSolutionFeedback()}

            {/* Finish button */}
            <button
              onClick={handleFinish}
              className="mb-12 py-2 px-16 sm:py-2 self-center sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent font-poppins font-bold flex items-center justify-center text-lg
                bg-blue-500 text-white transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
            >
              Finish
            </button>
          </>
        )}
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

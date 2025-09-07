"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

function DateInput({
  id,
  value,
  onChange,
  placeholder = "DD-MM-YYYY",
  required = false,
  className = "",
  displayFormat = "DD-MM-YYYY",
  valueFormat = "YYYY-MM-DD",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayValue, setDisplayValue] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [dropdownAlignment, setDropdownAlignment] = useState("left");
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Convert YYYY-MM-DD to Date object
  const parseValueToDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Convert Date to YYYY-MM-DD format for backend using date-fns
  const formatForBackend = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  // Convert Date to DD-MM-YYYY format for display using date-fns
  const formatForDisplay = (date) => {
    if (!date) return "";
    return format(date, "dd-MM-yyyy");
  };

  // Calculate optimal dropdown position
  const calculateDropdownPosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 350; // Approximate height of the calendar
    const dropdownWidth = 320; // Approximate width of the calendar

    // Determine vertical position
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let newPosition = "bottom";
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      newPosition = "top";
    } else if (spaceBelow < dropdownHeight && spaceAbove < dropdownHeight) {
      // If neither has enough space, choose the side with more space
      newPosition = spaceAbove > spaceBelow ? "top" : "bottom";
    }

    // Determine horizontal alignment
    const spaceRight = viewportWidth - rect.left;
    const spaceLeft = rect.right;

    let newAlignment = "left";
    if (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) {
      newAlignment = "right";
    }

    // For mobile screens, always center
    if (viewportWidth < 640) {
      newAlignment = "center";
    }

    setDropdownPosition(newPosition);
    setDropdownAlignment(newAlignment);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      const backendFormat = formatForBackend(date);
      const displayFormat = formatForDisplay(date);
      setDisplayValue(displayFormat);
      onChange(backendFormat); // Send YYYY-MM-DD to backend
    } else {
      setDisplayValue("");
      onChange("");
    }
    setIsOpen(false);
  };

  // Handle input click
  const handleInputClick = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  // Update component when value prop changes (from form)
  useEffect(() => {
    if (value) {
      const dateObj = parseValueToDate(value);
      if (dateObj && !isNaN(dateObj.getTime())) {
        setSelectedDate(dateObj);
        setDisplayValue(formatForDisplay(dateObj));
      }
    } else {
      setSelectedDate(null);
      setDisplayValue("");
    }
  }, [value]);

  // Get dropdown positioning classes
  const getDropdownClasses = () => {
    let classes =
      "absolute bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 ";

    // Vertical positioning
    if (dropdownPosition === "top") {
      classes += "bottom-full mb-2 ";
    } else {
      classes += "top-full mt-2 ";
    }

    // Horizontal positioning
    if (dropdownAlignment === "left") {
      classes += "left-0 ";
    } else if (dropdownAlignment === "right") {
      classes += "right-0 ";
    } else if (dropdownAlignment === "center") {
      classes += "left-1/2 transform -translate-x-1/2 ";
    }

    // Mobile specific adjustments
    classes +=
      "sm:w-auto w-screen sm:max-w-none max-w-sm sm:left-auto sm:right-auto sm:transform-none ";

    return classes;
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          onClick={handleInputClick}
          readOnly
          required={required}
          className={`w-full px-4 py-3 pr-12 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80] cursor-pointer ${className}`}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      </div>

      {/* Date Picker Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className={getDropdownClasses()}>
          <style jsx global>{`
            .rdp {
              --rdp-cell-size: 40px;
              --rdp-accent-color: #3b82f6;
              --rdp-background-color: #3b82f6;
              --rdp-accent-color-dark: #2563eb;
              --rdp-background-color-dark: #2563eb;
              --rdp-outline: 2px solid var(--rdp-accent-color);
              --rdp-outline-selected: 3px solid var(--rdp-accent-color);
              margin: 0;
            }

            .rdp-months {
              display: flex;
            }

            .rdp-month {
              margin: 0;
            }

            .rdp-table {
              margin: 0;
              max-width: none;
            }

            .rdp-head_cell {
              font-weight: 500;
              font-size: 0.875rem;
              color: #6b7280;
              font-family: "Poppins", sans-serif;
            }

            .rdp-cell {
              padding: 0;
            }

            .rdp-button {
              border: none;
              font-family: "Inter", sans-serif;
              font-size: 0.875rem;
              border-radius: 6px;
              transition: all 0.2s;
            }

            .rdp-button:hover {
              background-color: #eff6ff;
              color: #3b82f6;
            }

            .rdp-day_selected {
              background-color: #3b82f6;
              color: white;
            }

            .rdp-day_selected:hover {
              background-color: #2563eb;
              color: white;
            }

            .rdp-day_today {
              font-weight: 600;
              color: #3b82f6;
            }

            .rdp-nav {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 1rem;
            }

            .rdp-nav_button {
              border: none;
              background: none;
              padding: 0.5rem;
              border-radius: 6px;
              transition: all 0.2s;
              color: #6b7280;
            }

            .rdp-nav_button:hover {
              background-color: #f3f4f6;
              color: #374151;
            }

            .rdp-caption_label {
              font-family: "Poppins", sans-serif;
              font-weight: 600;
              font-size: 1rem;
              color: #1f2937;
            }

            .rdp-day_outside {
              color: #d1d5db;
            }

            .rdp-day_disabled {
              color: #d1d5db;
              cursor: not-allowed;
            }

            /* Mobile responsive adjustments */
            @media (max-width: 640px) {
              .rdp {
                --rdp-cell-size: 35px;
              }

              .rdp-caption_label {
                font-size: 0.875rem;
              }

              .rdp-button {
                font-size: 0.75rem;
              }
            }
          `}</style>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rdp-custom"
            captionLayout="dropdown"
            disabled={(date) => date > new Date()}
          />
        </div>
      )}
    </div>
  );
}

export default DateInput;

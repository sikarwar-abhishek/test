"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function DateInput({
  id,
  value,
  onChange,
  placeholder = "Type Here",
  required = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : undefined
  );
  const containerRef = useRef(null);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // DD/MM/YYYY format
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = formatDate(date);
      onChange(formattedDate);
    }
    setIsOpen(false);
  };

  // Handle input click
  const handleInputClick = () => {
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

  // Update selectedDate when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onClick={handleInputClick}
          readOnly
          required={required}
          className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80] cursor-pointer ${className}`}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      </div>

      {/* Date Picker Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
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
          `}</style>

          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            showOutsideDays
            className="rdp-custom"
            captionLayout="dropdown"
          />
        </div>
      )}
    </div>
  );
}

export default DateInput;

"use client";

import { useState, useRef, useEffect } from "react";
import { COUNTRY_CODES } from "@/src/constants/constant";

export default function SearchableCountryCodeDropdown({
  value,
  onChange,
  disabled = false,
  className = "",
  placeholder = "+91",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter country codes based on input
  const filteredCodes = COUNTRY_CODES.filter((code) =>
    code.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;

    // Allow only digits and optional leading '+'
    if (/^\+?\d*$/.test(newValue)) {
      setInputValue(newValue);
      onChange(newValue);
      setIsOpen(newValue.length > 0 && filteredCodes.length > 0);
    }
  };


  // Handle option selection
  const handleOptionSelect = (countryCode) => {
    setInputValue(countryCode);
    onChange(countryCode);
    setIsOpen(false);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (inputValue.length > 0 && filteredCodes.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle input blur - validate and clear if invalid
  const handleInputBlur = () => {
    setIsOpen(false);
    // Check if the current input value is a valid country code
    if (inputValue && !COUNTRY_CODES.includes(inputValue)) {
      // Clear the field if it's not a valid country code
      setInputValue("");
      onChange("");
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Don't validate here, let onBlur handle it
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Text Input */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-20 sm:w-20 px-2 py-3 font-poppins drop-shadow-sm rounded-lg focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm ${className}`}
      />

      {/* Autocomplete Dropdown */}
      {isOpen && filteredCodes.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredCodes.map((code) => (
            <button
              key={code}
              type="button"
              onMouseDown={() => handleOptionSelect(code)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm ${inputValue === code
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700"
                }`}
            >
              {code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export default function MultiSelectDropdown({
  id,
  value = [],
  onChange,
  options = [],
  placeholder = "Select options",
  required = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Handle option selection
  const handleOptionSelect = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Handle tag removal
  const handleTagRemove = (optionValue) => {
    const newValue = value.filter((item) => item !== optionValue);
    onChange(newValue);
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

  // Get option label by value
  const getOptionLabel = (optionValue) => {
    const option = options.find((opt) => opt.value === optionValue);
    return option ? option.label : optionValue;
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`w-full min-h-[48px] px-4 py-3 pr-12 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-within:border-transparent outline-none transition-all  bg-[#E7EEFF80] cursor-pointer ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2">
          {value.length > 0 ? (
            value.map((selectedValue) => (
              <span
                key={selectedValue}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {getOptionLabel(selectedValue)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagRemove(selectedValue);
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto transform translate-y-0">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                value.includes(option.value)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-inter">{option.label}</span>
                {value.includes(option.value) && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden input for form validation */}
      {required && (
        <input
          type="hidden"
          value={value.length > 0 ? "valid" : ""}
          required={required}
        />
      )}
    </div>
  );
}

"use client";
import { Check, Filter } from "lucide-react";
import HomePageHeader from "../common/HomePageHeader";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
const challenges = [
  {
    id: 1,
    title: "Daily Challenge",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
  {
    id: 2,
    title: "Challenge_1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
  {
    id: 3,
    title: "Challenge_2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
  {
    id: 4,
    title: "Challenge_3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
  {
    id: 5,
    title: "Challenge_4",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
  {
    id: 6,
    title: "Challenge_5",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
  {
    id: 7,
    title: "Challenge_5",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
  {
    id: 8,
    title: "Challenge_5",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
  {
    id: 9,
    title: "Challenge_5",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
    imageSrc: "/asset/mug.jpg",
  },
];

function FilterComponent({ onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useState(["All"]);

  const filterOptions = [
    "All",
    "Daily",
    "Medium",
    "Vocabulary",
    "Math's",
    "Science",
    "Logic",
    "Strategy",
  ];

  const handleFilterToggle = (filter) => {
    if (filter === "All") {
      setSelectedFilters(["All"]);
    } else {
      setSelectedFilters((prev) => {
        const newFilters = prev.filter((f) => f !== "All");
        if (prev.includes(filter)) {
          const filtered = newFilters.filter((f) => f !== filter);
          return filtered.length === 0 ? ["All"] : filtered;
        } else {
          return [...newFilters, filter];
        }
      });
    }
  };

  const handleApply = () => {
    onFilterChange?.(selectedFilters);
  };

  const handleReset = () => {
    setSelectedFilters(["All"]);
    onFilterChange?.(["All"]);
  };

  return (
    <div className="bg-white rounded-xl border border-[#DADADA] p-4 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-poppins font-medium text-gray-900">
          Filter by
        </h3>
        <Filter className="w-5 h-5 text-gray-600" />
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-4"></div>

      {/* Filter Options */}
      <div className="space-y-4 font-poppins font-medium mb-4">
        {filterOptions.map((option) => {
          const isSelected = selectedFilters.includes(option);
          const isAll = option === "All";

          return (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`
                w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                ${
                  isSelected
                    ? isAll
                      ? "bg-blue-500 border-blue-500"
                      : "bg-blue-500 border-blue-500"
                    : "border-gray-300 group-hover:border-gray-400"
                }
              `}
              >
                {isSelected && (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                )}
              </div>
              <span
                className={`
                text-sm transition-colors duration-200
                ${isSelected ? "text-gray-900 font-medium" : "text-gray-600"}
              `}
              >
                {option}
              </span>
            </label>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleApply}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-poppins font-semibold py-2 px-4 rounded-xl transition-colors duration-200"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="w-full bg-transparent hover:bg-gray-50 text-[#979797] font-poppins font-semibold py-2 px-4 rounded-xl border border-[#979797]/80 transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function ChallengeCard({
  title = "Daily Challenge",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent",
  imageSrc = "/asset/mug.jpg",
  onStartChallenge,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden drop-shadow-sm border border-[#000000] border-opacity-[0.12] hover:shadow-md transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative aspect-square w-full rounded-lg p-2 max-h-48">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image src={imageSrc} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30 z-10"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-poppins font-semibold">{title}</h3>

        <p className="text-[#757575] font-opensans font-normal text-sm leading-relaxed">
          {description}
        </p>

        <Link
          href={"/challenges/logic"}
          onClick={onStartChallenge}
          className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold font-poppins py-2 px-4 rounded-xl transition-colors duration-200"
        >
          Start Now
        </Link>
      </div>
    </div>
  );
}

function ChallengesPage() {
  const [activeFilters, setActiveFilters] = useState(["All"]);

  const handleStartChallenge = (challengeId) => {
    console.log(`Starting challenge ${challengeId}`);
    // Add your challenge start logic here
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const filteredChallenges = activeFilters.includes("All")
    ? challenges
    : challenges.filter((challenge) =>
        activeFilters.includes(challenge.category)
      );
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader text={"Challenges"} />
        <div className="flex gap-8 overflow-auto no-scrollbar">
          <div className="flex-1 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  imageSrc={challenge.imageSrc}
                  onStartChallenge={() => handleStartChallenge(challenge.id)}
                />
              ))}
            </div>
          </div>
          <div className="max-w-80 min-w-64 sticky top-0 hidden lg:block">
            <FilterComponent onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengesPage;

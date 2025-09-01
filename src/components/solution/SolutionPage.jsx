"use client";

import HomePageHeader from "../common/HomePageHeader";
import { Calendar, ArrowRight } from "lucide-react";

function SolutionPage() {
  const previousChallenges = [
    { id: 1, title: "Daily Challenges", date: "11 April 2025" },
    { id: 2, title: "Daily Challenges", date: "11 April 2025" },
    { id: 3, title: "Daily Challenges", date: "11 April 2025" },
    { id: 4, title: "Daily Challenges", date: "11 April 2025" },
    { id: 5, title: "Daily Challenges", date: "11 April 2025" },
  ];

  const handleChallengeClick = (challengeId) => {
    console.log(`Viewing solution for challenge ${challengeId}`);
  };

  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader backBtn text={"Previous Challenges Solutions"} />

        <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full p-4 border border-gray-200 rounded-xl shadow-sm">
          {previousChallenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => handleChallengeClick(challenge.id)}
              className="flex items-center justify-between border-b last:border-none py-2 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg">
                  <Calendar className="w-7 h-7 text-blue-500" />
                </div>
                <div className="flex flex-col gap-2 font-rubik">
                  <h3 className="sm:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-500 sm:text-sm text-xs">
                    {challenge.date}
                  </p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SolutionPage;

// "use client";

// import HomePageHeader from "../common/HomePageHeader";
// import { Trophy, ArrowRight } from "lucide-react";

// function PreviousWeekLeaderboard() {
//   const previousLeaderboards = [
//     { id: 1, title: "Leaderboard_Title", date: "11 April 2025" },
//     { id: 2, title: "Leaderboard_Title", date: "11 April 2025" },
//     { id: 3, title: "Leaderboard_Title", date: "11 April 2025" },
//     { id: 4, title: "Leaderboard_Title", date: "11 April 2025" },
//     { id: 5, title: "Leaderboard_Title", date: "11 April 2025" },
//   ];

//   const handleLeaderboardClick = (leaderboardId) => {
//     console.log(`Viewing leaderboard for week ${leaderboardId}`);
//   };

//   return (
//     <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full p-4 border border-gray-200 rounded-xl shadow-sm">
//       {previousLeaderboards.map((leaderboard) => (
//         <div
//           key={leaderboard.id}
//           onClick={() => handleLeaderboardClick(leaderboard.id)}
//           className="flex items-center justify-between border-b last:border-none py-2 cursor-pointer group"
//         >
//           <div className="flex items-center gap-4">
//             <div className="flex flex-col gap-2 font-rubik">
//               <h3 className="sm:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
//                 {leaderboard.title}
//               </h3>
//               <p className="text-gray-500 sm:text-sm text-xs">
//                 {leaderboard.date}
//               </p>
//             </div>
//           </div>

//           <ArrowRight className="w-5 h-5 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default PreviousWeekLeaderboard;
"use client";

import { useState } from "react";
import HomePageHeader from "../common/HomePageHeader";
import { Trophy, ArrowRight } from "lucide-react";
import LeaderboardList from "./LeaderboardList";

function PreviousWeekLeaderboard() {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState(null);

  const previousLeaderboards = [
    { id: 1, title: "Leaderboard_Title", date: "11 April 2025" },
    { id: 2, title: "Leaderboard_Title", date: "12 April 2025" },
    { id: 3, title: "Leaderboard_Title", date: "13 April 2025" },
    { id: 4, title: "Leaderboard_Title", date: "14 April 2025" },
    { id: 5, title: "Leaderboard_Title", date: "15 April 2025" },
  ];

  const handleLeaderboardClick = (leaderboard) => {
    setSelectedLeaderboard(leaderboard);
  };

  const handleBackToList = () => {
    setSelectedLeaderboard(null);
  };

  return !selectedLeaderboard ? (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full p-4 border border-gray-200 rounded-xl shadow-sm">
      {previousLeaderboards.map((leaderboard) => (
        <div
          key={leaderboard.id}
          onClick={() => handleLeaderboardClick(leaderboard)}
          className="flex items-center justify-between border-b last:border-none py-2 cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg">
              <Trophy className="w-7 h-7 text-blue-500" />
            </div>
            <div className="flex flex-col gap-2 font-rubik">
              <h3 className="sm:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {leaderboard.title}
              </h3>
              <p className="text-gray-500 sm:text-sm text-xs">
                {leaderboard.date}
              </p>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      ))}
    </div>
  ) : (
    <LeaderboardList date={selectedLeaderboard.date} />
  );
}

export default PreviousWeekLeaderboard;

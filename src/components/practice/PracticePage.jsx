import Link from "next/link";
import HomePageHeader from "../common/HomePageHeader";
import Icon from "../common/Icon";
import { ProficiencyGraph, ScoreChart } from "../Home/ScoreCharts";

const data = [
  {
    date: "06/24",
    fitnessScore: 2,
    communityScore: 2,
    puzzleProficiency: 2,
    overallProficiency: 2,
  },
  {
    date: "09/24",
    fitnessScore: 1.8,
    communityScore: 1.8,
    puzzleProficiency: 1.9,
    overallProficiency: 1.8,
  },
  {
    date: "12/24",
    fitnessScore: 2.2,
    communityScore: 2.2,
    puzzleProficiency: 2.3,
    overallProficiency: 2.1,
  },
  {
    date: "03/25",
    fitnessScore: 3.5,
    communityScore: 3.2,
    puzzleProficiency: 3.2,
    overallProficiency: 3,
  },
  {
    date: "06/25",
    fitnessScore: 3.7,
    communityScore: 3.7,
    puzzleProficiency: 3.8,
    overallProficiency: 3.5,
  },
  {
    date: "09/25",
    fitnessScore: 2.3,
    communityScore: 2.5,
    puzzleProficiency: 2.7,
    overallProficiency: 2.4,
  },
];

function PracticePage() {
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader text={"Performance Indicator"} />

        {/* header */}
        <div className="w-full flex justify-between sticky">
          <div className="flex gap-2">
            <Icon name={"clock"} className={"w-6 h-6"} />
            <p className="font-opensans text-[#757575]">
              Estimated Time :
              <span className="font-bold text-blue-600">12 mins</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Icon name={"clock"} className={"w-6 h-6"} />
            <p className="font-opensans text-[#757575]">
              Puzzles :<span className="font-bold text-blue-600">12</span>
            </p>
          </div>
        </div>
        <div className="relative overflow-auto no-scrollbar">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
            <ScoreChart title="Training Accuracy">
              <ProficiencyGraph dataKey={"fitnessScore"} />
            </ScoreChart>
            <ScoreChart title="Training Puzzles Attempted">
              <ProficiencyGraph dataKey={"communityScore"} />
            </ScoreChart>
            <div className="col-span-2">
              <ScoreChart title="Training Submissions">
                <ProficiencyGraph dataKey={"communityScore"} />
              </ScoreChart>
            </div>
          </div>
        </div>

        <Link
          href={"/practice/challenges"}
          className="mx-auto self-start py-2 px-6 sm:py-2 sm:px-8 rounded-lg bg-blue-500 text-white font-poppins font-bold flex items-center justify-center text-lg
  transition-all duration-300 ease-in-out
  hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
        >
          Start Practicing
        </Link>
      </div>
    </div>
  );
}

export default PracticePage;

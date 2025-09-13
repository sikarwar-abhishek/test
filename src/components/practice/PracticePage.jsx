"use client";

import Link from "next/link";
import HomePageHeader from "../common/HomePageHeader";
import Icon from "../common/Icon";
import { ProficiencyGraph, ScoreChart } from "../Home/ScoreCharts";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { practiceProgress } from "@/src/api/practice";

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
  const { data, isLoading, error } = useQueryHandler(practiceProgress, {
    queryKey: ["practice_progress"],
  });

  if (isLoading) return <p>Loading..</p>;
  if (error) return <p> Error</p>;
  const { total_training_puzzles, charts } = data?.data;
  const { trainingAccuracy, trainingPuzzlesAttempted, trainingSubmissions } =
    charts;
  const hasChartData = charts && Object.keys(charts).length > 0;
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader text={"Performance Indicator"} />

        {/* header */}
        <div className="w-full flex justify-between sticky">
          <div className="flex gap-2">
            <Icon name={"clock"} className={"w-6 h-6"} />
            <p className="font-opensans text-[#757575]">
              Estimated Time:&nbsp;
              <span className="font-bold text-blue-600">
                {total_training_puzzles * 3} mins
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <Icon name={"puzzle2"} className={"w-6 h-6"} />
            <p className="font-opensans text-[#757575]">
              Puzzles:&nbsp;
              <span className="font-bold text-blue-600">
                {total_training_puzzles}
              </span>
            </p>
          </div>
        </div>
        {hasChartData ? (
          <div className="relative overflow-auto no-scrollbar">
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
              <ScoreChart
                title="Training Accuracy"
                tooltip="Your training accuracy over time."
              >
                <ProficiencyGraph
                  data={trainingAccuracy}
                  dataKey={"fitnessScore"}
                />
              </ScoreChart>
              <ScoreChart
                title="Training Puzzles Attempted"
                tooltip="Number of puzzles attempted."
              >
                <ProficiencyGraph
                  data={trainingPuzzlesAttempted}
                  dataKey={"communityScore"}
                />
              </ScoreChart>
              <div className="col-span-2">
                <ScoreChart
                  title="Training Submissions"
                  tooltip="Your submission over time."
                >
                  <ProficiencyGraph
                    data={trainingSubmissions}
                    dataKey={"communityScore"}
                  />
                </ScoreChart>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 py-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins text-gray-400 text-center">
              Start Practicing to show progress
            </h2>
          </div>
        )}

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

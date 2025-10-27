"use client";

import Link from "next/link";
import HomePageHeader from "../common/HomePageHeader";
import Icon from "../common/Icon";
import { ProficiencyGraph, ScoreChart } from "../Home/ScoreCharts";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getPracticePuzzlesDaily, practiceProgress } from "@/src/api/practice";
import Spinner from "../common/Spinner";

function PracticePage() {
  const { data, isLoading, error } = useQueryHandler(practiceProgress, {
    queryKey: ["practice_progress"],
    staleTime: 0,
  });
  const { data: practicePuzzlesAll, isLoading: puzzleLoading } =
    useQueryHandler(getPracticePuzzlesDaily, {
      queryKey: ["practice_puzzles_daily"],
      staleTime: 0,
    });
  if (isLoading || puzzleLoading) return <div className="h-[calc(100vh-10rem)] flex-1 justify-center place-content-center">
    <Spinner />
  </div>
  if (error) return <p> Error</p>;
  const { total_training_puzzles, charts } = data?.data;
  const { selected_goals } = data?.data;
  // console.log(selected_goals)
  const { trainingAccuracy, trainingPuzzlesAttempted, trainingSubmissions } =
    charts;
  const hasChartData = charts && Object.keys(charts).length > 0;
  const isCompleted = practicePuzzlesAll?.data?.completion_status?.is_completed;
  return (
    <div className="flex flex-1 max-h-screen overflow-hidden pb-24 sm:pb-0">
      <div className="relative min-h-screen sm:px-10 px-4 sm:py-6 pb-12 pt-6 flex-1 flex flex-col sm:gap-12 gap-6 bg-background">
        <HomePageHeader text={"Performance Indicator"} />

        {/* header */}
        <div className="z-100 w-full flex justify-between sticky">
          <div className="flex gap-2">
            <Icon name={"clock"} className={"sm:w-6 sm:h-6 w-5 h-5"} />
            <p className="font-opensans text-sm sm:text-base text-[#757575]">
              Estimated Time:&nbsp;
              <span className="font-bold text-blue-600">
                {total_training_puzzles * 3} mins
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <Icon name={"puzzle2"} className={"sm:w-6 sm:h-6 w-5 h-5"} />
            <p className="font-opensans text-sm sm:text-base text-[#757575]">
              Puzzles:&nbsp;
              <span className="font-bold text-blue-600">
                {total_training_puzzles}
              </span>
            </p>
          </div>
        </div>
        <div className="space-y-4 mb-24 overflow-auto no-scrollbar sm:mb-0">
          {/* goals data */}
          {selected_goals && selected_goals.length > 0 && (
            <div className="rounded-lg shadow-[0_2px_4px_#437EFE29] sm:p-5 p-2 border-l-4 border-blue-400">
              <h3 className="sm:text-lg text-sm font-montserrat font-semibold text-gray-800 sm:mb-4 mb-2 tracking-wide">
                Your Goals
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-3">
                {selected_goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-[#4676FA42] text-[#4676FA] sm:px-4 sm:py-2 px-2 py-1 rounded-full font-opensans font-semibold sm:text-sm text-[10px] transition-colors duration-200"
                  >
                    {goal.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasChartData ? (
            <div className="overflow-auto no-scrollbar  sm:mb-0">
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
                <div className="sm:col-span-2">
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
            <div className="flex items-center justify-center flex-1 h-[calc(100vh-20rem)]">
              <h2 className="text-xl sm:text-5xl lg:text-6xl font-bold font-poppins text-gray-400 text-center">
                Start Practicing to show progress
              </h2>
            </div>
          )}
        </div>

        <Link
          href={isCompleted ? "" : "/practice/challenges"}
          onClick={() => {
            if (isCompleted) return;
          }}
          className={`fixed z-[9999] bottom-24 left-1/2 -translate-x-1/2 sm:static
    whitespace-nowrap py-2 px-6 rounded-lg font-poppins font-bold sm:translate-x-0 mx-auto self-start sm:py-2 sm:px-8 sm:flex sm:items-center justify-center
    text-lg
    ${!isCompleted
              ? "bg-blue-500 text-white hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40 transition-all duration-300 ease-in-out"
              : "bg-gray-200 text-white"
            }`}
        >
          {isCompleted ? "Practice Completed" : "Start Practicing"}
        </Link>

      </div>
    </div>
  );
}

export default PracticePage;

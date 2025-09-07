"use client";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import Icon from "../common/Icon";
import ScoreCharts from "./ScoreCharts";
import { userProgress } from "@/src/api/home";

function ScoreCard({ icon, score, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm drop-shadow-sm border p-6 flex flex-col font-poppins items-center space-y-2">
      <Icon name={icon} className="w-10 h-10 text-yellow-400" />
      <span className="text-4xl font-semibold text-[#4676FA]">{score}</span>
      <span className="text-sm font-medium uppercase">{label}</span>
    </div>
  );
}

function Progress() {
  const { data, isLoading, error } = useQueryHandler(userProgress, {
    queryKey: ["user_progress"],
  });

  if (isLoading) return <p>Loading..</p>;
  if (error) return <p> Error</p>;
  const {
    proficiencyScore,
    communityScore,
    fitnessScore,
    bestPuzzleType,
    tooltips,
    charts,
  } = data;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard
          icon="price"
          score={proficiencyScore}
          label="Proficiency Score"
        />
        <ScoreCard
          icon="award"
          score={communityScore}
          label="Community Score"
        />
        <ScoreCard icon="dumbbell" score={fitnessScore} label="Fitness Score" />
      </div>
      <ScoreCharts
        bestPuzzleType={bestPuzzleType}
        tooltips={tooltips}
        charts={charts}
      />
    </div>
  );
}

export default Progress;

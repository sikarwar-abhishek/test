"use client";
import Icon from "../common/Icon";
import ScoreCharts from "./ScoreCharts";

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
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard icon="price" score="3.5" label="Proficiency Score" />
        <ScoreCard icon="award" score="1900" label="Community Score" />
        <ScoreCard icon="dumbbell" score="70" label="Fitness Score" />
      </div>
      <ScoreCharts />
    </div>
  );
}

export default Progress;

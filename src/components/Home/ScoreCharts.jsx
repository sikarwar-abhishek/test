"use client";

import { CircleQuestionMark } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Tooltip as TextToolTip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../common/ui/tooltip";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border rounded shadow">
        <p className="label">{`Date: ${label}`}</p>
        <p className="intro">{`Score: ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export function ScoreChart({ title, children, tooltip = "" }) {
  return (
    <div className="w-full z-30 h-80 rounded-2xl shadow-sm drop-shadow-sm border p-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold font-monserrat mb-4">{title}</h3>
        <TooltipProvider>
          <TextToolTip delayDuration={100}>
            <TooltipTrigger asChild>
              <CircleQuestionMark
                size={20}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200"
              />
            </TooltipTrigger>
            <TooltipContent
              className="max-w-xs bg-white border border-gray-200 shadow-lg rounded-lg p-3 text-sm text-gray-700 font-opensans"
              sideOffset={8}
            >
              <p className="leading-relaxed">{tooltip}</p>
            </TooltipContent>
          </TextToolTip>
        </TooltipProvider>
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
    </div>
  );
}

export function ProficiencyGraph({ data, dataKey }) {
  const color = "#4676FA90";

  // Extract chart configuration from data
  const { xLabels, yLabels, spots } = data || {};

  // Convert spots data to format expected by Recharts
  const chartData =
    spots?.map((spot) => ({
      x: spot.x,
      y: spot.y,
      xLabels: xLabels?.[spot.x] || spot.x,
    })) || [];

  // Calculate minimum width based on data points
  const minWidth = Math.max(350, chartData.length * 50); // 60px per data point, minimum 400px

  return (
    <div className="w-full h-full overflow-x-auto chart-scroll">
      <div style={{ minWidth: `${minWidth}px`, height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -30, bottom: 10 }}
            className="text-sm"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="xLabels"
              axisLine={false}
              tickLine={false}
              dy={10}
              interval={0}
              tick={{ fontSize: 12 }}
              // angle={-30}
              minTickGap={1}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              dx={-5}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ScoreCharts({ bestPuzzleType, tooltips, charts }) {
  const { proficiencyScore, fitnessScore, communityScore } = tooltips;
  const {
    proficiencyScore: proficiencyChart,
    fitnessScore: fitnessChart,
    communityScore: communityChart,
    overallProficiency: overallProficiencyChart,
  } = charts;
  // console.log(fitnessChart);
  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
      <ScoreChart title="Fitness Score" tooltip={fitnessScore}>
        <ProficiencyGraph data={fitnessChart} dataKey={"fitnessScore"} />
      </ScoreChart>
      <ScoreChart title="Community Score" tooltip={communityScore}>
        <ProficiencyGraph data={communityChart} dataKey={"communityScore"} />
      </ScoreChart>
      <div className="flex gap-6 sm:col-span-2">
        <ScoreChart title="Proficiency Score" tooltip={proficiencyScore}>
          <div className="w-full h-full flex flex-col sm:flex-row gap-24 sm:gap-12">
            <div className="w-full sm:w-[calc(36dvw)] h-full font-opensans">
              <p className="text-sm text-gray-600  -mt-4 mb-3">
                {"Best Proficiency in Puzzle type : "}
                <span className="font-semibold font-sans text-blue-500">
                  {bestPuzzleType}
                </span>
              </p>
              <ProficiencyGraph
                data={proficiencyChart}
                dataKey={"puzzleProficiency"}
              />
            </div>
            <div className="w-full sm:w-[calc(36dvw)] h-full">
              <p className="text-sm font-opensans text-gray-600 -mt-4 mb-3">
                {"Overall Proficiency"}
              </p>
              <ProficiencyGraph
                data={overallProficiencyChart}
                dataKey={"overallProficiency"}
              />
            </div>
          </div>
        </ScoreChart>
      </div>
    </div>
  );
}

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

export function ScoreChart({ title, children }) {
  return (
    <div className="w-full z-30 h-80 rounded-2xl shadow-sm drop-shadow-sm border p-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold font-monserrat mb-4">{title}</h3>
        <CircleQuestionMark size={28} className="fill-gray-500 text-white" />
      </div>
      <div className="h-[calc(100%-3rem)]">{children}</div>
    </div>
  );
}

export function ProficiencyGraph({ dataKey }) {
  const color = "#4676FA90";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: -32, bottom: 5 }}
        className="text-sm"
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" axisLine={false} tickLine={false} dy={10} />
        <YAxis
          domain={[0, 8]}
          ticks={[0, 2, 4, 6, 8]}
          axisLine={false}
          tickLine={false}
          dx={-5}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function ScoreCharts() {
  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
      <ScoreChart title="Fitness Score">
        <ProficiencyGraph dataKey={"fitnessScore"} />
      </ScoreChart>
      <ScoreChart title="Community Score">
        <ProficiencyGraph dataKey={"communityScore"} />
      </ScoreChart>
      <div className="flex gap-6 sm:col-span-2">
        <ScoreChart title="Proficiency Score">
          <div className="w-full h-full flex flex-col sm:flex-row gap-24 sm:gap-8">
            <div className="w-full h-full font-opensans">
              <p className="text-sm text-gray-600  -mt-4 mb-3">
                {"Best Proficiency in Puzzle type : "}
                <span className="font-semibold font-sans text-blue-500">
                  Sudoku
                </span>
              </p>
              <ProficiencyGraph dataKey={"puzzleProficiency"} />
            </div>
            <div className="w-full h-full">
              <p className="text-sm font-opensans text-gray-600 -mt-4 mb-3">
                {"Overall Proficiency"}
              </p>
              <ProficiencyGraph dataKey={"overallProficiency"} />
            </div>
          </div>
        </ScoreChart>
      </div>
    </div>
  );
}

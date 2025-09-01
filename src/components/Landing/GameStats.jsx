import Icon from "../common/Icon";

function GameStats({ value, label }) {
  return (
    <div className="flex flex-col gap-4 relative max-w-[200px]">
      <div className="relative self-start">
        <Icon name="trophy" className="w-18 h-18" />
        <Icon name="round-rect" className="w-16 h-12 absolute top-0 left-8" />
      </div>
      <div className="text-xl">
        <span className="font-fdemobold pr-2">{value}</span>
        <span className="font-nunito">
          {label !== "User Satisfaction" ? "+" : "%"}
        </span>
      </div>
      <span className="text-lg font-nunito font-medium capitalize line-clamp-1">
        {label}
      </span>
    </div>
  );
}

export default GameStats;

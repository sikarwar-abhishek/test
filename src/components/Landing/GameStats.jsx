import Icon from "../common/Icon";

function GameStats({ value, label }) {
  return (
    <div className="flex flex-col items-center sm:items-start gap-1.5 sm:gap-3 md:gap-4 w-auto max-w-none sm:max-w-[130px] md:max-w-[140px] lg:max-w-[150px] mx-auto sm:mx-0">
      <div className="relative">
        <Icon
          name="trophy"
          className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
        />
        <Icon
          name="round-rect"
          className="w-8 h-6 xs:w-9 xs:h-7 sm:w-10 sm:h-8 md:w-12 md:h-10 lg:w-14 lg:h-12 absolute top-0 left-5 xs:left-5.5 sm:left-6 md:left-7 lg:left-8"
        />
      </div>
      <div className="text-sm xs:text-base sm:text-lg md:text-xl whitespace-nowrap">
        <span className="font-semibold text-sm sm:text-xl pr-1 font-fdemobold">
          {value}
        </span>
        <span className="font-nunito">
          {label !== "User Satisfaction" ? "+" : "%"}
        </span>
      </div>
      <span className="text-xs sm:whitespace-nowrap xs:text-sm sm:text-base md:text-lg font-nunito font-medium capitalize text-center sm:text-left break-words w-full px-0.5">
        {label}
      </span>
    </div>
  );
}

export default GameStats;

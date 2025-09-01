import Image from "next/image";
import Icon from "../common/Icon";

function GameChallengeCard({ imageSrc, disabled, children }) {
  return (
    <div className="flex shadow-2xl drop-shadow-2xl flex-col relative z-20 rounded-2xl bg-white">
      <div className="relative z-20 aspect-video min-h-[180px] rounded-2xl bg-white">
        <Image
          src={imageSrc}
          alt="image"
          fill
          className="w-full h-full rounded-2xl rounded-bl-none rounded-br-none object-cover"
        />
      </div>
      <div className="flex flex-col p-4 z-20 rounded-[0rem_0rem_0.8rem_0.8rem] bg-white gap-3">
        <h2 className="text-2xl font-fdemoregular">Challenge 1</h2>
        <p className="text-[#000]/70 font-nunito">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent
        </p>
        <button
          disabled={disabled}
          className={`
            border-2 flex justify-center items-center gap-2 py-2 text-lg font-semibold rounded-xl
            transition-all duration-300 ease-in-out
            ${
              disabled
                ? "bg-[#D7D7D7] border-[#D7D7D7] text-[rgba(0,0,0,0.43)] cursor-not-allowed"
                : "border-[#4A79FA] text-[#4A79FA] hover:bg-[#4A79FA] hover:text-white hover:shadow-lg hover:scale-105"
            }
          `}
        >
          <span className="relative z-10">Start Now</span>
          {disabled && (
            <Icon
              name="lock"
              className={`w-6 h-6 ${
                disabled ? "fill-[rgba(0,0,0,0.43)]" : "fill-current"
              }`}
            />
          )}
        </button>
      </div>
      {children}
    </div>
  );
}

export default GameChallengeCard;

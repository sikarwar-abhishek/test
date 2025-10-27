"use client";

import Image from "next/image";
import Icon from "../common/Icon";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function GameChallengeCard({ onClick, puzzleName, imageSrc, disabled, children, imageClass }) {
  const router = useRouter();
  const cookies = Cookies.get("authToken");

  return (
    <div className="flex shadow-2xl drop-shadow-2xl flex-col relative rounded-2xl">

      {/* Overlay / background behind entire card */}
      {children && (
        <div className="absolute inset-0 -z-10">{children}</div>
      )}

      {/* Image section */}
      <div className="flex-1 rounded-se-2xl rounded-ss-2xl bg-white overflow-hidden" onClick={onClick}>
        <div className={`relative z-10 aspect-square min-h-[250px] rounded-2xl ${imageClass}`}>
          <Image
            src={imageSrc}
            alt="image"
            fill
            quality={100}
            priority
            className="w-full h-full rounded-bl-none rounded-br-none select-none"
          />
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-col p-4 z-10 rounded-b-2xl bg-white gap-3">
        <h2 className="text-base sm:text-lg font-fdemobold whitespace-nowrap">{puzzleName}</h2>
        <button
          disabled={disabled}
          onClick={() => {
            if (cookies) router.push("/challenges");
            else router.push("/login");
          }}
          className={`
        border-2 flex justify-center items-center gap-2 py-2 text-lg font-semibold rounded-xl
        transition-all duration-300 ease-in-out
        ${disabled
              ? "bg-[#D7D7D7] border-[#D7D7D7] text-[rgba(0,0,0,0.43)] cursor-not-allowed"
              : "border-[#4A79FA] text-[#4A79FA] hover:bg-[#4A79FA] hover:text-white hover:shadow-lg hover:scale-105"
            }
      `}
        >
          <span className="relative z-10">Start Now</span>
          {disabled && (
            <Icon
              name="lock"
              className={`w-6 h-6 ${disabled ? "fill-[rgba(0,0,0,0.43)]" : "fill-current"
                }`}
            />
          )}
        </button>
      </div>
    </div>

  );
}

export default GameChallengeCard;

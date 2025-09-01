import { ArrowUpRight, Play } from "lucide-react";
import Icon from "../common/Icon";
import GameCard from "./GameCard";

function HeroSection() {
  return (
    <section className="grid gap-8 lg:gap-0 grid-cols-1 lg:grid-cols-2 mt-16 sm:mt-24 ">
      <div className="flex flex-col gap-4 max-w-2xl relative order-1 lg:order-1">
        <Icon name="cube" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
        <div className="flex relative flex-col gap-4 sm:gap-6">
          <Icon
            name="puzzlepiece"
            className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 stroke-red-500 absolute bottom-1/2 -left-8 sm:-left-16 lg:-left-24 z-20 hidden sm:block"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-fdemobold leading-tight sm:!leading-[50px] md:!leading-[60px] lg:!leading-[70px]">
            Ignite your intellect with&nbsp;
            <span className="text-[#4676FA]">Daily IQ</span>
          </h1>
          <p className="max-w-md text-base sm:text-lg font-nunito">
            Join thousands of puzzle enthusiasts and challenge yourself with a
            new brain-teasing puzzle every day. Track your progress and climb
            the leaderboard!
          </p>
          <button
            className="mt-4 sm:mt-8 self-start py-2 px-6 sm:py-3 sm:px-8 rounded-xl gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-nunito font-bold flex items-center justify-center text-sm sm:text-base
  transition-all duration-300 ease-in-out
  hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
          >
            Download Now
            <ArrowUpRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <div className="flex w-full justify-center lg:justify-start order-2 lg:order-2">
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-4 lg:ml-16 xl:ml-32 scale-75 sm:scale-90 lg:scale-100 origin-center lg:origin-left">
          <GameCard
            imageSrc="/asset/mug.jpg"
            decorPos="bottomLeft"
            containerClass="w-[200px] sm:w-[240px] lg:w-[280px] max-h-[156px] sm:max-h-[187px] lg:max-h-[218px]"
          >
            <button className="absolute z-20 flex items-center gap-1 sm:gap-2 border border-white top-2/3 font-semibold text-white hover:cursor-pointer hover:scale-105 transition-all duration-300 whitespace-nowrap px-2 sm:px-3 lg:px-4 py-1 rounded-[1rem_1rem_1rem_0] bg-blue-500 left-6 sm:left-8 lg:left-12 text-xs sm:text-sm lg:text-base">
              <Play fill="white" size={12} className="sm:w-4 sm:h-4" />
              Play Challenge
            </button>
          </GameCard>

          <GameCard
            imageSrc="/asset/pattern.jpg"
            decorPos="bottomRight"
            containerClass="aspect-square scale-70 origin-top -translate-y-4 sm:-translate-y-6 lg:-translate-y-8"
          >
            <Icon
              name="light-cube"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 absolute z-10 -top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-5 lg:-left-5"
            />
            <button className="absolute z-20 flex items-center gap-1 sm:gap-2 border-2 border-red-300 font-semibold text-black hover:cursor-pointer hover:scale-105 transition-all duration-300 whitespace-nowrap px-4 sm:px-6 lg:px-8 py-1 sm:py-2 rounded-[2rem_2rem_2rem_0] bg-white -right-6 sm:-right-8 lg:-right-12 top-1/2 text-sm sm:text-lg lg:text-2xl leading-none -translate-y-[50%]">
              Shapes
            </button>
          </GameCard>

          <GameCard
            imageSrc="/asset/puzzle.jpg"
            decorPos="bottomRight"
            containerClass="-translate-y-[15%] aspect-square scale-70 -translate-y-4 sm:-translate-y-6 lg:-translate-y-8"
          >
            <Icon
              name="emoji"
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 absolute z-10 -top-6 -left-6 sm:-top-8 sm:-left-8 lg:-top-12 lg:-left-12"
            />
            <button className="absolute z-20 flex items-center gap-1 sm:gap-2 border-2 border-red-300 font-semibold text-black hover:cursor-pointer hover:scale-105 transition-all duration-300 whitespace-nowrap px-4 sm:px-6 lg:px-8 py-1 sm:py-2 rounded-[2rem_2rem_0_2rem] bg-white -left-6 sm:-left-8 lg:-left-12 bottom-2/3 text-sm sm:text-lg lg:text-2xl leading-none -translate-y-[50%]">
              Puzzles
            </button>
          </GameCard>

          <GameCard
            imageSrc="/asset/scramble-1.png"
            decorPos="topRight"
            containerClass="-translate-y-[35%] -translate-x-[12%] aspect-square scale-70 -translate-y-4 sm:-translate-y-6 lg:-translate-y-8"
          >
            <button className="absolute z-20 flex items-center gap-1 sm:gap-2 border-2 border-red-300 font-semibold text-black hover:cursor-pointer hover:scale-105 transition-all duration-300 whitespace-nowrap px-4 sm:px-6 lg:px-8 py-1 sm:py-2 rounded-[2rem_2rem_0_2rem] bg-white -right-12 sm:-right-16 lg:-right-24 bottom-1/2 text-sm sm:text-lg lg:text-2xl leading-none -translate-y-[50%]">
              Crosswords
            </button>
          </GameCard>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

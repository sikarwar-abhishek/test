"use client";

import { ArrowUpRight, Play } from "lucide-react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Icon from "../common/Icon";
import GameCard from "../Landing/GameCard";
import Link from "next/link";
import Image from "next/image";

function AboutUsPage() {
  return (
    <>
      {/* Add a container with proper constraints for the header */}
      <div className="w-full px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
        <Header />
      </div>

      <main className="relative min-h-screen w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-[#FFFFFF] via-[#FFBE73B3] to-[#FFBE73] rounded-br-[72px] rounded-bl-[72px] ">
          {/* Left Puzzlepiece Icon  */}
          <Icon
            name="puzzlepiece"
            className="absolute top-100 -left-5 w-36 h-36 sm:w-28 sm:h-28 text-orange-400 opacity-70"
          />
          {/* Right Light Cube Icon */}
          <Icon
            name="light-cube"
            className="absolute top-6 right-32 w-20 h-20 sm:w-24 sm:h-24 text-orange-500 opacity-90"
          />

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-semibold leading-tight">
            Ignite your intellect with&nbsp;
            <span className="text-[#4676FA] block">Daily IQ</span>
          </h1>
          <p className="mt-6 max-w-2xl text-gray-700 text-lg font-nunitosans leading-relaxed">
            We are a global community of curious thinkers, lifelong learners and
            problem-solvers, united by a passion for daily intellectual
            challenges. It&apos;s brain-boosting fun, right at your fingertips.
          </p>
        </section>

        {/* What We Offer Section */}
        <section className="relative px-4 md:px-8 -mt-20">
          <div className="bg-white rounded-3xl shadow-md p-8 md:p-12 mx-auto max-w-7xl">
            <h2 className="text-4xl font-poppins font-semibold text-center mb-8 md:mb-12">
              What We Offer
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-22 items-center">
              {/* Left Side - Game Cards */}
              <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-4 lg:ml-8 xl:ml-16 scale-75 sm:scale-90 lg:scale-100 origin-center lg:origin-left">
                <GameCard
                  imageSrc="/asset/mug.jpg"
                  decorPos="bottomLeft"
                  containerClass="w-[150px] sm:w-[240px] lg:w-[280px] max-h-[156px] sm:max-h-[187px] lg:max-h-[218px]"
                >
                  <Link href={'/challenges'} className="select-none absolute z-20 flex items-center gap-1 sm:gap-2 border border-white top-2/3 font-semibold text-white hover:scale-105 cursor-pointer transition-all duration-300 whitespace-nowrap px-2 sm:px-3 lg:px-4 py-1 rounded-[1rem_1rem_1rem_0] bg-blue-500 left-6 sm:left-8 lg:left-12 text-xs sm:text-sm lg:text-base">
                    <Play fill="white" size={12} className="sm:w-4 sm:h-4" />
                    Play Challenge
                  </Link>
                </GameCard>

                <GameCard
                  imageSrc="/asset/pattern.jpg"
                  decorPos="bottomRight"
                  containerClass="aspect-square ml-8 mt-8 scale-75 origin-top" /* Reduced margin and translation */
                >
                  <Icon
                    name="light-cube"
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 absolute z-10 -top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-5 lg:-left-5"
                  />
                  <div className="select-none absolute z-20 flex items-center gap-1 sm:gap-2 border-2 border-red-300 font-semibold text-black transition-all duration-300 whitespace-nowrap px-4 sm:px-6 lg:px-8 py-1 sm:py-2 rounded-[2rem_2rem_2rem_0] bg-white -right-4 sm:-right-6 lg:-right-8 top-1/2 text-sm sm:text-lg lg:text-2xl leading-none -translate-y-[50%]">
                    Shapes
                  </div>
                </GameCard>

                <GameCard
                  imageSrc="/asset/puzzle.jpg"
                  decorPos="bottomRight"
                  containerClass="mt-6 aspect-square scale-75"
                >
                  <Icon
                    name="emoji"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 absolute z-10 -top-6 -left-6 sm:-top-8 sm:-left-8 lg:-top-12 lg:-left-12"
                  />
                  <div className="select-none absolute z-20 flex items-center gap-1 sm:gap-2 border-2 border-red-300 font-semibold text-black transition-all duration-300 whitespace-nowrap px-4 sm:px-6 lg:px-8 py-1 sm:py-2 rounded-[2rem_2rem_0_2rem] bg-white -left-4 sm:-left-6 lg:-left-8 bottom-2/3 text-sm sm:text-lg lg:text-2xl leading-none -translate-y-[50%]">
                    Puzzles
                  </div>
                </GameCard>

                <GameCard
                  imageSrc="/asset/scramble-1.png"
                  decorPos="topRight"
                  containerClass="-translate-x-[8%] aspect-square scale-75"
                >
                  <Icon
                    name="emoji"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 absolute z-10 -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 lg:-bottom-12 lg:-right-12"
                  />
                  <div className="select-none absolute z-20 flex items-center gap-1 sm:gap-2 border-2 border-red-300 font-semibold text-black transition-all duration-300 whitespace-nowrap px-4 sm:px-6 lg:px-8 py-1 sm:py-2 rounded-[2rem_2rem_0_2rem] bg-white -right-8 sm:-right-12 lg:-right-16 bottom-1/2 text-sm sm:text-lg lg:text-2xl leading-none -translate-y-[50%]">
                    Crosswords
                  </div>
                </GameCard>
              </div>

              {/* Right Side - Text */}
              <div className="flex flex-col gap-6 md:gap-8 text-gray-700 font-nunito leading-relaxed text-base md:text-lg py-4">
                <p>
                  DailyIQ is a platform that makes it easy for people to
                  discover and share intellectually stimulating and challenging
                  content, such as logic puzzles, number puzzles, sudoku,
                  geometry puzzles, riddles, and even humor.
                </p>
                <p>
                  We offer personalized training, challenges, and a supportive
                  community to make staying mentally sharp fun and engaging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New App Download Section */}
        <section className="relative px-4 md:px-8 mt-16 mb-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-nunito font-bold text-black mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-gray-700 font-nunito mb-8 max-w-2xl mx-auto">
              Start your journey at{" "}
              <a
                href="https://dailyiq.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                dailyiq.ai
              </a>{" "}
              on the App Store and Google Play
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              {/* App Store Button */}
              <button className="bg-black text-white font-nunitosans font-semibold py-3 px-6 rounded-[12px] flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <Image
                  src="/asset/apple.png"
                  alt="App Store"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                App Store
              </button>

              {/* Google Play Button */}
              <button className="bg-black text-white font-nunitosans font-semibold py-3 px-6 rounded-[12px] flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                <Image
                  src="/asset/play.png"
                  alt="Google Play"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                Google Play
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AboutUsPage;

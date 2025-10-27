'use client';
import { useState } from "react";
import GameChallengeCard from "./GameChallengeCard";
import GameDetailsModal from "./GameDetailsModal";

function TrialGames() {

  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 1,
      image: "/asset/demoSudoku.png",
      title: "Puzzle Enthusiast",
      subtitle: "Sudoku",
      description: [
        "Sudoku grid consists of 9×9 spaces.",
        "You can use only numbers from 1 to 9.",
        "Each 3×3 block can only contain numbers from 1 to 9.",
        "Each vertical column can only contain numbers from 1 to 9.",
        "Each horizontal row can only contain numbers from 1 to 9.",
        "Each number in the 3×3 block, vertical column or horizontal row can be used only once.",
        "The game is over when the whole Sudoku grid is correctly filled with numbers.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-blue-500 px-4 py-10 md:p-12 lg:p-20 overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="text-white flex flex-col gap-2 md:gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-fdemobold">
            Top Challenges
          </h1>
          {/* <h3 className="text-base sm:text-lg md:text-xl font-nunito font-normal">
            Guests get one free puzzle. Sign up to unlock all.
          </h3> */}
        </div>
      </div>

      {/* trialgames */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 sm:gap-8 md:gap-10 lg:gap-12 mt-10 md:mt-16 lg:mt-20">
        <GameChallengeCard onClick={() => setSelectedGame(games[0])} puzzleName={'Puzzle Enthusiast'} imageSrc="/asset/demoSudoku.png" imageClass={'scale-95'}>
          <div className="absolute h-2/3 w-full bg-[#FFB8D6]/70 -bottom-2 sm:-bottom-3 md:-bottom-4 -left-2 sm:-left-3 md:-left-4 rounded-2xl sm:rounded-3xl md:rounded-4xl"></div>
        </GameChallengeCard>

        <GameChallengeCard puzzleName={'Logic Puzzle Challenge'} imageSrc="/asset/demoLogicPuzzle.png" imageClass={'scale-95'} disabled={true}>
          <div className="absolute aspect-square w-1/2 bg-[#FF7F4C]/70 -top-4 md:-top-6 right-4 md:right-6 z-10 rounded-2xl sm:rounded-3xl md:rounded-[3rem]"></div>
        </GameChallengeCard>

        <GameChallengeCard puzzleName={'Grid Challenge'} imageSrc="/asset/demoGridChallenge.png"  disabled={true}>
          <div className="absolute aspect-square w-1/2 bg-[#FBFF06]/70 -bottom-6 md:-bottom-10 left-8 md:left-12 z-10 rounded-xl sm:rounded-2xl md:rounded-[2rem]"></div>
        </GameChallengeCard>

        <GameChallengeCard puzzleName={'Daily Sudoku Challenge'} imageSrc="/asset/demoDailySudoku.png" imageClass={'scale-105'} disabled={true}>
          <div className="absolute aspect-square h-3/5 bg-[#4FC87C]/70 top-4 md:top-8 -right-6 md:-right-12 z-10 rounded-2xl sm:rounded-3xl md:rounded-[3rem]"></div>
          <div className="absolute aspect-square w-2/3 bg-[#FAC8FF]/70 -bottom-6 md:-bottom-10 left-1/2 -translate-x-[50%] z-10 rounded-xl sm:rounded-2xl md:rounded-[2rem]"></div>
        </GameChallengeCard>
      </div>

       {selectedGame && (
        <GameDetailsModal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          game={selectedGame}
          onStart={() => {
            setSelectedGame(null);
            window.location.href = "/challenges";
          }}
        />
      )}
    </div>
  );
}

export default TrialGames;

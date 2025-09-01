import GameChallengeCard from "./GameChallengeCard";

function TrialGames() {
  return (
    <div className="min-h-screen bg-blue-500 p-20 pb-22">
      <div className="flex justify-between items-center">
        <div className="text-white flex flex-col gap-4">
          <h1 className="text-5xl font-fdemobold">The best of the best</h1>
          <h3 className="text-xl font-nunito font-normal">
            Guests get one free puzzle. Sign up to unlock all.
          </h3>
        </div>
        <button className="border-2 border-white text-white px-6 py-2 font-medium font-nunito rounded-lg transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:text-blue-500 hover:bg-white">
          Sign up
        </button>
      </div>
      {/* trialgames */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-20">
        <GameChallengeCard imageSrc="/asset/white-puzzle.jpg">
          <div className="absolute h-2/3 w-full bg-[#FFB8D6]/70 -bottom-4 z-10 -left-4 rounded-4xl"></div>
        </GameChallengeCard>
        <GameChallengeCard imageSrc="/asset/mug.jpg" disabled={true}>
          <div className="absolute aspect-square w-1/2 bg-[#FF7F4C]/70 -top-6 right-6 z-10 rounded-[3rem]"></div>
        </GameChallengeCard>
        <GameChallengeCard imageSrc="/asset/scramble.png" disabled={true}>
          <div className="absolute aspect-square w-1/2 bg-[#FBFF06]/70 -bottom-10 left-12 z-10 rounded-[2rem]"></div>
        </GameChallengeCard>
        <GameChallengeCard imageSrc="/asset/gear.png" disabled={true}>
          <div className="absolute aspect-square h-3/5 bg-[#4FC87C]/70 top-8 -right-12 z-10 rounded-[3rem]"></div>
          <div className="absolute aspect-square w-2/3 bg-[#FAC8FF]/70 -bottom-10 left-1/2 -translate-x-[50%] z-10 rounded-[2rem]"></div>
        </GameChallengeCard>
      </div>
    </div>
  );
}

export default TrialGames;

"use client";
import { Info } from "lucide-react";
import HomePageHeader from "../common/HomePageHeader";
import Icon from "../common/Icon";
import { useState } from "react";
import { Modal } from "../common/Modal";

function PlayChallenge() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [like, setLike] = useState(0);
  function handleLikeOrDislike(value) {
    if (!like) setLike(value);
    else {
      if (value === like) setLike(0);
      else setLike(value);
    }
  }
  return (
    <div className="flex flex-1 max-h-screen overflow-auto">
      <div className="relative min-h-screen sm:px-10 px-4 py-6 flex-1 flex flex-col gap-12 bg-background">
        <HomePageHeader text={"Logic Challenges"} backBtn />
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <Info fill="#75757580" stroke="white" />
            <div className="flex gap-2">
              <div onClick={() => handleLikeOrDislike(1)}>
                <Icon
                  name={"like"}
                  className={`w-8 h-8 cursor-pointer ${
                    like === 1 ? "text-[#4676FA]" : "text-[#A3A3A3]"
                  }`}
                />
              </div>
              <div onClick={() => handleLikeOrDislike(-1)}>
                <Icon
                  name={"dislike"}
                  className={`w-8 h-8 cursor-pointer ${
                    like === -1 ? "text-[#4676FA]" : "text-[#A3A3A3]"
                  }`}
                />
              </div>
              <Icon name={"share"} className={"w-8 h-8 cursor-pointer"} />
            </div>
          </div>
          {/* <div className="flex flex-col gap-2"> */}
          <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 min-h-[40dvh] font-poppins font-semibold">
            <p className="text-2xl">PUZZLE FROM BACKED</p>
          </div>
          <textarea
            placeholder="Type your answer"
            className="border w-full min-h-40 resize-none rounded-lg p-4 font-roboto"
          ></textarea>
          {/* </div> */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-16 sm:py-2 self-center sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent bg-blue-500 text-white font-poppins font-bold flex items-center justify-center text-lg
            transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40"
          >
            Submit
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          console.log("Next puzzle submitted!");
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default PlayChallenge;

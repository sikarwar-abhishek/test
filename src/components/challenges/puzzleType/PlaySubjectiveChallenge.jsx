"use client";
import { Info } from "lucide-react";
import Icon from "../../common/Icon";
import { useState } from "react";
import { Modal } from "../../common/Modal";
import { useRouter } from "next/navigation";
import { submitSubjectiveAnswer } from "@/src/api/challenges";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { useQueryClient } from "@tanstack/react-query";

export default function PlaySubjectiveChallenge({
  challengeId,
  currentPuzzle,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [like, setLike] = useState(0);
  const [answer, setAnswer] = useState("");

  const submitMutation = useMutationHandler(
    ({ puzzleId, answerData }) => submitSubjectiveAnswer(puzzleId, answerData),
    {
      onSuccess: (data) => {
        console.log("Answer submitted successfully:", data);
        setIsModalOpen(true);
      },
    }
  );
  const handleSubmit = () => {
    if (!answer.trim()) {
      alert("Please enter an answer before submitting.");
      return;
    }

    const answerData = {
      answer: answer.trim(),
    };

    console.log(
      "Submitting to puzzleId:",
      currentPuzzle.puzzleId,
      "with data:",
      answerData
    );
    submitMutation.mutate({ puzzleId: currentPuzzle.puzzleId, answerData });
  };

  function handleLikeOrDislike(value) {
    if (!like) setLike(value);
    else {
      if (value === like) setLike(0);
      else setLike(value);
    }
  }
  return (
    <div>
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
            {/* <Icon name={"share"} className={"w-8 h-8 cursor-pointer"} /> */}
          </div>
        </div>
        {/* <div className="flex flex-col gap-2"> */}
        <div className="border-4 rounded-lg border-[#4676FA] border-opacity-20 min-h-[40dvh] font-poppins font-semibold">
          <p className="text-2xl p-4">
            {currentPuzzle.puzzleDetail.description}
          </p>
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer"
          className="border w-full min-h-40 resize-none rounded-lg p-4 font-roboto"
        />
        {/* </div> */}
        <button
          onClick={handleSubmit}
          disabled={submitMutation.isPending || !answer.trim()}
          className="py-2 px-16 sm:py-2 self-center sm:px-32 rounded-lg gap-2 sm:gap-4 border border-transparent font-poppins font-bold flex items-center justify-center text-lg
            bg-blue-500 text-white transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/40
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {submitMutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          router.push(`/challenges/${challengeId}`);
          setIsModalOpen(false);
          queryClient.invalidateQueries(["challengesList", challengeId]);
        }}
      />
    </div>
  );
}

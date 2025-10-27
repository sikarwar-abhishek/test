"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const FAQ_DATA = [
  {
    question: "How many times can I play in a day?",
    answer:
      "You can attempt a puzzles as many times as you want in a day but you can submit your solution only once.",
  },
  {
    question: "What happens if I skip a day?",
    answer:
      "Skipping a day won't affect your overall progress. You can always continue from the next available challenge.",
  },
  {
    question: "Are there different difficulty levels?",
    answer:
      "Yes! Challenges and practice puzzles are designed with multiple difficulty levels so people of all skill levels can enjoy.",
  },
  {
    question: "Can I replay old challenges?",
    answer:
      "No, you can see the answers to previous day's challenges but you cannot attempt them or older challenges again.",
  },
  {
    question: "How are scores calculated?",
    answer:
      "Scores are calculated based on the accuracy of your answer and the difficulty of the puzzle being solved.",
  },
];

function FaqSection() {
  const [openItems, setOpenItems] = useState(null);

  const toggleItem = (index) => {
    if (index === openItems) setOpenItems(null);
    else setOpenItems(index);
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-12 lg:px-20 xl:px-32 font-poppins">
      <div className="flex flex-col gap-4 md:gap-10 items-start">
        {/* Middle heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-fdemobold lg:text-5xl font-medium text-gray-900 w-full text-center mb-4 md:mb-6">
          Frequently Asked <span className="text-blue-600">Questions</span>
        </h1>

        <div className="flex flex-col lg:flex-row justify-between w-full gap-4 lg:gap-12 xl:gap-16 lg:items-center">
          {/* Left side - Illustration (visible on all devices) */}
          <div className="relative mx-auto aspect-square w-40 sm:w-56 md:w-64 lg:w-80">
            <Image
              quality={90}
              src="/asset/Group.png"
              fill
              className="object-contain"
              alt="FAQ illustration"
            />
          </div>

          {/* Right side - FAQ items */}
          <div className="w-full lg:max-w-[650px] space-y-3 md:space-y-4 lg:space-y-5">
            {FAQ_DATA.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl px-4 md:px-6 py-4 md:py-[22px] border border-gray-200 shadow-[0_6px_12px_-2px_rgba(0,0,0,0.12)]"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-gray-700 text-base sm:text-lg md:text-xl font-medium min-w-[24px]">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base md:text-lg font-normal">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openItems === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-500 text-white"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openItems === index && (
                    <motion.div
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{
                        duration: 0.3,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      }}
                    >
                      <motion.div
                        initial={{ y: -6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="pt-3 pl-7 text-gray-600 text-sm sm:text-base font-normal"
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqSection;

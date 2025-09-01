"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/src/constants/constant";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function FaqSection() {
  const [openItems, setOpenItems] = useState(null);

  const toggleItem = (index) => {
    // setOpenItems((prev) =>
    //   prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    // );
    if (index === openItems) setOpenItems(null);
    else setOpenItems(index);
  };

  return (
    <div className="min-h-screen p-22">
      <div className="flex flex-col gap-18 items-start">
        {/* Left side - Illustration and heading */}

        <h1 className="text-5xl font-fdemobold text-gray-900">FAQ?</h1>
        <div className="flex justify-between place-items-center w-full gap-12 h-[70dvh]">
          <div className="relative aspect-square h-100">
            <Image
              quality={80}
              src="/asset/hero.png"
              fill
              className="drop-shadow-xl"
              alt="hero"
            />
          </div>
          {/* Right side - FAQ items */}
          <div className="space-y-10 flex-1">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="last:border-0 border-b border-black pb-4"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between text-left py-4 text-xl font-medium text-gray-900 hover:text-gray-700 transition-colors"
                >
                  <span className="font-semibold font-nunito text-2xl">
                    {item}
                  </span>
                  <motion.div
                    animate={{ rotate: openItems === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6" />
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
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="pb-4 font-roboto text-lg"
                      >
                        <p>
                          This is the answer content for &quot;{item}&quot;. You
                          can add your actual FAQ content here.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {/* {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="last:border-0 border-b border-black pb-4"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between text-left py-4 text-xl font-medium text-gray-900 hover:text-gray-700 transition-colors"
                >
                  <span className="font-semibold font-nunito text-2xl">
                    {item}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-200 ${
                      // openItems.includes(index) ? "rotate-180" : ""
                      openItems === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    // openItems.includes(index)
                    openItems === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-4 font-roboto text-lg">
                    <p>
                      This is the answer content for &quot;{item}&quot;. You can
                      add your actual FAQ content here.
                    </p>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqSection;

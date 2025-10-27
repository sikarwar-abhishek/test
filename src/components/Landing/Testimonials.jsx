"use client";

import { TESTIMONIALS } from "@/src/constants/constant";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % TESTIMONIALS.length
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  return (
    <section className="px-4 sm:px-10 lg:px-20 py-10 sm:py-16 lg:py-20 min-h-screen flex flex-col gap-10 sm:gap-16 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-fdemobold text-gray-900">
          Testimonials
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevTestimonial}
            className="rounded-full cursor-pointer border-[2px] sm:border-[3px] p-2 sm:p-3 
              border-amber-900 text-amber-900 hover:bg-amber-900 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <ArrowLeft size={20} className="sm:size-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="rounded-full cursor-pointer border-[2px] sm:border-[3px] p-2 sm:p-3 
              border-amber-900 text-amber-900 hover:bg-amber-900 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <ArrowRight size={20} className="sm:size-6" />
          </button>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="flex flex-col items-center justify-center w-full overflow-hidden">
        <div className="bg-[#FF7F4C] w-full rounded-xl p-4 sm:p-6 lg:p-8 relative max-h-[420px] overflow-hidden">
          <div
            className={`flex transition-transform duration-500 ease-in-out ${
              isMobile ? "" : "gap-6"
            }`}
            style={{
              transform: isMobile
                ? `translateX(-${currentIndex * 100}%)`
                : `translateX(-${currentIndex * (100 / 3)}%)`, // show 3 at a time in desktop
            }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`flex-none px-2 ${
                  isMobile ? "w-full" : "w-1/3"
                }`}
              >
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg h-full flex flex-col">
                  <p className="text-[#000]/70 line-clamp-8 font-nunito leading-relaxed mb-6 sm:mb-8 flex-grow text-sm sm:text-base">
                    {testimonial.text}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 aspect-square">
                      <Image
                        src={"/asset/mug.jpg"}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-base sm:text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-lg">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

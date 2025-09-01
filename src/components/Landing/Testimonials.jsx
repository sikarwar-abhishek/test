"use client";

import { TESTIMONIALS } from "@/src/constants/constant";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  return (
    <section className="p-20 min-h-screen flex flex-col gap-16 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-fdemobold text-gray-900">Testimonials</h2>
        <div className="flex gap-2">
          <button
            onClick={prevTestimonial}
            className="rounded-full cursor-pointer border-[3px] p-3 border-amber-900 text-amber-900 
  transition-all duration-300 ease-in-out 
  hover:bg-amber-900 hover:text-white hover:scale-105"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={nextTestimonial}
            className="rounded-full cursor-pointer border-[3px] p-3 border-amber-900 text-amber-900 
  transition-all duration-300 ease-in-out 
  hover:bg-amber-900 hover:text-white hover:scale-105"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="flex flex-col items-center justify-center">
        <div className="bg-[#FF7F4C] max-w-full rounded-xl p-8 relative max-h-[360px]">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-6"
            // style={{ transform: `translateX(-${currentIndex * (100 / 6)}%)` }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-none flex shrink-0 transition-transform duration-300 ease-in-out max-w-md"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg h-full flex flex-col">
                  <p className="text-[#000]/70 line-clamp-8 font-nunito leading-relaxed mb-8 flex-grow">
                    {testimonial.text}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 aspect-square">
                      <Image
                        src={"/asset/mug.jpg"}
                        alt={testimonial.name}
                        fill
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-lg">
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

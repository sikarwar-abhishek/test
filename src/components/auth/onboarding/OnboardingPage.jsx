"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { useForm } from "react-hook-form";

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm({
    defaultValues: {
      DOB: "",
      gender: "",
    },
  });

  const handleNext = (data) => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data) => {
    console.log("Onboarding data:", data);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Onboarding Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative aspect-square w-38 h-10">
            <Image
              src={"/asset/logo-black.png"}
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="flex mt-6 flex-col w-full">
          {/* Header */}
          <div className="space-y-2 mb-4 w-full">
            <div className="flex items-center gap-4 mb-4">
              {currentStep === 1 && (
                <button
                  onClick={handleBack}
                  className="p-2 border border-white rounded-full pointer-events-none"
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>
              )}
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
              )}
              <div className="w-full flex justify-between items-center">
                <h1 className="text-3xl flex-1 text-center font-bold font-poppins">
                  Onboarding
                </h1>
                <p className="text-gray-500 text-sm font-medium font-poppins">
                  STEP {currentStep.toString().padStart(2, "0")}/02
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-center font-poppins">
              Few things to know more about you
            </p>
          </div>

          {/* Form Steps */}
          <div className="max-w-lg w-full mx-auto">
            {currentStep === 1 ? (
              <StepOne handleNext={handleNext} form={form} />
            ) : (
              <StepTwo form={form} onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden -z-10 lg:flex flex-1 relative overflow-hidden">
        <div className="fixed w-screen h-screen inset-0 place-content-center">
          <div className="relative w-[calc(80dvw-2rem)] ml-auto mr-4 h-[calc(100dvh-2rem)]">
            <Image
              src="/asset/container.png"
              quality={100}
              priority
              alt="Daily IQ Onboarding"
              fill
              className="w-full h-auto object-fill"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;

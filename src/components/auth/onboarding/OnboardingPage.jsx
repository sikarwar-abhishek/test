"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { getAllTrainingGoals } from "@/src/api/practice";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { completeOnboarding } from "@/src/api/auth";
import Cookies from "js-cookie";

function OnboardingPage({ email, otp, resetState }) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { data } = useQueryHandler(getAllTrainingGoals, {
    queryKey: ["training_goals_all"],
  });

  const { mutate: onboarding, isPending } = useMutationHandler(
    completeOnboarding,
    {
      apiTitle: "Login",
      successMessage: "Logged in successfully!",
      errorMessage: "Login failed. Please try again.",
      onSuccess: async (response) => {
        if (response) {
          Cookies.set("authToken", response?.data?.tokens?.access);
          Cookies.set("refresh_token", response?.data?.tokens?.refresh);
          router.push("/challenges");
        }
      },
      onError: (error) => {
        console.error("Error on onboarding:", error);
        if(error.response.status === 400 && error.response.data.message.includes('Invalid or expired OTP')){
          setTimeout(() => {
            resetState?.()
          }, 1000);
        }
      },
    }
  );
  const form = useForm({
    defaultValues: {
      email,
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
    const finalData = { ...data, otp };
    // console.log(finalData)
    onboarding(finalData);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="space-y-2 mb-4 w-full">
        <div className="grid grid-cols-3 items-center gap-4 mb-4">
          {/* Left side - Back button or empty space */}
          <div className="flex justify-start">
            {currentStep > 1 && (
              <button
                disabled={isPending}
                onClick={handleBack}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex gap-4 sm:flex-row flex-col justify-center items-center">
            {/* Center - Title */}
            <div className="flex justify-center">
              <h1 className="text-3xl font-bold font-poppins">Onboarding</h1>
            </div>

            {/* Right side - Step indicator */}
            <div className="flex justify-end whitespace-nowrap">
              <p className="text-gray-500 text-sm font-medium font-poppins">
                STEP {currentStep.toString().padStart(2, "0")}/02
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-center font-poppins">
          Few things to know more about you
        </p>
      </div>

      {/* Form Steps */}
      <div className="max-w-lg w-full mx-auto mb-16 sm:mb-0">
        {currentStep === 1 ? (
          <StepOne handleNext={handleNext} form={form} />
        ) : (
          <StepTwo
            isPending={isPending}
            goals={data}
            form={form}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;

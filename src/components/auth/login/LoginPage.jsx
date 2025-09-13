"use client";

import { useState } from "react";
import Image from "next/image";
import LoginForm from "./LoginForm";
import OTPStep from "./OTPStep";
import OnboardingPage from "../onboarding/OnboardingPage";
import { useForm } from "react-hook-form";

function LoginPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState("");
  const form = useForm();
  const { watch } = form;
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col px-8 sm:px-12 lg:px-16">
        {/* Logo - Fixed at top */}
        <div className="flex items-center gap-4 pt-8 pb-4">
          <div className="relative aspect-square w-38 h-10">
            <Image
              src={"/asset/logo-black.png"}
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Form Container - Centered */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {currentStep === 1 && (
              <LoginForm setCurrentStep={setCurrentStep} form={form} />
            )}
            {currentStep === 2 && (
              <OTPStep
                key="otp"
                otp={otp}
                setOtp={setOtp}
                email={watch("email")}
                setCurrentStep={setCurrentStep}
              />
            )}
            {currentStep === 3 && (
              <OnboardingPage email={watch("email")} otp={otp} />
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden -z-10 lg:flex flex-1 relative overflow-hidden">
        <div className="fixed w-screen h-screen inset-0 place-content-center">
          <div className="rounded-xl relative w-[calc(80dvw-2rem)] ml-auto mr-4 h-[calc(100dvh-2rem)]">
            <Image
              src="/asset/container.png"
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

export default LoginPage;

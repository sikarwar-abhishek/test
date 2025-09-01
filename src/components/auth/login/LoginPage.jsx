"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import LoginForm from "./LoginForm";

function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
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
        <div className="flex mt-2 flex-col w-full">
          {/* Header */}
          <div className="text-center font-poppins space-y-2 my-4">
            <h1 className="text-3xl font-bold">Get Started</h1>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="max-w-lg w-full mx-auto">
            <LoginForm />
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

export default LoginPage;

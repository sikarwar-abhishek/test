"use client";

import { useForm } from "react-hook-form";
import Form from "../../common/Form";
import FormRow from "../../common/FormRow";
import isEmail from "validator/lib/isEmail";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function LoginForm() {
  const { register, handleSubmit, formState } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="">
      {/* Email Field */}
      <FormRow error={errors?.email?.message}>
        <label
          htmlFor="email"
          className="block font-poppins text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@example.com"
          className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
          {...register("email", {
            required: "Please Enter Your Email!",
            validate: (value) => isEmail(value) || "Please enter valid email!",
          })}
        />
      </FormRow>

      {/* Password Field */}
      <FormRow error={errors?.password?.message}>
        <label
          htmlFor="password"
          className="block font-poppins text-gray-700 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
            {...register("password", {
              required: "Please Enter Your Password!",
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </FormRow>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer relative">
          <div className="flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-[#FF7F4C] checked:border-[#FF7F4C]"
              id="check1"
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </div>
          <span className="ml-2 font-opensans text-sm text-gray-600">
            Remember me
          </span>
        </label>

        <a
          href="#"
          className="text-sm font-opensans font-medium hover:underline text-blue-500 hover:text-blue-600"
        >
          Forgot your password?
        </a>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold font-poppins hover:bg-blue-600 transition-colors"
      >
        Login
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white font-inter font-semibold text-gray-500">
            OR
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700 font-poppins font-medium">
            Login with Google
          </span>
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span className="text-gray-700 font-poppins font-medium">
            Continue with Apple
          </span>
        </button>
      </div>
    </Form>
  );
}

export default LoginForm;

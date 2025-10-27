"use client";

import { ArrowRight } from "lucide-react";
import Form from "../../common/Form";
import FormRow from "../../common/FormRow";
import { Controller } from "react-hook-form";
import SearchableCountryCodeDropdown from "../../common/SearchableCountryCodeDropdown";

function StepOne({ handleNext, form }) {
  const { register, handleSubmit, formState, control,trigger } = form;
  const { errors, isValid } = formState;

  return (
    <Form onSubmit={handleSubmit(handleNext)}>
      {/* First Name Field */}
      <FormRow error={errors?.first_name?.message}>
        <label
          htmlFor="firstName"
          className="block font-poppins text-gray-700 mb-2"
        >
          First Name*
        </label>
        <input
          id="firstName"
          type="text"
          placeholder="Type Here"
          className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
          {...register("first_name", {
            required: "Please Enter Your First Name!",
            onChange: () => trigger("first_name"),
          })}
        />
      </FormRow>

      {/* Last Name Field */}
      <FormRow error={errors?.last_name?.message}>
        <label
          htmlFor="lastName"
          className="block font-poppins text-gray-700 mb-2"
        >
          Last Name*
        </label>
        <input
          id="lastName"
          type="text"
          placeholder="Type Here"
          className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
          {...register("last_name", {
            required: "Please Enter Your Last Name!",
            onChange: () => trigger("last_name"),
          })}
        />
      </FormRow>

      {/* Phone Number Field */}
      <FormRow
        error={errors?.phone_number?.message || errors?.country_code?.message}
      >
        <label
          htmlFor="phone_number"
          className="block font-poppins text-gray-700 mb-2"
        >
          Phone Number*
        </label>
        <div className="flex gap-2">
          <Controller
            name="country_code"
            control={control}
            rules={{
              required: "Please select country code!",
              onChange: () => trigger("country_code"),
            }}
            defaultValue="+91"
            render={({ field: { onChange, value } }) => (
              <SearchableCountryCodeDropdown
                value={value}
                onChange={onChange}
                placeholder="+91"
                className="max-w-20 sm:max-w-24 bg-[#E7EEFF80] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            )}
          />

          <input
            id="phone_number"
            type="tel"
            placeholder="Enter phone number"
            className="max-w-fit sm:flex-1 sm:max-w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
            {...register("phone_number", {
              required: "Please Enter Your Phone Number!",
              validate: (value) => {
                if (value.length > 17) {
                  setValue("phone_number", value.slice(0, 17));
                  return true;
                }
                if (value.length < 4)
                  return "Minimum 4 digits required!";
                return true;
              },
              onChange: () => trigger("phone_number"),
            })}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
          />
        </div>
      </FormRow>

      {/* Age */}
      <FormRow error={errors?.age?.message}>
        <label htmlFor="age" className="block font-poppins text-gray-700 mb-2">
          Age*
        </label>
        <input
          id="age"
          type="number"
          placeholder="Enter Age"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
            if (e.target.value.length > 2) {
              e.target.value = e.target.value.slice(0, 2);
            }
          }}
          className="w-full px-4 py-3 remove-inner-scroll font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
          {...register("age", {
            required: "Please Enter Your Age!",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Age must be at least 1",
            },
            max: {
              value: 100,
            },
            onChange: () => trigger("age"),
          })}
        />
      </FormRow>
      {/* Next Button */}
      <button
        type="submit"
        disabled={!isValid}
        className="w-full bg-white disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded-lg font-semibold font-poppins hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
      >
        Next
        <ArrowRight size={20} />
      </button>
    </Form>
  );
}

export default StepOne;

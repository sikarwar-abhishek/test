import { ArrowRight } from "lucide-react";
import DateInput from "../../common/DateInput";
import Form from "../../common/Form";
import FormRow from "../../common/FormRow";
import isEmail from "validator/lib/isEmail";
import { Controller } from "react-hook-form";
import { isMobilePhone, isMobilePhoneLocales } from "validator";

function StepOne({ handleNext, form }) {
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <Form onSubmit={handleSubmit(handleNext)} className="">
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
          })}
        />
      </FormRow>

      {/* Email Field */}
      <FormRow error={errors?.phone_number?.message}>
        <label
          htmlFor="phone_number"
          className="block font-poppins text-gray-700 mb-2"
        >
          Phone Number*
        </label>
        <input
          id="phone_number"
          type="tel"
          placeholder="Type Here"
          maxLength={10}
          className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
          {...register("phone_number", {
            required: "Please Enter Your Phone Number!",
            validate: (value) => {
              // Check if it's exactly 10 digits
              if (!/^\d{10}$/.test(value)) {
                return "Phone number must be exactly 10 digits!";
              }
              // Additional validation using validator library for Indian mobile numbers
              if (!isMobilePhone(value, "en-IN")) {
                return "Please enter a valid phone number!";
              }
              return true;
            },
          })}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
          }}
        />
      </FormRow>

      {/* Date of Birth Field */}
      <FormRow error={errors?.DOB?.message}>
        <label
          htmlFor="dateOfBirth"
          className="block font-poppins text-gray-700 mb-2"
        >
          Date of Birth*
        </label>
        <Controller
          name="DOB"
          control={control}
          rules={{
            required: "Date is required",
          }}
          render={({ field: { onChange, value, name } }) => (
            <DateInput
              id={name}
              value={value}
              onChange={onChange}
              placeholder="DD-MM-YYYY"
              required
              displayFormat="DD-MM-YYYY"
              valueFormat="YYYY-MM-DD"
            />
          )}
        />
      </FormRow>

      {/* Next Button */}
      <button
        type="submit"
        className="w-full bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded-lg font-semibold font-poppins hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
      >
        Next
        <ArrowRight size={20} />
      </button>
    </Form>
  );
}

export default StepOne;

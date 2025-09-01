import { ArrowRight } from "lucide-react";
import DateInput from "../../common/DateInput";
import Form from "../../common/Form";
import FormRow from "../../common/FormRow";
import isEmail from "validator/lib/isEmail";
import { isDate } from "date-fns";
import { Controller } from "react-hook-form";

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
      <FormRow error={errors?.email?.message}>
        <label
          htmlFor="email"
          className="block font-poppins text-gray-700 mb-2"
        >
          Email ID
        </label>
        <input
          id="email"
          type="email"
          placeholder="Type Here"
          className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
          {...register("email", {
            required: "Please Enter Your Email!",
            validate: (value) => isEmail(value) || "Please enter valid email!",
          })}
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
              placeholder="Select date"
              required
            />
          )}
        />
      </FormRow>

      {/* Next Button */}
      <button
        type="submit"
        className="w-full bg-white text-blue-500 border border-blue-500 py-3 px-4 rounded-lg font-semibold font-poppins hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
      >
        Next
        <ArrowRight size={20} />
      </button>
    </Form>
  );
}

export default StepOne;

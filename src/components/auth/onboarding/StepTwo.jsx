import { ChevronDown } from "lucide-react";
import Form from "../../common/Form";
import FormRow from "../../common/FormRow";
import { Controller } from "react-hook-form";
import MultiSelectDropdown from "../../common/MultiSelectDropdown";

function StepTwo({ form, onSubmit }) {
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="">
      {/* Gender Field */}
      <FormRow error={errors?.gender?.message}>
        <label
          htmlFor="gender"
          className="block font-poppins text-gray-700 mb-2"
        >
          Gender*
        </label>
        <div className="relative">
          <select
            id="gender"
            className="w-full px-4 py-3 pr-12 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80] appearance-none"
            {...register("gender", {
              required: "Please specify your gender!",
            })}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </FormRow>

      {/* Location Field */}
      <FormRow error={errors?.location?.message}>
        <label
          htmlFor="location"
          className="block font-poppins text-gray-700 mb-2"
        >
          Location*
        </label>
        <input
          id="location"
          type="text"
          placeholder="Type Here"
          className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
          {...register("location", {
            required: "Please specify location!",
          })}
        />
      </FormRow>

      {/* Job Profile Field */}
      <FormRow error={errors?.job_profile?.message}>
        <label
          htmlFor="jobProfile"
          className="block font-poppins text-gray-700 mb-2"
        >
          Job Profile
        </label>
        <input
          id="jobProfile"
          type="text"
          placeholder="Type Here"
          className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
          {...register("job_profile", {
            required: "Please specify job profile!",
          })}
        />
      </FormRow>

      {/* Goals Field */}
      <FormRow error={errors?.goals?.message}>
        <label
          htmlFor="goals"
          className="block font-poppins text-gray-700 mb-2"
        >
          Goals*
        </label>
        <Controller
          name="goals"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <MultiSelectDropdown
              id="goals"
              value={value}
              onChange={onChange}
              placeholder="Select your goals"
              options={[
                {
                  value: "improve-cognitive-skills",
                  label: "Improve Critical Thinking",
                },
                {
                  value: "daily-brain-training",
                  label: "Develop Logic Skills",
                },
                {
                  value: "compete-with-others",
                  label: "Enhance Numerical Ability",
                },
                { value: "learn-new-skills", label: "Boost Verbal Skills" },
              ]}
            />
          )}
        />
        {/* <MultiSelectDropdown
          id="goals"
          value={formData.goals || []}
          onChange={(value) => handleInputChange("goals", value)}
          placeholder="Select your goals"
          required
          options={[
            {
              value: "improve-cognitive-skills",
              label: "Improve Critical Thinking",
            },
            { value: "daily-brain-training", label: "Develop Logic Skills" },
            {
              value: "compete-with-others",
              label: "Enhance Numerical Ability",
            },
            { value: "learn-new-skills", label: "Boost Verbal Skills" },
          ]}
        /> */}
      </FormRow>

      {/* Finish Button */}
      <button
        type="submit"
        className="w-full bg-white text-blue-500 border border-blue-500 py-3 px-4 rounded-lg font-semibold font-poppins hover:bg-blue-50 transition-colors"
      >
        Finish
      </button>
    </Form>
  );
}

export default StepTwo;

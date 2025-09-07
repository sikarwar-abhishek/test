import { ChevronDown } from "lucide-react";
import Form from "../../common/Form";
import FormRow from "../../common/FormRow";
import { Controller } from "react-hook-form";
import MultiSelectDropdown from "../../common/MultiSelectDropdown";
import { useState } from "react";
import { LOCATIONS, AVAILABLE_JOBPROFILES } from "@/src/constants/constant";

const cities = LOCATIONS;

function StepTwo({ isPending, goals, form, onSubmit }) {
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [jobProfileQuery, setJobProfileQuery] = useState("");
  const [showJobProfileDropdown, setShowJobProfileDropdown] = useState(false);

  const options = goals?.map((goal) => ({ value: goal.id, label: goal.name }));
  const { register, control, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  const filteredCities =
    cities?.filter((city) =>
      city.toLowerCase().includes(locationQuery.toLowerCase())
    ) || [];

  const filteredJobProfiles =
    AVAILABLE_JOBPROFILES?.filter((profile) =>
      profile.toLowerCase().includes(jobProfileQuery.toLowerCase())
    ) || [];

  const handleLocationSelect = (city) => {
    setValue("location", city);
    setLocationQuery(city);
    setShowLocationDropdown(false);
  };

  const handleJobProfileSelect = (profile) => {
    setValue("job_profile", profile);
    setJobProfileQuery(profile);
    setShowJobProfileDropdown(false);
  };

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
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
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
        <div className="relative">
          <Controller
            name="location"
            control={control}
            rules={{
              required: "Please specify location!",
            }}
            render={({ field: { onChange, value, name } }) => (
              <>
                <input
                  id={name}
                  type="text"
                  placeholder="Type Here"
                  value={locationQuery}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setLocationQuery(inputValue);
                    onChange(inputValue);
                    setShowLocationDropdown(inputValue.length > 0);
                  }}
                  onFocus={() =>
                    locationQuery.length > 0 && setShowLocationDropdown(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowLocationDropdown(false), 200)
                  }
                  className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
                />
                {showLocationDropdown && filteredCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city}
                        onClick={() => {
                          onChange(city);
                          setLocationQuery(city);
                          setShowLocationDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-inter text-sm"
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          />
        </div>
      </FormRow>

      {/* Job Profile Field */}
      <FormRow error={errors?.job_profile?.message}>
        <label
          htmlFor="jobProfile"
          className="block font-poppins text-gray-700 mb-2"
        >
          Job Profile
        </label>
        <div className="relative">
          <Controller
            name="job_profile"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <>
                <input
                  id={name}
                  type="text"
                  placeholder="Type Here"
                  value={jobProfileQuery}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setJobProfileQuery(inputValue);
                    onChange(inputValue);
                    setShowJobProfileDropdown(inputValue.length > 0);
                  }}
                  onFocus={() =>
                    jobProfileQuery.length > 0 &&
                    setShowJobProfileDropdown(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowJobProfileDropdown(false), 200)
                  }
                  className="w-full px-4 py-3 font-inter border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80]"
                />
                {showJobProfileDropdown && filteredJobProfiles.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredJobProfiles.slice(0, 10).map((profile) => (
                      <div
                        key={profile}
                        onClick={() => {
                          onChange(profile);
                          setJobProfileQuery(profile);
                          setShowJobProfileDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-inter text-sm"
                      >
                        {profile}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          />
        </div>
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
            <div className="relative">
              <MultiSelectDropdown
                id="goals"
                value={value}
                onChange={onChange}
                placeholder="Select your goals"
                options={options}
              />
            </div>
          )}
        />
      </FormRow>

      {/* Finish Button */}
      <button
        disabled={isPending}
        type="submit"
        className="w-full bg-white text-blue-500 border border-blue-500 py-2 px-4 rounded-lg font-semibold font-poppins hover:bg-blue-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
        {isPending ? "Please wait..." : "Finish"}
      </button>
    </Form>
  );
}

export default StepTwo;

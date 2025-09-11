import { ChevronDown } from "lucide-react";
import Form from "../../common/Form";
import FormRow from "../../common/FormRow";
import { Controller } from "react-hook-form";
import MultiSelectDropdown from "../../common/MultiSelectDropdown";
import { useState, useEffect } from "react";
import { LOCATIONS, AVAILABLE_JOBPROFILES } from "@/src/constants/constant";

const cities = LOCATIONS;

function StepTwo({ isPending, goals, form, onSubmit }) {
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [jobProfileQuery, setJobProfileQuery] = useState("");
  const [showJobProfileDropdown, setShowJobProfileDropdown] = useState(false);
  const [locationClearTimeout, setLocationClearTimeout] = useState(null);
  const [jobProfileClearTimeout, setJobProfileClearTimeout] = useState(null);

  const options = goals?.map((goal) => ({ value: goal.id, label: goal.name }));
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    setError,
    clearErrors,
  } = form;
  const { errors } = formState;

  // Watch form values to validate selections
  const locationValue = watch("location");
  const jobProfileValue = watch("job_profile");

  // Validate location selection
  useEffect(() => {
    if (locationValue && !LOCATIONS.includes(locationValue)) {
      setError("location", {
        type: "manual",
        message: "Please select a valid location from the dropdown list",
      });
    } else if (locationValue && LOCATIONS.includes(locationValue)) {
      clearErrors("location");
    }
  }, [locationValue, setError, clearErrors]);

  // Validate job profile selection
  useEffect(() => {
    if (jobProfileValue && !AVAILABLE_JOBPROFILES.includes(jobProfileValue)) {
      setError("job_profile", {
        type: "manual",
        message: "Please select a valid job profile from the dropdown list",
      });
    } else if (
      jobProfileValue &&
      AVAILABLE_JOBPROFILES.includes(jobProfileValue)
    ) {
      clearErrors("job_profile");
    }
  }, [jobProfileValue, setError, clearErrors]);

  // Initialize query states with existing form values
  useEffect(() => {
    if (locationValue && LOCATIONS.includes(locationValue)) {
      setLocationQuery(locationValue);
    }
  }, [locationValue]);

  useEffect(() => {
    if (jobProfileValue && AVAILABLE_JOBPROFILES.includes(jobProfileValue)) {
      setJobProfileQuery(jobProfileValue);
    }
  }, [jobProfileValue]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (locationClearTimeout) {
        clearTimeout(locationClearTimeout);
      }
      if (jobProfileClearTimeout) {
        clearTimeout(jobProfileClearTimeout);
      }
    };
  }, [locationClearTimeout, jobProfileClearTimeout]);

  const filteredCities =
    cities?.filter((city) =>
      city.toLowerCase().includes(locationQuery.toLowerCase())
    ) || [];

  const filteredJobProfiles =
    AVAILABLE_JOBPROFILES?.filter((profile) =>
      profile.toLowerCase().includes(jobProfileQuery.toLowerCase())
    ) || [];

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
                  placeholder="Type to search locations..."
                  value={locationQuery}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setLocationQuery(inputValue);

                    // Clear any existing timeout
                    if (locationClearTimeout) {
                      clearTimeout(locationClearTimeout);
                    }

                    // Only update form value if it's a valid selection
                    if (LOCATIONS.includes(inputValue)) {
                      onChange(inputValue);
                    } else {
                      // Clear form value if input doesn't match any location
                      onChange("");

                      // Set timeout to clear input if no valid selection after 2 seconds
                      if (inputValue.length > 0) {
                        const timeout = setTimeout(() => {
                          const hasMatch = LOCATIONS.some((location) =>
                            location
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          );
                          if (!hasMatch) {
                            setLocationQuery("");
                          }
                        }, 2000);
                        setLocationClearTimeout(timeout);
                      }
                    }

                    setShowLocationDropdown(inputValue.length > 0);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowLocationDropdown(false);
                      // Clear input if no valid selection was made
                      if (locationQuery && !LOCATIONS.includes(locationQuery)) {
                        setLocationQuery("");
                      }
                    }, 200);
                  }}
                  onFocus={() => {
                    setShowLocationDropdown(true);
                  }}
                  className={`w-full px-4 py-3 font-inter border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80] ${
                    errors?.location ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {showLocationDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <div
                          key={city}
                          onMouseDown={() => {
                            onChange(city);
                            setLocationQuery(city);
                            setShowLocationDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-inter text-sm"
                        >
                          {city}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 font-inter text-sm">
                        No locations found. Please select from available
                        options.
                      </div>
                    )}
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
                  placeholder="Type to search job profiles..."
                  value={jobProfileQuery}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setJobProfileQuery(inputValue);

                    // Clear any existing timeout
                    if (jobProfileClearTimeout) {
                      clearTimeout(jobProfileClearTimeout);
                    }

                    // Only update form value if it's a valid selection
                    if (AVAILABLE_JOBPROFILES.includes(inputValue)) {
                      onChange(inputValue);
                    } else {
                      // Clear form value if input doesn't match any job profile
                      onChange("");

                      // Set timeout to clear input if no valid selection after 2 seconds
                      if (inputValue.length > 0) {
                        const timeout = setTimeout(() => {
                          const hasMatch = AVAILABLE_JOBPROFILES.some(
                            (profile) =>
                              profile
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                          );
                          if (!hasMatch) {
                            setJobProfileQuery("");
                          }
                        }, 2000);
                        setJobProfileClearTimeout(timeout);
                      }
                    }

                    setShowJobProfileDropdown(inputValue.length > 0);
                  }}
                  onFocus={() => {
                    setShowJobProfileDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowJobProfileDropdown(false);
                      // Clear input if no valid selection was made
                      if (
                        jobProfileQuery &&
                        !AVAILABLE_JOBPROFILES.includes(jobProfileQuery)
                      ) {
                        setJobProfileQuery("");
                      }
                    }, 200);
                  }}
                  className={`w-full px-4 py-3 font-inter border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-[#E7EEFF80] ${
                    errors?.job_profile ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {showJobProfileDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredJobProfiles.length > 0 ? (
                      filteredJobProfiles.map((profile) => (
                        <div
                          key={profile}
                          onMouseDown={() => {
                            onChange(profile);
                            setJobProfileQuery(profile);
                            setShowJobProfileDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-inter text-sm"
                        >
                          {profile}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 font-inter text-sm">
                        No job profiles found. Please select from available
                        options.
                      </div>
                    )}
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

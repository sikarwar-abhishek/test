"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import Form from "../common/Form";
import FormRow from "../common/FormRow";
import DateInput from "../common/DateInput";
import MultiSelectDropdown from "../common/MultiSelectDropdown";
import useQueryHandler from "@/src/hooks/useQueryHandler";
import { useMutationHandler } from "@/src/hooks/useMutationHandler";
import { getUserProfile, updateProfile } from "@/src/api/auth";
import { getAllTrainingGoals } from "@/src/api/practice";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  AVAILABLE_JOBPROFILES,
} from "@/src/constants/constant";
import SearchableCountryCodeDropdown from "../common/SearchableCountryCodeDropdown";
import Link from "next/link";
function EditProfile({ onBack }) {
  const queryClient = useQueryClient();
  const [jobProfileQuery, setJobProfileQuery] = useState("");
  const [showJobProfileDropdown, setShowJobProfileDropdown] = useState(false);
  const { data: userData } = useQueryHandler(getUserProfile, {
    queryKey: ["user_profile"],
  });
  const { data } = userData;

  const { data: goals } = useQueryHandler(getAllTrainingGoals, {
    queryKey: ["training_goals_all"],
  });

  const { mutate: update, isPending: isUpdating } = useMutationHandler(
    updateProfile,
    {
      apiTitle: "Login",
      successMessage: "Logged in successfully!",
      errorMessage: "Login failed. Please try again.",
      onSuccess: async (response) => {
        if (response) {
          toast.success("Profile Updated Successfully!");
          queryClient.invalidateQueries(["user_profile"]);
        }
      },
    }
  );

  const defaultValues = {
    email: data.email,
    country_code: data?.country_code ?? '',
    phone_number: data.phone_number,
    first_name: data.first_name,
    last_name: data.last_name,
    age: data.age,
    gender: data.gender,
    job_profile: data.job_profile,
    goals: data.goals,
  };
  // Form setup with default values
  const form = useForm({
    defaultValues,
  });

  const { register, control, handleSubmit, formState, setValue, watch, trigger } = form;
  const { errors, isValid } = formState;

  // Initialize query states when data loads and validate job profile
  useEffect(() => {
    if (data) {
      setJobProfileQuery(data.job_profile || "");

      // Check if job profile from default value exists in available profiles
      if (data.job_profile && !AVAILABLE_JOBPROFILES.includes(data.job_profile)) {
        // If job profile is not in the list, clear it
        setValue("job_profile", "");
        setJobProfileQuery("");
      }
    }
  }, [data, setValue]);

  // Prepare options for goals dropdown
  const goalOptions =
    goals?.map((goal) => ({ value: goal.id, label: goal.name })) || [];

  // Filter cities for location dropdown
  // const filteredCities =
  //   cities?.filter((city) =>
  //     city.toLowerCase().includes(locationQuery.toLowerCase())
  //   ) || [];

  const filteredJobProfiles =
    AVAILABLE_JOBPROFILES?.filter((profile) =>
      profile.toLowerCase().includes(jobProfileQuery.toLowerCase())
    ) || [];

  const onSubmit = (data) => {
    update(data);
  };

  // console.log(watch("phone_number"), watch("country_code"));
  return (
    <div className="">
      {/* Header */}
      <h1 className="sm:text-xl font-semibold text-gray-600 sm:mb-8 mb-4 font-poppins">
        Edit Profile
      </h1>

      <Form onSubmit={handleSubmit(onSubmit)} className="mb-12 sm:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-6 sm:mb-6">
          <FormRow error={errors?.first_name?.message}>
            <input
              type="text"
              placeholder="First name*"
              disabled={isUpdating}
              className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed"
              {...register("first_name", {
                required: "Please Enter Your First Name!",
                validate: (value) => {
                  if (value.length > 50) return "First name must be 50 characters or less";
                  return true;
                },
                onChange: () => trigger("first_name"),
              })}
            />
          </FormRow>

          <FormRow error={errors?.last_name?.message}>
            <input
              type="text"
              placeholder="Last name*"
              disabled={isUpdating}
              className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed"
              {...register("last_name", {
                required: "Please Enter Your Last Name!",
                validate: (value) => {
                  if (value.length > 50) return "Last name must be 50 characters or less";
                  return true;
                },
                onChange: () => trigger("last_name"),
              })}
            />
          </FormRow>
        </div>

        {/* Second Row - Email and Date of Birth */}
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-6 sm:mb-6">
          <FormRow>
            <input
              type="email"
              value={watch("email")}
              className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 bg-blue-50 text-black cursor-not-allowed pointer-events-none"
              readOnly
            />
          </FormRow>

          <FormRow
            error={
              errors?.phone_number?.message || errors?.country_code?.message
            }
          >
            <div className="flex gap-2">
              {/* Country Code Dropdown */}
              <Controller
                name="country_code"
                control={control}
                rules={{
                  required: "Please select country code!",
                }}
                render={({ field: { onChange, value } }) => (
                  <SearchableCountryCodeDropdown
                    value={value}
                    onChange={(newValue) => {
                      onChange(newValue);
                      // Trigger validation when country code changes
                      trigger("country_code");
                    }}
                    disabled={isUpdating}
                    placeholder="+91"
                    className="focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2]"
                  />
                )}
              />

              {/* Phone Number Input */}
              <input
                id="phone_number"
                type="tel"
                disabled={isUpdating}
                placeholder="Enter phone number"
                className="w-full max-w-md sm:max-w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed"
                {...register("phone_number", {
                  required: "Please Enter Your Phone Number!",
                  validate: (value) => {
                    // after 17 digit trim phone number to contain only 17 digit
                    if (value.length > 17) {
                      setValue("phone_number", value.slice(0, 17));
                      return true;
                    }
                    if (value.length < 4)
                      return "Minimum 4 digits required!";
                    return true;
                  },
                })}
                onInput={(e) => {
                  // Allow only numbers
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  // Trigger validation when phone number changes
                  trigger("phone_number");
                }}
              />
            </div>
          </FormRow>

          {/* <FormRow error={errors?.DOB?.message}>
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
                  placeholder="Date of birth"
                  required
                  disabled={isUpdating}
                  displayFormat="DD-MM-YYYY"
                  valueFormat="YYYY-MM-DD"
                  className="border-none font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 bg-[#F5F5F5B2]"
                />
              )}
            />
          </FormRow> */}
        </div>

        {/* Third Row - Gender and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-6 sm:mb-6">
          <FormRow error={errors?.gender?.message}>
            <div className="relative">
              <select
                disabled={isUpdating}
                className="w-full px-4 py-3 pr-12 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                {...register("gender", {
                  required: "Please specify your gender!",
                  onChange: () => trigger("gender"),
                })}
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </FormRow>

          {/* <FormRow error={errors?.location?.message}>
            <div className="relative">
              <Controller
                name="location"
                control={control}
                rules={{
                  required: "Please specify location!",
                  validate: (value) => {
                    if (!value) return "Please specify location!";
                    if (!cities.includes(value)) {
                      return "Please select a valid location from the list";
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, value, name } }) => {
                  const displayValue =
                    locationQuery !== "" ? locationQuery : value || "";

                  return (
                    <>
                      <input
                        id={name}
                        type="text"
                        placeholder="Location"
                        disabled={isUpdating}
                        value={displayValue}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setLocationQuery(inputValue);
                          if (
                            inputValue === "" ||
                            cities.includes(inputValue)
                          ) {
                            onChange(inputValue);
                          }
                          setShowLocationDropdown(inputValue.length > 0);
                        }}
                        onFocus={() => {
                          const currentValue =
                            locationQuery !== "" ? locationQuery : value || "";
                          if (currentValue.length > 0) {
                            setShowLocationDropdown(true);
                          }
                        }}
                        onBlur={() => {
                          setLocationQuery("");
                          setShowLocationDropdown(false);
                        }}
                        className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {showLocationDropdown &&
                        filteredCities.length > 0 &&
                        !isUpdating && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredCities.map((city) => (
                              <div
                                key={city}
                                onMouseDown={() => {
                                  onChange(city);
                                  setLocationQuery(city);
                                  setShowLocationDropdown(false);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-poppins text-sm"
                              >
                                {city}
                              </div>
                            ))}
                          </div>
                        )}
                    </>
                  );
                }}
              />
            </div>
          </FormRow> */}
          <FormRow error={errors?.job_profile?.message}>
            <div className="relative">
              <Controller
                name="job_profile"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) {
                      return "Please select a job profile!";
                    }
                    if (value && !AVAILABLE_JOBPROFILES.includes(value)) {
                      return "Please select a valid job profile from the list";
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, value, name } }) => {
                  const displayValue =
                    jobProfileQuery !== "" ? jobProfileQuery : value || "";

                  return (
                    <>
                      <input
                        id={name}
                        type="text"
                        placeholder="Job profile*"
                        disabled={isUpdating}
                        value={displayValue}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setJobProfileQuery(inputValue);
                          // Only update form value if it's a valid job profile or empty
                          if (
                            inputValue === "" ||
                            AVAILABLE_JOBPROFILES.includes(inputValue)
                          ) {
                            onChange(inputValue);
                          }
                          setShowJobProfileDropdown(true);
                          // Trigger validation when job profile changes
                          trigger("job_profile");
                        }}
                        onFocus={() => {
                          // const currentValue =
                          //   jobProfileQuery !== ""
                          //     ? jobProfileQuery
                          //     : value || "";
                          // if (currentValue.length > 0) {
                          setShowJobProfileDropdown(true);
                          // }
                        }}
                        onBlur={() => {
                          setJobProfileQuery("");
                          setShowJobProfileDropdown(false);
                          // Trigger validation when field loses focus
                          trigger("job_profile");
                        }}
                        className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {showJobProfileDropdown &&
                        filteredJobProfiles.length > 0 &&
                        !isUpdating && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredJobProfiles.map((profile) => (
                              <div
                                key={profile}
                                onMouseDown={() => {
                                  onChange(profile);
                                  setJobProfileQuery(profile);
                                  setShowJobProfileDropdown(false);
                                  // Trigger validation when job profile is selected
                                  trigger("job_profile");
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-poppins text-sm"
                              >
                                {profile}
                              </div>
                            ))}
                          </div>
                        )}
                    </>
                  );
                }}
              />
            </div>
          </FormRow>
        </div>

        {/* Fourth Row - Job Profile and Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-6">
          <FormRow error={errors?.age?.message}>
            <input
              id="age"
              disabled={isUpdating}
              type="number"
              placeholder="Enter Age*"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                if (e.target.value.length > 2) {
                  e.target.value = e.target.value.slice(0, 2);
                }
                if (e.target.value == 0) {
                  e.target.value = "";
                }
                // Trigger validation when age changes
                trigger("age");
              }}
              className="w-full px-4 py-3 remove-inner-scroll font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed remove-inner-scroll"
              {...register("age", {
                required: "Please Enter Your Age!",
                valueAsNumber: true,
                validate: (value) => {
                  if (!value) return "Please Enter Your Age!";
                  if (value < 1) return "Age must be at least 1";
                  if (value > 100) return "Age must be 100 or less";
                  return true;
                },
              })}
            />
          </FormRow>

          <FormRow error={errors?.goals?.message}>
            <Controller
              name="goals"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="relative">
                  <MultiSelectDropdown
                    id="goals"
                    value={value}
                    onChange={onChange}
                    placeholder="Goals"
                    options={goalOptions}
                    disabled={isUpdating}
                    className="border-none font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 bg-[#F5F5F5B2]"
                  />
                </div>
              )}
            />
          </FormRow>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <Link
            href={"/myprofile"}
            type="button"
            className="w-full text-center sm:w-auto px-8 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-poppins font-medium"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={isUpdating || !isValid}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-poppins font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUpdating && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isUpdating ? "Saving..." : "Save Updates"}
          </button>
        </div>
      </Form>
    </div>
  );
}

export default EditProfile;

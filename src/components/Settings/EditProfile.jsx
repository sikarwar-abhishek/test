"use client";

import { useState } from "react";
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
import { AVAILABLE_JOBPROFILES, LOCATIONS } from "@/src/constants/constant";

const cities = LOCATIONS;

function EditProfile({ onBack }) {
  const queryClient = useQueryClient();
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
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
          toast.success("profile updated successfully!");
          queryClient.invalidateQueries(["user_profile"]);
        }
      },
    }
  );

  const defaultValues = {
    email: data.email,
    phone_number: data.phone_number,
    first_name: data.first_name,
    last_name: data.last_name,
    DOB: data.DOB,
    gender: data.gender,
    job_profile: data.job_profile,
    goals: data.goals,
    location: data.location,
  };
  // Form setup with default values
  const form = useForm({
    defaultValues,
  });

  const { register, control, handleSubmit, formState, setValue, watch } = form;
  const { errors } = formState;

  // Prepare options for goals dropdown
  const goalOptions =
    goals?.map((goal) => ({ value: goal.id, label: goal.name })) || [];

  // Filter cities for location dropdown
  const filteredCities =
    cities?.filter((city) =>
      city.toLowerCase().includes(locationQuery.toLowerCase())
    ) || [];
  const filteredJobProfiles =
    AVAILABLE_JOBPROFILES?.filter((profile) =>
      profile.toLowerCase().includes(jobProfileQuery.toLowerCase())
    ) || [];

  const onSubmit = (data) => {
    console.log("Profile update data:", data);
    update(data);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-600 mb-8 font-poppins">
        Edit Profile
      </h1>

      <Form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormRow error={errors?.first_name?.message}>
            <input
              type="text"
              placeholder="First name*"
              disabled={isUpdating}
              className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed"
              {...register("first_name", {
                required: "Please Enter Your First Name!",
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
              })}
            />
          </FormRow>
        </div>

        {/* Second Row - Email and Date of Birth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormRow>
            <input
              type="email"
              value={watch("email")}
              className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 bg-blue-50 text-black cursor-not-allowed pointer-events-none"
              readOnly
            />
          </FormRow>

          <FormRow error={errors?.DOB?.message}>
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
          </FormRow>
        </div>

        {/* Third Row - Gender and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormRow error={errors?.gender?.message}>
            <div className="relative">
              <select
                disabled={isUpdating}
                className="w-full px-4 py-3 pr-12 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                {...register("gender", {
                  required: "Please specify your gender!",
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

          <FormRow error={errors?.location?.message}>
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
                      placeholder="Location"
                      disabled={isUpdating}
                      value={locationQuery || value}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        setLocationQuery(inputValue);
                        onChange(inputValue);
                        setShowLocationDropdown(inputValue.length > 0);
                      }}
                      onFocus={() =>
                        locationQuery.length > 0 &&
                        setShowLocationDropdown(true)
                      }
                      onBlur={() =>
                        setTimeout(() => setShowLocationDropdown(false), 200)
                      }
                      className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {showLocationDropdown &&
                      filteredCities.length > 0 &&
                      !isUpdating && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredCities.map((city) => (
                            <div
                              key={city}
                              onClick={() => {
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
                )}
              />
            </div>
          </FormRow>
        </div>

        {/* Fourth Row - Job Profile and Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FormRow error={errors?.job_profile?.message}>
            <div className="relative">
              <Controller
                name="job_profile"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <>
                    <input
                      id={name}
                      type="text"
                      placeholder="Job profile"
                      disabled={isUpdating}
                      value={jobProfileQuery || value}
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
                      className="w-full px-4 py-3 font-poppins drop-shadow-sm rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-transparent outline-none transition-all bg-[#F5F5F5B2] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {showJobProfileDropdown &&
                      filteredJobProfiles.length > 0 &&
                      !isUpdating && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredJobProfiles.slice(0, 10).map((profile) => (
                            <div
                              key={profile}
                              onClick={() => {
                                onChange(profile);
                                setJobProfileQuery(profile);
                                setShowJobProfileDropdown(false);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-poppins text-sm"
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

          <FormRow error={errors?.goals?.message}>
            <Controller
              name="goals"
              control={control}
              render={({ field: { onChange, value, name } }) => (
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
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto px-8 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-poppins font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isUpdating}
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

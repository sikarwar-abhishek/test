import axios from "axios";
import { API_ENDPOINTS } from "../constants/constant";
import { wait } from "../utils/helper";
import { handleApiError } from "./errorHandler";
import api from "./interceptor";

export const sendOtp = async (formData) => {
  try {
    // await wait(2);
    const response = await api.post(API_ENDPOINTS.sendotp, formData);
    return response.data;
  } catch (error) {
    handleApiError(error, error?.response?.data?.data?.message);
    throw error;
  }
};

export const verifyOtp = async (formData) => {
  try {
    // await wait(2);
    const response = await api.post(API_ENDPOINTS.verifyotp, formData);
    return response.data;
  } catch (error) {
    handleApiError(error, error?.response?.data?.data?.message);
    throw error;
  }
};

export const completeOnboarding = async (formData) => {
  try {
    // await wait(2);
    const response = await api.post(API_ENDPOINTS.onboarding, formData);
    return response.data;
  } catch (error) {
    handleApiError(error, error?.response?.data?.data?.message);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    // await wait(2);
    const response = await api.get(API_ENDPOINTS.profile);
    return response.data;
  } catch (error) {
    handleApiError(error, error?.response?.data?.data?.message);
    throw error;
  }
};

export const updateProfile = async (formData) => {
  try {
    // await wait(2);
    const response = await api.patch(API_ENDPOINTS.profile, formData);
    return response.data;
  } catch (error) {
    handleApiError(error, error?.response?.data?.data?.message);
    throw error;
  }
};

export const getCities = async () => {
  try {
    // await wait(2);
    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/cities",
      {
        country: "india",
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// export const googleLogin = async (googleToken) => {
//   try {
//     const response = await api.post(API_ENDPOINTS.googleAuth, {
//       token: googleToken,
//     });
//     return response;
//   } catch (error) {
//     handleApiError(error);
//     // console.log("Error in googleLogin::", error);
//     if (error.code === "ERR_NETWORK")
//       throw new Error("Something went wrong. Please try again later.");
//   }
// };

// export const getUserProfile = async () => {
//   try {
//     // await wait(100);
//     const response = await api.get(API_ENDPOINTS.userProfile);
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//     throw error;
//   }
// };

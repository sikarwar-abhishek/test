import { API_ENDPOINTS } from "../constants/constant";
import { handleApiError } from "./errorHandler";
import api from "./interceptor";

//example api calls, use try catch always
export const userSignUp = async (formData) => {
  try {
    const response = await api.post(API_ENDPOINTS.userRegister, formData);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const userSignIn = async (formData) => {
  try {
    const response = await api.post(API_ENDPOINTS.userLogin, formData);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

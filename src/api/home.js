import { API_ENDPOINTS } from "../constants/constant";
import api from "./interceptor";
import { handleApiError } from "./errorHandler";

export const userProgress = async () => {
  try {
    // await wait(100);
    const response = await api.get(API_ENDPOINTS.home_progress);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const recommendations = async (page) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.home_recommendations}?page=${page}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

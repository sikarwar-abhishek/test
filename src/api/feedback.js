import { API_ENDPOINTS } from "../constants/constant";
import { handleApiError } from "./errorHandler";
import api from "./interceptor";

export const puzzleFeedback = async (feedbackData) => {
  try {
    const response = await api.post(API_ENDPOINTS.feedback, feedbackData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

import { API_ENDPOINTS } from "../constants/constant";
import api from "./interceptor";

export const practiceProgress = async () => {
  try {
    // await wait(100);
    const response = await api.get(API_ENDPOINTS.training_progress);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getPracticePuzzlesDaily = async () => {
  try {
    // await wait(100);
    const response = await api.get(API_ENDPOINTS.training_puzzles_daily);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getAllTrainingGoals = async () => {
  try {
    // await wait(100);
    const response = await api.get(API_ENDPOINTS.training_goals);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

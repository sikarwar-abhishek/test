import { API_ENDPOINTS } from "../constants/constant";
import { handleApiError } from "./errorHandler";
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

// Submit practice puzzle answer (subjective)
export const submitPracticeSubjectiveAnswer = async (puzzleId, formData) => {
  try {
    const response = await api.post(
      `${API_ENDPOINTS.training_subjective_submit}${puzzleId}/submit/`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Submit practice puzzle answer (grid)
export const submitPracticeGridAnswer = async (puzzleId, formData) => {
  try {
    const response = await api.post(
      `${API_ENDPOINTS.training_grid_submit}${puzzleId}/submit/`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
export const submitPracticeChessAnswer = async (puzzleId, formData) => {
  try {
    const response = await api.post(
      `${API_ENDPOINTS.training_chess_submit}${puzzleId}/submit/`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

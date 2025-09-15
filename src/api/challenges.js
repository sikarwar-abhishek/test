import { API_ENDPOINTS } from "../constants/constant";
import { handleApiError } from "./errorHandler";
import api from "./interceptor";

export const getChallenges = async () => {
  try {
    // await wait(100);
    const response = await api.get(API_ENDPOINTS.challenges);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getChallengesList = async (challengeId) => {
  try {
    // await wait(100);
    const response = await api.get(`${API_ENDPOINTS.challenges}${challengeId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getPastChallenges = async (challengeId, page = 1) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.past_challenges}${challengeId}/?page=${page}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const pastChallengesDetails = async (challengeId, date) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.challenges}${challengeId}/puzzles?reset_date=${date}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const submitSubjectiveAnswer = async (puzzleId, formData) => {
  try {
    // await wait(100);
    const response = await api.post(
      `${API_ENDPOINTS.subjective_submit}${puzzleId}/submit/`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const submitChessAnswer = async (puzzleId, formData) => {
  try {
    // await wait(100);
    const response = await api.post(
      `${API_ENDPOINTS.chess_submit}${puzzleId}/submit/`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
export const submitGridAnswer = async (puzzleId, formData) => {
  try {
    // await wait(100);
    const response = await api.post(
      `${API_ENDPOINTS.grid_submit}${puzzleId}/submit/`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const searchChallenges = async (query) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.search_challenges}?q=${query}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

import { API_ENDPOINTS } from "../constants/constant";
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

export const getPastChallenges = async (page = 1) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.past_challenges}?page=${page}`
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
  console.log(puzzleId, formData);
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

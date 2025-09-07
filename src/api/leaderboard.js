import { API_ENDPOINTS } from "../constants/constant";
import { wait } from "../utils/helper";
import api from "./interceptor";

export const getCurrentLeaderboard = async (challengeId, page = 1) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.leaderboard}${challengeId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getPastLeaderboard = async (page = 1) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.leaderboard}past/?page=${page}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getPastLeaderboardByDate = async (date, challengeId, page = 1) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.leaderboard}${challengeId}/?date=${date}&page=${page}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

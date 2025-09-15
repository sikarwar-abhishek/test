import axios from "axios";
import { API_ENDPOINTS } from "../constants/constant";
import { handleApiError } from "./errorHandler";
import api from "./interceptor";
import { wait } from "../utils/helper";

export const getAllLoungePosts = async (page) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.lounge_posts}?page=${page}&recommended=true`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    // await wait(100);
    const response = await api.post(API_ENDPOINTS.post_create, postData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const editPost = async (postId, postData) => {
  try {
    // await wait(100);
    const response = await api.patch(
      `${API_ENDPOINTS.lounge_posts}${postId}/`,
      postData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getMyPosts = async (page) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.lounge_posts}?page=${page}&my_posts=true`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const togglePostLike = async (postId) => {
  try {
    const response = await api.post(`/api/lounge-posts/${postId}/toggle-like/`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getAllComments = async (postId, page = 1) => {
  try {
    // await wait(100);
    const response = await api.get(
      `${API_ENDPOINTS.all_comments}?lounge_post=${postId}&page=${page}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

export const createComment = async (comment) => {
  try {
    // await wait(100);
    const response = await api.post(`${API_ENDPOINTS.all_comments}`, comment);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

export const editComment = async (commentId, commentData) => {
  try {
    // await wait(100);
    const response = await api.put(
      `${API_ENDPOINTS.all_comments}${commentId}/`,
      commentData
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

export const deletePost = async (postId) => {
  try {
    // await wait(100);
    const response = await api.delete(
      `${API_ENDPOINTS.lounge_posts}${postId}/`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

export const getPresignedUrl = async (fileData) => {
  try {
    const response = await api.post(
      "/api/photo-upload/presigned-url/",
      fileData
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

// export const uploadImageToS3 = async (uploadUrl, file) => {
//   try {
//     // await wait(100);
//     const response = await axios.put("/api/upload", {
//       uploadUrl,
//       file,
//     });
//     return response.data;
//   } catch (err) {
//     handleApiError(err);
//     throw err;
//   }
// };

export const uploadImageToS3 = async (uploadUrl, file) => {
  try {
    const formData = new FormData();
    formData.append("uploadUrl", uploadUrl);
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Upload failed: ${errorData.error || response.statusText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

export const getSinglePost = async (id) => {
  try {
    // await wait(100);
    const response = await api.get(`${API_ENDPOINTS.lounge_posts}${id}/`);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

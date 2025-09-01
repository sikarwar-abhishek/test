import { toast } from "react-toastify";

export const ERROR_TYPES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION",
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN: "UNKNOWN",
};

export const handleApiError = (error, customMessage = null) => {
  let errorType = ERROR_TYPES.UNKNOWN;
  let errorMessage = customMessage || "An error occurred";

  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        errorType = ERROR_TYPES.VALIDATION;
        errorMessage = data?.message || "Invalid request data";
        break;
      case 401:
        errorType = ERROR_TYPES.UNAUTHORIZED;
        errorMessage = "Please login to continue";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        break;
      case 403:
        errorType = ERROR_TYPES.FORBIDDEN;
        errorMessage = "You do not have permission to perform this action";
        break;
      case 404:
        errorType = ERROR_TYPES.NOT_FOUND;
        errorMessage = data?.message || "Resource not found";
        break;
      case 422:
        errorType = ERROR_TYPES.VALIDATION;
        errorMessage = data?.message || "Validation error";
        break;
      case 500:
        errorType = ERROR_TYPES.SERVER_ERROR;
        errorMessage = "Server error occurred";
        break;
      default:
        errorMessage = data?.message || errorMessage;
    }
  } else if (error.request) {
    errorType = ERROR_TYPES.NETWORK_ERROR;
    errorMessage = "Network error - please check your connection";
  }

  toast({
    title: getErrorTitle(errorType),
    description: errorMessage,
    status: "error",
  });

  return {
    type: errorType,
    message: errorMessage,
    originalError: error,
  };
};

const getErrorTitle = (errorType) => {
  switch (errorType) {
    case ERROR_TYPES.UNAUTHORIZED:
      return "Authentication Error";
    case ERROR_TYPES.FORBIDDEN:
      return "Access Denied";
    case ERROR_TYPES.NOT_FOUND:
      return "Not Found";
    case ERROR_TYPES.VALIDATION:
      return "Validation Error";
    case ERROR_TYPES.SERVER_ERROR:
      return "Server Error";
    case ERROR_TYPES.NETWORK_ERROR:
      return "Network Error";
    default:
      return "Error";
  }
};

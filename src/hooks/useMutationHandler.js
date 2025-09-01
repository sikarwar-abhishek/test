import { useMutation } from "@tanstack/react-query";

export const useMutationHandler = (mutationFn, options = {}) => {
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      options?.onSuccess?.(data);

      // console if successMessage is provided
      if (options.successMessage) {
        console.log(
          "Success::",
          options.apiTitle,
          "::",
          options.successMessage
        );
      }
    },

    onError: (error) => {
      // console if an error response exists
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        console.log("Error::", errorData ?? error);

        // console if errorMessage is provided
        if (options.errorMessage) {
          console.log("Error::", options.apiTitle, "::", options.errorMessage);
        }
      }

      // Execute custom onError if passed in options
      options?.onError?.(error);
    },
  });
};

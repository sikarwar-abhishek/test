// this is a provider file so if you use any other library which have to include provider just include it here and it will be included in the layout.js

"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReduxProvider } from "../store/reduxProvider";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Providers({ children }) {
  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer
          position="top-right"
          autoClose={1500}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="dark"
          transition={Slide}
          toastStyle={{
            fontSize: "16px",
            maxWidth: "300px",
            padding: "16px 18px",
            backgroundColor: "white",
            color: "gray",
          }}
        />

        {children}
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default Providers;

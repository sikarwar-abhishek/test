// this is a provider file so if you use any other library which have to include provider just include it here and it will be included in the layout.js

"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReduxProvider } from "../store/reduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Providers({ children }) {
  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        {children}
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default Providers;

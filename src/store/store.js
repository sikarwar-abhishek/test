// Redux store configuration

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  // Add slices to the reducer here

  // Each slice manages a part of the state

  reducer: {
    user: userReducer, // user slice to manage user-related state

    // Example: Add another slice for posts
    
    // posts: postsReducer,
  },
});

// Exporting the store's getState and dispatch functions for use in components or other files
export const getState = store.getState;
export const dispatch = store.dispatch;

// User slice example for Redux

import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
  id: null,
  name: null,
  email: null,
};

// Create the user slice using createSlice from Redux Toolkit
const userSlice = createSlice({
    
  // Slice name (used to identify the slice in the Redux store)
  name: "user",

  // Initial state defined above
  initialState,

  // Reducers for handling actions
  reducers: {
    // Action to set the user state
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },

    // Action to clear the user state
    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
    },
  },
});

// Export the actions to use in components
export const { setUser, clearUser } = userSlice.actions;

// Export the reducer to be used in the store configuration
export default userSlice.reducer;

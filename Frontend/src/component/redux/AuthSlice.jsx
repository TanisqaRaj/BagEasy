import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: 1234,
  },
  reducers: {
    //functions logic
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
     logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;

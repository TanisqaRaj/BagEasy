import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    expiresIn:null,
  },
  reducers: {
    //functions logic
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      const now = new Date();
      state.expiresIn = new Date(now.getTime() + action.payload.expiresIn * 1000);;
    },
     logout: (state) => {
      state.user = null;
      state.token = null;
      state.expiresIn = null;
    },
  },
});

export const { login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;

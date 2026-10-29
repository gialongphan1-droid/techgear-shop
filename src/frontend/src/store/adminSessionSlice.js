import { createSlice } from "@reduxjs/toolkit";

const adminSessionSlice = createSlice({
  name: "adminSession",
  initialState: {
    admin: null,
    csrfToken: null,
  },
  reducers: {
    setAdminSession(state, action) {
      state.admin = action.payload.admin;
      state.csrfToken = action.payload.csrfToken;
    },
    setAdmin(state, action) {
      state.admin = action.payload;
    },
    setCsrfToken(state, action) {
      state.csrfToken = action.payload;
    },
    clearAdminSession(state) {
      state.admin = null;
      state.csrfToken = null;
    },
  },
});

export const {
  clearAdminSession,
  setAdmin,
  setAdminSession,
  setCsrfToken,
} = adminSessionSlice.actions;
export const selectAdmin = (state) => state.adminSession.admin;
export const selectCsrfToken = (state) => state.adminSession.csrfToken;

export default adminSessionSlice.reducer;

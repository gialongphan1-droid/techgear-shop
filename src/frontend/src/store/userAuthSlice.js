import { createSlice } from "@reduxjs/toolkit";

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    user: null,
    csrfToken: null,
    status: "checking",
    error: "",
  },
  reducers: {
    setCustomerSession(state, action) {
      state.user = action.payload.user;
      state.csrfToken = action.payload.csrfToken || null;
      state.status = "authenticated";
      state.error = "";
    },
    setCustomerAuthChecking(state) {
      state.status = "checking";
      state.error = "";
    },
    setCustomerUnauthenticated(state) {
      state.user = null;
      state.csrfToken = null;
      state.status = "unauthenticated";
      state.error = "";
    },
    setCustomerAuthError(state, action) {
      state.user = null;
      state.csrfToken = null;
      state.status = "error";
      state.error = action.payload;
    },
    clearCustomerSession(state) {
      state.user = null;
      state.csrfToken = null;
      state.status = "unauthenticated";
      state.error = "";
    },
  },
});

export const {
  clearCustomerSession,
  setCustomerAuthChecking,
  setCustomerAuthError,
  setCustomerSession,
  setCustomerUnauthenticated,
} = userAuthSlice.actions;
export const selectCustomerUser = (state) => state.userAuth.user;
export const selectCustomerAuthStatus = (state) => state.userAuth.status;

export default userAuthSlice.reducer;

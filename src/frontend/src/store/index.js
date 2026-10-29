import { configureStore } from "@reduxjs/toolkit";
import adminSessionReducer from "./adminSessionSlice.js";
import cartReducer from "./cartSlice.js";
import compareReducer from "./compareSlice.js";

const store = configureStore({
  reducer: {
    adminSession: adminSessionReducer,
    cart: cartReducer,
    compare: compareReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;

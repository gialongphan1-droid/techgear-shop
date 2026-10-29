import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {},
  devTools: import.meta.env.DEV,
});

export default store;

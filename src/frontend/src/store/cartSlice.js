import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
    itemCount: 0,
    status: "loading",
    error: "",
  },
  reducers: {
    setCartData(state, action) {
      state.items = action.payload.items || [];
      state.subtotal = action.payload.subtotal || 0;
      state.itemCount = action.payload.itemCount || 0;
      state.status = "ready";
      state.error = "";
    },
    setCartLoading(state) {
      state.status = "loading";
      state.error = "";
    },
    setCartError(state, action) {
      state.status = "error";
      state.error = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.itemCount = 0;
      state.status = "ready";
      state.error = "";
    },
  },
});

export const {
  clearCart,
  setCartData,
  setCartError,
  setCartLoading,
} = cartSlice.actions;
export const selectCartItemCount = (state) =>
  state.cart.itemCount;

export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    products: [],
  },
  reducers: {
    addCompareProduct(state, action) {
      const product = action.payload;
      const productId = product._id || product.slug;
      if (
        state.products.length >= 3 ||
        state.products.some((item) => (item._id || item.slug) === productId)
      ) {
        return;
      }
      state.products.push(product);
    },
    removeCompareProduct(state, action) {
      state.products = state.products.filter(
        (product) => (product._id || product.slug) !== action.payload,
      );
    },
  },
});

export const { addCompareProduct, removeCompareProduct } = compareSlice.actions;
export const selectCompareProducts = (state) => state.compare.products;
export default compareSlice.reducer;

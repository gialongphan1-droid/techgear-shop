import { createSlice } from "@reduxjs/toolkit";

export const MAX_COMPARE_PRODUCTS = 3;

export function getCompareProductId(product) {
  return product?._id || product?.slug || null;
}

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    products: [],
  },
  reducers: {
    addCompareProduct(state, action) {
      const product = action.payload;
      const productId = getCompareProductId(product);
      if (
        !productId ||
        state.products.length >= MAX_COMPARE_PRODUCTS ||
        state.products.some((item) => getCompareProductId(item) === productId)
      ) {
        return;
      }
      state.products.push(product);
    },
    removeCompareProduct(state, action) {
      state.products = state.products.filter(
        (product) => getCompareProductId(product) !== action.payload,
      );
    },
  },
});

export const { addCompareProduct, removeCompareProduct } = compareSlice.actions;
export const selectCompareProducts = (state) =>
  Array.isArray(state.compare?.products) ? state.compare.products : [];
export default compareSlice.reducer;

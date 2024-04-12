import { createSlice } from "@reduxjs/toolkit";

const StoreSlice = createSlice({
  name: "store slice",
  initialState: {
    storeDetail: null,
  },
  reducers: {
    setStore(state, action) {
      state.storeDetail = action.payload;
    },
  },
});

export const { setStore } = StoreSlice.actions;
export default StoreSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const StoreSlice = createSlice({
  name: "store slice",
  initialState: {
    storeDetail: null,
    storeDayDetail: null,
  },
  reducers: {
    setStore(state, action) {
      state.storeDetail = action.payload;
    },
    setStoreDayDetails(state, action) {
      state.storeDayDetail = action.payload;
    },
  },
});

export const { setStore, setStoreDayDetails } = StoreSlice.actions;
export default StoreSlice.reducer;

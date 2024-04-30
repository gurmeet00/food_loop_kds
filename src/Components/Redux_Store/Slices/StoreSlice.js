import { createSlice } from "@reduxjs/toolkit";

const StoreSlice = createSlice({
  name: "store slice",
  initialState: {
    storeDetail: null,
    storeDayDetail: null,
    reloadCounter: 0,
  },
  reducers: {
    setStore(state, action) {
      state.storeDetail = action.payload;
    },
    setStoreDayDetails(state, action) {
      state.storeDayDetail = action.payload;
    },
    setReloadCounter(state, action) {
      if (state.reloadCounter > 4) {
        state.reloadCounter = 0;
      } else {
        state.reloadCounter = state.reloadCounter + action.payload;
      }
    },
  },
});

export const { setStore, setStoreDayDetails, setReloadCounter } =
  StoreSlice.actions;
export default StoreSlice.reducer;

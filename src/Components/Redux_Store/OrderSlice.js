import { createSlice } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    allOrder: null,
  },
  reducers: {
    setAllOrder(state, action) {
      state.allOrder = action.payload;
    },
  },
});

export const { setAllOrder } = OrderSlice.actions;
export default OrderSlice.reducer;

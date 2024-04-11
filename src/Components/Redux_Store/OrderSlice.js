import { createSlice } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    allOrder: null,
    gridNum: 3,
  },
  reducers: {
    setAllOrder(state, action) {
      state.allOrder = action.payload;
    },
    setGridNum(state, action) {
      state.gridNum = action.payload;
    },
  },
});

export const { setAllOrder, setGridNum } = OrderSlice.actions;
export default OrderSlice.reducer;

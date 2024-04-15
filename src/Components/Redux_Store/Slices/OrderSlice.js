import { createSlice } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    allOrder: null,
    allVoidOrder: null,
    gridNum: 3,
  },
  reducers: {
    setAllOrder(state, action) {
      state.allOrder = action.payload;
    },
    setAllVoidOrder(state, action) {
      state.allVoidOrder = action.payload;
    },
    setGridNum(state, action) {
      state.gridNum = action.payload;
    },
  },
});

export const { setAllOrder, setAllVoidOrder, setGridNum } = OrderSlice.actions;
export default OrderSlice.reducer;

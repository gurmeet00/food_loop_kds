import { createSlice } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
  name: "order",
  initialState: {
    allOrder: null,
    allVoidOrder: null,
    updateOrder: null,
    gridNum: 4,
    totalOrder: 0,
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
    setTotalOrder(state, action) {
      state.totalOrder = action.payload;
    },
    // updateSingleOrder(state, action) {
    //   console.log(action.payload);
    //   state.updateOrder = action.payload;
    // },
  },
});

export const { setAllOrder, setAllVoidOrder, setGridNum, setTotalOrder } =
  OrderSlice.actions;
export default OrderSlice.reducer;

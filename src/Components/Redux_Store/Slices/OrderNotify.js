import { createSlice } from "@reduxjs/toolkit";

const NotifyOrdersSlice = createSlice({
  name: "store slice",
  initialState: {
    notifyProductOrders: JSON.parse(localStorage.getItem("notifyOrders")) ?? {},
  },
  reducers: {
    setNotifyOrders(state, action) {
      console.log(action.payload["order_id"]);
      state.notifyProductOrders = {
        ...state.notifyProductOrders,
        [action.payload["order_id"]]: [],
      };
    },

    getProductItems(state, action) {
      if (
        state.notifyProductOrders[action.payload[0]].includes(action.payload[1])
      ) {
        let findIndex = state.notifyProductOrders[action.payload[0]].findIndex(
          (ele) => ele == action.payload[1]
        );
        console.log(findIndex, "findIndex: ");
        if (findIndex || findIndex == 0) {
          state.notifyProductOrders[action.payload[0]].splice(findIndex, 1);
        }
      } else {
        state.notifyProductOrders[action.payload[0]]?.push(action.payload[1]);
      }
    },
  },
});

export const { setNotifyOrders, getProductItems } = NotifyOrdersSlice.actions;
export default NotifyOrdersSlice.reducer;

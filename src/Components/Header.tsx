import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useSearchParams } from "react-router-dom";
import { setAllOrder, setGridNum } from "./Redux_Store/Slices/OrderSlice";
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Fab,
  MenuItem,
  Select,
  Button,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import CachedIcon from "@mui/icons-material/Cached";
import { setReloadCounter } from "./Redux_Store/Slices/StoreSlice";
function Header({ activeBtnName }) {
  const dispatch = useDispatch();
  const totalOrders = useSelector((state: any) => state.orders.totalOrder);
  const cancelOrders = useSelector((state: any) => state.orders.cancelOrder);
  const completeOrders = useSelector(
    (state: any) => state.orders.completeOrder
  );
  const GridNumber = useSelector((state: any) => state.orders?.gridNum);
  const [storeParam, setSeachParam] = useSearchParams();
  const [newOrdersBtn, setNewOrdersBtn] = useState(true);
  const [cancelOrdersBtn, setCancelOrdersBtn] = useState(false);
  const [completeOrdersBtn, setCompleteOrdersBtn] = useState(false);

  function handleCounter() {
    dispatch(setReloadCounter(1));
  }

  useEffect(() => {
    if (activeBtnName == "newOrder") {
      setNewOrdersBtn(true);
      setCancelOrdersBtn(false);
      setCompleteOrdersBtn(false);
    } else if (activeBtnName == "cancelOrder") {
      setNewOrdersBtn(false);
      setCancelOrdersBtn(true);
      setCompleteOrdersBtn(false);
    } else if (activeBtnName == "completeOrder") {
      setNewOrdersBtn(false);
      setCancelOrdersBtn(false);
      setCompleteOrdersBtn(true);
    }
  });

  return (
    <>
      <Card className="cardDesign">
        <CardContent style={{ paddingBottom: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={8} md={3} lg={2}>
              <img src="/logo/loop_logo.gif" alt="logo" width={160} />
            </Grid>
            <Grid item xs={6} sm={8} md={6} lg={8.5} textAlign={"center"}>
              {storeParam.get("id") && (
                <Typography variant="h6" color="warning" fontFamily={"poppins"}>
                  {cancelOrdersBtn
                    ? "Cancel "
                    : completeOrdersBtn
                    ? " Complete "
                    : "Total "}
                  Orders :{" "}
                  {cancelOrdersBtn
                    ? cancelOrders
                    : completeOrdersBtn
                    ? completeOrders
                    : totalOrders}
                </Typography>
              )}
            </Grid>
            <Grid
              item
              xs={2}
              sm={1}
              md={1}
              lg={0.5}
              sx={{ textAlign: { xs: "left", md: "center" } }}
            >
              <Fab color="warning" size="small" onClick={handleCounter}>
                <CachedIcon sx={{ fontSize: "20px" }} />
              </Fab>
            </Grid>
            <Grid item xs={10} sm={3} md={2} lg={1}>
              <FormControl
                color="error"
                size="small"
                fullWidth
                sx={{
                  fontFamily: "poppins",
                }}
              >
                <InputLabel color="error" id="demo-simple-select-label">
                  View Layout
                </InputLabel>
                <Select
                  size="small"
                  value={GridNumber}
                  color="warning"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="View Layout"
                  onChange={(e) => {
                    dispatch(setGridNum(e.target.value));
                  }}
                >
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  {/* <MenuItem value={5}>5</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
}



export default Header;

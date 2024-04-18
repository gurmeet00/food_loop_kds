import React, { useEffect, useState } from "react";
import Header from "./Header";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ApiStatus } from "../api/api_url.ts";
import { useQuery } from "@tanstack/react-query";
import { GToaster } from "../helper/g_toaster.tsx";
import CachedIcon from "@mui/icons-material/Cached";
import { useDispatch, useSelector } from "react-redux";
import TableBarIcon from "@mui/icons-material/TableBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreController } from "./Controllers/store_controller.tsx";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  setStore,
  setStoreDayDetails,
} from "./Redux_Store/Slices/StoreSlice.js";
import moment from "moment-timezone";
import PageNotFound from "./PageNotFound.tsx";
import ChairAltTwoToneIcon from "@mui/icons-material/ChairAltTwoTone";
import { SocketController } from "./Controllers/socketController.tsx";
import ButttonBar from "./ButttonBar.tsx";
import io, { Socket } from "socket.io-client";
import {
  setAllOrder,
  setAllVoidOrder,
} from "./Redux_Store/Slices/OrderSlice.js";
import { textUpperCase } from "../helper/g_constants.ts";
const gToaster = new GToaster();
const storeController = new StoreController();
const socketController = new SocketController();
function Home() {
  const socket: Socket = io(
    `wss://loopbackendnew.loop.rockymountaintech.co?store=659e6700e0ec95ac62733139`,
    {
      transports: ["websocket"],
      autoConnect: true,
    }
  );
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const GridNumber = useSelector((state: any) => state.orders?.gridNum);
  const ordersSliceData = useSelector((state: any) => state.orders?.allOrder);
  console.log(ordersSliceData, "ordersSliceData");
  const VoidOrdersSliceData = useSelector(
    (state: any) => state.orders?.allVoidOrder
  );
  const TimeZone = useSelector(
    (state: any) =>
      state.store.storeDetail?.store_setting?.general_setting?.time_zone
        ?.time_zone
  );
  const currencySymbol = useSelector(
    (state: any) =>
      state?.store?.storeDetail?.store_setting?.general_setting?.currency_symbol
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const storeId = searchParams.get("id");
  const [all, setAll] = useState(true);
  const [dining, setDining] = useState(false);
  const [takeAway, setTakeAway] = useState(false);
  const [newOrdersBtn, setNewOrdersBtn] = useState(true);
  const [cancelOrdersBtn, setCancelOrdersBtn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [connection, setConnection] = useState(false);
  const [voidOrders, setVoidOrders] = useState([]);
  const [startDayString, setStartDayString] = useState("");
  const [storeDate, setStoreDate] = useState("");
  const [storeTime, setStoreTime] = useState("");
  let ghostOrders: Array<Record<string, any>> = [];
  console.log(orders);
  //==========================================================================================
  //ACTIVE NEW/OLD FUNCTION

  function activeNewOldOrders(name: string) {
    if (name == "newOrder") {
      setNewOrdersBtn(true);
      setCancelOrdersBtn(false);
    } else if (name == "cancelOrder") {
      setNewOrdersBtn(false);
      setCancelOrdersBtn(true);
    }
  }

  //==========================================================================================
  //ACTIVE BUTTON FUNCTION
  function handleActive(name) {
    if (name == "all") {
      setAll(true);
      setDining(false);
      setTakeAway(false);
    } else if (name == "dining") {
      setAll(false);
      setDining(true);
      setTakeAway(false);
    } else if (name == "takeAway") {
      setAll(false);
      setDining(false);
      setTakeAway(true);
    }
  }
  //==========================================================================================
  // GET STORE PROFILE DATA
  async function getStoreProfile() {
    let response = await storeController.getStoreDetails({ _id: storeId });
    if (response.status == ApiStatus.STATUS_200) {
      dispatch(setStore(response.data.data));

      momentDateTime(response.data.data?.time_zone?.time_zone);
    } else if (response.status == ApiStatus.STATUS_500) {
      gToaster.warning({ title: "500 Server Error" });
    } else {
      gToaster.warning({ title: " Server Error" });
    }
  }
  //==========================================================================================
  //GET TIME & DATE FROM MOMENT
  function momentDateTime(timeZone: string) {
    let getDateTime = moment().tz(timeZone).format("DD/MM/YYYY  HH:mm");
    let splitDataTime = getDateTime.split(" ");
    setStoreDate(splitDataTime[0]);
    setStoreTime(splitDataTime[2]);
  }
  //==========================================================================================
  // GET STORE DAY ID
  async function getStoreDay() {
    let response = await storeController.getStartDay({ _id: storeId });
    if (response.status == ApiStatus.STATUS_200) {
      if (
        response.data.data?.day_id == null ||
        response.data.data?.day_id == undefined ||
        response.data.data?.day_id == false
      ) {
        navigate("/storeclose");
      } else {
        // socketController.connect(storeId, ordersSliceData);
        connect();

        dispatch(setStoreDayDetails(response.data.data));
        getStoreOrdersData(response.data.data?.day_id);
        setStartDayString(response.data.data?.day_id);
        getStoreVoidOrdersData(response.data.data?.day_id);
      }
    } else if (response.status == ApiStatus.STATUS_500) {
      gToaster.warning({ title: "500 Server Error" });
    } else {
      gToaster.warning({ title: " Server Error" });
    }
  }

  //==========================================================================================
  // GET ORDERS

  async function getStoreOrdersData(startDayId) {
    setLoading(true);
    // if (ordersSliceData?.length > 0) {
    //   setOrders(ordersSliceData);
    // }

    let response = await storeController.getStoreOrders({
      day_id: startDayId,
      store_Id: storeId,
    });
    setLoading(false);

    if (response.status == ApiStatus.STATUS_200) {
      setOrders(response.data.data);
      ghostOrders = response.data.data;
      // dispatch(setAllOrder(response.data.data));
    } else if (response.status == ApiStatus.STATUS_500) {
      gToaster.warning({ title: "500 Server Error" });
    } else {
      gToaster.warning({ title: " Server Error" });
    }
  }

  //==========================================================================================
  // GET VOID ORDERS

  async function getStoreVoidOrdersData(startDayId) {
    setLoading(true);
    // if (VoidOrdersSliceData?.length > 0) {
    //   setVoidOrders(VoidOrdersSliceData);
    // }

    let response = await storeController.getStoreVoidOrders({
      day_id: startDayId,
      store_Id: storeId,
    });
    setLoading(false);

    if (response.status == ApiStatus.STATUS_200) {
      setVoidOrders(response.data.data);
      // dispatch(setAllVoidOrder(response.data.data));
    } else if (response.status == ApiStatus.STATUS_500) {
      gToaster.warning({ title: "500 Server Error" });
    } else {
      gToaster.warning({ title: " Server Error" });
    }
  }
  //==========================================================================================

  function connect() {
    if (!connection) {
      if (storeId != null || storeId != undefined || storeId != "") {
        socket.connect();
        console.log("Connect");
        setConnection(true);
        updateOrder();
      }
    } else {
      console.log("Already Connected");
    }
  }
  function updateOrder() {
    socket.on("updated_order", (data) => {
      console.log(orders, "update order channel before", ghostOrders);
      let orderData = JSON.parse(JSON.stringify(ghostOrders));

      let found = orderData.findIndex(
        (ele: Record<string, any>, index: number) => ele._id == data._id
      );
      if (found) {
        orderData.splice(found, 1, data);
        ghostOrders = orderData;
        setOrders(orderData);
        // dispatch(setAllOrder(orderData));
      }
    });
  }

  function disConnect() {
    socket.close();
    socket.removeAllListeners();
    socket.disconnect();
    setConnection(false);
    console.log("Socket Disconnected");
  }

  useEffect(() => {
    if (storeId) {
      getStoreDay();
      getStoreProfile();
    } else {
      setNotFound(true);
    }

    return () => {
      disConnect();
    };
  }, []);
  return (
    <>
      {notFound ? (
        <PageNotFound />
      ) : (
        <>
          <ButttonBar
            activeBtn={handleActive}
            activeNewOldBtn={activeNewOldOrders}
            allBtn={all}
            diningBtn={dining}
            takeAwayBtn={takeAway}
            newOrdersBtn={newOrdersBtn}
            cancelOrdersBtn={cancelOrdersBtn}
          />

          <Grid container spacing={1} sx={{ my: 1, px: 2 }}>
            {loading ? (
              <>
                <Grid item xs={12} sx={{ textAlign: "center", py: "50px" }}>
                  <CircularProgress color="warning" />
                </Grid>
              </>
            ) : (
              <>
                <Masonry gutter="5px" columnsCount={GridNumber}>
                  {(newOrdersBtn
                    ? orders
                    : cancelOrdersBtn
                    ? voidOrders
                    : []
                  )?.map((ele: Record<string, any>) => (
                    <>
                      {ele?.order_type
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .includes(
                          takeAway
                            ? "take_away"
                            : dining
                            ? "dine_in"
                            : ele?.order_type
                        ) && (
                        <Card
                          sx={{
                            boxShadow: "1px 1px 5px 0px grey",
                            borderRadius: "5px",
                            margin: "10px 0px 10px 10px",
                          }}
                        >
                          <CardContent>
                            <Grid container spacing={1}>
                              <Grid item xs={8}>
                                <Typography paragraph={true}>
                                  <b>#{ele?.order_id}</b>
                                </Typography>
                              </Grid>
                              <Grid item xs={4} sx={{ textAlign: "center" }}>
                                <Typography
                                  paragraph={true}
                                  sx={{
                                    backgroundColor: "#d81c1c",
                                    color: "white",
                                    padding: "0px 8px",
                                    borderRadius: "10px",
                                    fontSize: "12px",
                                  }}
                                >
                                  {textUpperCase(ele?.order_type)}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Box className="flexCenterBox">
                              <Typography paragraph={true}>
                                Customer :
                              </Typography>
                              <Typography paragraph={true}>
                                {ele?.customer.name}
                              </Typography>
                            </Box>
                            <Box className="flexCenterBox">
                              <Typography paragraph={true}>
                                Created At :
                              </Typography>
                              <Typography paragraph={true}>
                                {ele?.created_at}
                              </Typography>
                            </Box>
                            {ele?.table != null && (
                              <Box className="flexCenterBox">
                                <Typography paragraph={true}>
                                  <TableBarIcon sx={{ fontSize: "12px" }} />{" "}
                                  {ele?.table ? ele?.table?.name : "-"}
                                </Typography>

                                <Typography paragraph={true}>
                                  <ChairAltTwoToneIcon
                                    sx={{ fontSize: "14px" }}
                                  />{" "}
                                  Seats-
                                  {ele?.table
                                    ? ele?.table?.sitting_capacity
                                    : "-"}
                                </Typography>
                              </Box>
                            )}

                            <Box
                              sx={{
                                backgroundColor: "#f2f2f2a3",
                                borderRadius: "8px",
                                padding: "20px",
                                mb: "10px",
                              }}
                            >
                              {/* <Button variant="outlined" color="warning" size="small">
                      <VisibilityIcon />
                    </Button> */}
                              <Typography paragraph={true}>
                                <b>Order Items </b>:
                              </Typography>

                              <Divider sx={{ mb: 2 }} />
                              <Grid container spacing={1}>
                                {(ele?.take_away?.length > 0
                                  ? ele?.take_away
                                  : ele?.dine_in?.length
                                  ? ele?.dine_in
                                  : []
                                  ? ele?.take_away
                                  : ele?.dine_in?.length > 0
                                  ? ele?.dine_in
                                  : []
                                ).map(
                                  (
                                    foodItems: Record<string, any>,
                                    index: any
                                  ) => (
                                    <>
                                      <Grid item xs={12}>
                                        <Typography
                                          paragraph={true}
                                          sx={{ paddingBottom: "0px" }}
                                        >
                                          {foodItems?.order_id}
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={12}>
                                        {foodItems?.product.map(
                                          (
                                            productItem: Record<string, any>,
                                            index: number
                                          ) => (
                                            <>
                                              <Grid container spacing={1}>
                                                <Grid xs={12}>
                                                  <Typography
                                                    paragraph={true}
                                                    sx={{
                                                      marginBottom: "0px",
                                                    }}
                                                  >
                                                    {newOrdersBtn && (
                                                      <Checkbox
                                                        defaultChecked
                                                        size="small"
                                                        color="warning"
                                                      />
                                                    )}
                                                    {productItem?.quantity +
                                                      " x " +
                                                      productItem?.product
                                                        ?.name}
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  xs={12}
                                                  style={{
                                                    fontSize: "14px",
                                                    color: "grey",
                                                    paddingLeft: "40px",
                                                  }}
                                                >
                                                  {productItem?.selected_variants?.map(
                                                    (
                                                      selectedVar: Record<
                                                        string,
                                                        any
                                                      >,
                                                      indexSelectedVar: number
                                                    ) => (
                                                      <>
                                                        <Grid
                                                          container
                                                          spacing={1}
                                                        >
                                                          <Grid xs={12}>
                                                            <Typography
                                                              marginBottom={0}
                                                              paragraph={true}
                                                            >
                                                              <b>
                                                                {
                                                                  selectedVar
                                                                    ?.variant_category
                                                                    ?.name
                                                                }
                                                              </b>
                                                            </Typography>
                                                          </Grid>
                                                          <Grid xs={12}>
                                                            <Typography
                                                              marginRight={5}
                                                              paragraph={true}
                                                            >
                                                              {selectedVar?.data?.items.map(
                                                                (
                                                                  item: Record<
                                                                    any,
                                                                    any
                                                                  >,
                                                                  itemIndex: number
                                                                ) => (
                                                                  <>
                                                                    {" " +
                                                                      item
                                                                        ?.item_data
                                                                        ?.variant_name}
                                                                    ,
                                                                  </>
                                                                )
                                                              )}
                                                            </Typography>
                                                          </Grid>
                                                        </Grid>
                                                      </>
                                                    )
                                                  )}
                                                </Grid>
                                              </Grid>

                                              <Divider sx={{ my: 2 }} />
                                            </>
                                          )
                                        )}
                                      </Grid>
                                    </>
                                  )
                                )}
                              </Grid>
                            </Box>
                            {newOrdersBtn && (
                              <Button
                                variant="contained"
                                className="customBtn"
                                size="small"
                                fullWidth
                              >
                                Ready to pick
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ))}
                </Masonry>
              </>
            )}
          </Grid>
        </>
      )}
    </>
  );
}

// let ordersSliceData = useSelector((state: any) => state.orders?.allOrder);
export function GetUpOrder(orderItem: Record<string, any>) {
  console.log(orderItem, "<<<<<<<");
  // let allOrder = JSON.parse(JSON.stringify(ordersSliceData));
  // let found = allOrder.find((ele: Record<string, any>, index: number) => {
  //   return ele._id === order._id;
  // });
  // console.log(found, "mil gya");
}

export default Home;

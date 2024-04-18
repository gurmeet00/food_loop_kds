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
import moment from "moment-timezone";
import ButttonBar from "./ButttonBar.tsx";
import PageNotFound from "./PageNotFound.tsx";
import io, { Socket } from "socket.io-client";
import { ApiStatus } from "../api/api_url.ts";
import { GToaster } from "../helper/g_toaster.tsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreController } from "./Controllers/store_controller.tsx";
import TableBarTwoToneIcon from "@mui/icons-material/TableBarTwoTone";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  setStore,
  setStoreDayDetails,
} from "./Redux_Store/Slices/StoreSlice.js";
import ChairAltTwoToneIcon from "@mui/icons-material/ChairAltTwoTone";
import { SocketController } from "./Controllers/socketController.tsx";
import { textUpperCase } from "../helper/g_constants.ts";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import CachedIcon from "@mui/icons-material/Cached";
// import {
//   setAllOrder,
//   setAllVoidOrder,
// } from "./Redux_Store/Slices/OrderSlice.js";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const storeId: string = searchParams.get("id");
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
  const [storeDate, setStoreDate] = useState("");
  const [storeTime, setStoreTime] = useState("");
  let ghostOrders: Array<Record<string, any>> = [];

  // const ordersSliceData = useSelector((state: any) => state.orders?.allOrder);
  // console.log(ordersSliceData, "ordersSliceData");
  // const VoidOrdersSliceData = useSelector(
  //   (state: any) => state.orders?.allVoidOrder
  // );
  // const TimeZone = useSelector(
  //   (state: any) =>
  //     state.store.storeDetail?.store_setting?.general_setting?.time_zone
  //       ?.time_zone
  // );

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
      // ADD INCLUDE FOR CHECK ORDER AND FOR CUTT THE ITEM IN TAKE AWAY.
      response.data.data?.map((obj: Record<string, any>) => {
        let data = obj?.take_away?.map((item: Record<string, any>) => {
          let updateProduct = item?.product?.map(
            (productItem: Record<string, any>) => {
              productItem.include = false;
            }
          );
          return updateProduct;
        });
        return data;
      });

      // ADD INCLUDE FOR CHECK ORDER AND FOR CUTT THE ITEM IN DINE IN.
      response.data.data?.map((obj: Record<string, any>) => {
        let data = obj?.dine_in?.map((item: Record<string, any>) => {
          let updateProduct = item?.product?.map(
            (productItem: Record<string, any>) => {
              productItem.include = false;
            }
          );
          return updateProduct;
        });
        return data;
      });

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
  // EDIT ORDERS

  async function handleCutItem(
    orderIndex: number,
    foodItemsIndex: number,
    productIndex: number,
    value: boolean,
    orderType: string
  ) {
    let data = JSON.parse(JSON.stringify(orders));

    data[orderIndex][orderType][foodItemsIndex].product[productIndex].include =
      value;

    // await storeController
    //   .editOrder({ _id: storeId, body: data })
    //   .then((response: any) => {
    //     if (response.status == ApiStatus.STATUS_500) {
    //       gToaster.warning({ title: "500 Server Error" });
    //     } else {
    //       gToaster.warning({ title: " Server Error" });
    //     }
    //   });

    setOrders(data);
    ghostOrders = data;
  }

  //==========================================================================================
  // CONNECTING SOCKET
  function connect() {
    if (!connection) {
      if (storeId != null || storeId != undefined || storeId != "") {
        socket.connect();
        console.log("Connect");
        setConnection(true);

        addOrders();

        updateOrder();
      }
    } else {
      console.log("Already Connected");
    }
  }

  //==========================================================================================
  // ADD CHANNEL OF SOCKET
  function addOrders() {
    socket.on("orders", (data) => {
      let OrderData = JSON.parse(JSON.stringify(ghostOrders));
      OrderData.unshift(data);
      ghostOrders = OrderData;
      setOrders(OrderData);
    });
  }

  //==========================================================================================
  // UPDATE CHANNEL OF SOCKET
  function updateOrder() {
    socket.on("updated_order", (data) => {
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

  //==========================================================================================
  // DISCONNECT CHANNEL OF SOCKET
  function disConnect() {
    socket.close();
    socket.removeAllListeners();
    socket.disconnect();
    setConnection(false);
    console.log("Socket Disconnected");
  }

  useEffect(() => {
    if (storeId != null || storeId != undefined || storeId != "") {
      if (connection == false) {
        getStoreDay();
        getStoreProfile();
      }
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
                  )?.map((ele: Record<string, any>, orderIndex: number) => (
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
                            <Grid container spacing={1} className="cardItems">
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

                              <Grid item xs={6}>
                                <Typography paragraph={true}>
                                  Customer :
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  paragraph={true}
                                  textAlign={"right"}
                                >
                                  {ele?.customer.name}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography paragraph={true}>
                                  Created At :
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  paragraph={true}
                                  textAlign={"right"}
                                >
                                  {ele?.created_at}
                                </Typography>
                              </Grid>
                              {ele?.table != null && (
                                <>
                                  {" "}
                                  <Grid item xs={6}>
                                    <Typography paragraph={true}>
                                      <TableBarTwoToneIcon
                                        sx={{ fontSize: "23px" }}
                                      />{" "}
                                      {ele?.table ? ele?.table?.name : "-"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      paragraph={true}
                                      textAlign={"right"}
                                    >
                                      <ChairAltTwoToneIcon
                                        sx={{ fontSize: "23px" }}
                                      />{" "}
                                      Seats-
                                      {ele?.table
                                        ? ele?.table?.sitting_capacity
                                        : "-"}
                                    </Typography>
                                  </Grid>
                                </>
                              )}
                            </Grid>

                            <Grid
                              container
                              spacing={1}
                              sx={{
                                backgroundColor: "#f2f2f2a3",
                                borderRadius: "8px",
                                padding: "20px",
                                mb: "10px",
                              }}
                              className="cardItems"
                            >
                              <Grid item xs={12}>
                                <Typography paragraph={true}>
                                  <b>Order Items </b>:
                                </Typography>
                              </Grid>
                              <Divider sx={{ mb: 2 }} />
                              <Grid container spacing={1}>
                                {(ele?.take_away?.length > 0
                                  ? ele?.take_away
                                  : ele?.dine_in?.length > 0
                                  ? ele?.dine_in
                                  : []
                                )
                                  // ? ele?.take_away
                                  // : ele?.dine_in?.length > 0
                                  // ? ele?.dine_in
                                  // : []
                                  .map(
                                    (
                                      foodItems: Record<string, any>,
                                      foodItemsIndex: number
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
                                              productIndex: number
                                            ) => (
                                              <>
                                                <Grid
                                                  container
                                                  spacing={1}
                                                  className="cardItems"
                                                >
                                                  <Grid xs={12}>
                                                    <Typography
                                                      paragraph={true}
                                                      sx={{
                                                        marginBottom: "0px",
                                                        textDecoration:
                                                          productItem?.include
                                                            ? "line-through"
                                                            : "none",
                                                      }}
                                                    >
                                                      {newOrdersBtn && (
                                                        <Checkbox
                                                          checked={
                                                            productItem?.include
                                                          }
                                                          size="large"
                                                          color="warning"
                                                          onChange={() =>
                                                            handleCutItem(
                                                              orderIndex,
                                                              foodItemsIndex,
                                                              productIndex,
                                                              !productItem?.include,
                                                              ele?.order_type
                                                            )
                                                          }
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
                                                      color: "#595454",
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
                            </Grid>
                            {newOrdersBtn && (
                              <Button
                                variant="contained"
                                className="customBtn"
                                size="large"
                                fullWidth
                              >
                                <b> Ready to pick</b>
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



export default Home;

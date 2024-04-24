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
import Chip from "@mui/material/Chip";
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
import { textUpperCase } from "../helper/g_constants.ts";
import ChairAltTwoToneIcon from "@mui/icons-material/ChairAltTwoTone";
import { SocketController } from "./Controllers/socketController.tsx";
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
  const storeId = searchParams.get("id");
  const [all, setAll] = useState(true);
  const [dining, setDining] = useState(false);
  const [takeAway, setTakeAway] = useState(false);
  const [newOrdersBtn, setNewOrdersBtn] = useState(true);
  const [cancelOrdersBtn, setCancelOrdersBtn] = useState(false);
  const [completeOrdersBtn, setCompleteOrdersBtn] = useState(false);
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
      setCompleteOrdersBtn(false);
    } else if (name == "cancelOrder") {
      setNewOrdersBtn(false);
      setCancelOrdersBtn(true);
      setCompleteOrdersBtn(false);
    } else if (name == "completeOrder") {
      setNewOrdersBtn(false);
      setCancelOrdersBtn(false);
      setCompleteOrdersBtn(true);
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
    setLoading(true);
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
              productItem.include = productItem.include || false;
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
              productItem.include = productItem.include || false;
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
        if (data.is_completed || data.is_cancelled) {
          orderData.splice(found, 1);
        } else {
          orderData.splice(found, 1, data);
        }

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

  //==========================================================================================
  // EDIT ORDERS

  async function handleCutItem(
    orderIndex: number,
    foodItemsIndex: number,
    productIndex: number,
    value: boolean,
    orderType: string,
    Id: string
  ) {
    let data = JSON.parse(JSON.stringify(orders));

    data[orderIndex][orderType][foodItemsIndex].product[productIndex].include =
      value;

    setOrders(data);
    ghostOrders = data;

    // await storeController
    //   .updateOrder({ _id: Id, body: data[orderIndex] })
    //   .then((response: any) => {
    //     if (response.status == ApiStatus.STATUS_200) {
    //       console.log(response.data.data);
    //     } else if (response.status == ApiStatus.STATUS_500) {
    //       gToaster.warning({ title: "500 Server Error" });
    //     } else {
    //       gToaster.warning({ title: " Server Error" });
    //     }
    //   });
  }

  async function handleReadyToPick(obj: Record<string, any>) {
    await storeController
      .readyToPickOrder({ _id: obj._id })
      .then((response: any) => {
        if (response.status == ApiStatus.STATUS_200) {
        } else if (response.status == ApiStatus.STATUS_500) {
          gToaster.warning({ title: "500 Server Error" });
        } else {
          gToaster.warning({ title: " Server Error" });
        }
      });
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
  console.log(orders, "orders");
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
            completeOrdersBtn={completeOrdersBtn}
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
                    <React.Fragment key={orderIndex}>
                      {ele?.order_type
                        ?.toLowerCase()
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
                                backgroundColor: "#f2f2f299",
                                borderRadius: "8px",
                                padding: "6px 15px",
                                my: "15px",
                              }}
                              className="cardItems"
                            >
                              <Grid item xs={12}>
                                <Typography paragraph={true}>
                                  <b>Order Items </b>:
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                              </Grid>
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
                                      <React.Fragment key={foodItemsIndex}>
                                        <Grid item xs={12} md={1}>
                                          <Typography
                                            sx={{
                                              paddingBottom: "0px",
                                              mb: "0px",
                                              pt: "8px",
                                            }}
                                          >
                                            <b>{foodItems?.order_id}</b>
                                          </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={11}>
                                          {foodItems?.product.map(
                                            (
                                              productItem: Record<string, any>,
                                              productIndex: number
                                            ) => (
                                              <React.Fragment
                                                key={productIndex}
                                              >
                                                <Grid
                                                  container
                                                  spacing={1}
                                                  className="cardItems"
                                                >
                                                  <Grid
                                                    item
                                                    xs={12}
                                                    display={"flex"}
                                                    justifyContent={
                                                      "space-between"
                                                    }
                                                    alignItems={"center"}
                                                  >
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
                                                          size="medium"
                                                          color="warning"
                                                          onChange={() =>
                                                            handleCutItem(
                                                              orderIndex,
                                                              foodItemsIndex,
                                                              productIndex,
                                                              !productItem?.include,
                                                              ele?.order_type,
                                                              ele?._id
                                                            )
                                                          }
                                                        />
                                                      )}
                                                      {productItem?.quantity +
                                                        " x " +
                                                        productItem?.product
                                                          ?.name}
                                                    </Typography>
                                                    {productItem?.include && (
                                                      <Chip
                                                        label="Done"
                                                        color="success"
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ float: "right" }}
                                                      />
                                                    )}
                                                  </Grid>
                                                  <Grid
                                                    item
                                                    xs={12}
                                                    style={{
                                                      fontSize: "14px",
                                                      color: "#595454",
                                                      paddingLeft: "20px",
                                                    }}
                                                  >
                                                    {productItem?.selected_pizza_variants !=
                                                      null && (
                                                      <Grid
                                                        container
                                                        spacing={0}
                                                      >
                                                        <Grid item xs={12}>
                                                          <span className="primaryColor">
                                                            <b> Category</b>
                                                          </span>
                                                          <span className="selectedPizzaVariants">
                                                            {` : ${productItem?.selected_pizza_variants.category_id.category_name}`}
                                                          </span>
                                                          <Divider
                                                            sx={{ my: 1 }}
                                                          />
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                          <span className="primaryColor">
                                                            <b>All Size : </b>
                                                          </span>
                                                        </Grid>
                                                        <Grid item xs={10}>
                                                          <span className="selectedPizzaVariants">
                                                            {`${productItem?.selected_pizza_variants.size?.size?.name}`}
                                                          </span>
                                                        </Grid>
                                                        {/* {SELECTED VARIANT PIZZA} */}
                                                        <Grid item xs={12}>
                                                          <Divider
                                                            sx={{ my: 1 }}
                                                          />
                                                          <span className="primaryColor">
                                                            <b>Sauce Items</b>
                                                          </span>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                          <span className="selectedPizzaVariants">
                                                            {productItem?.selected_pizza_variants.size?.data?.sauces?.map(
                                                              (
                                                                sauceItem: Record<
                                                                  string,
                                                                  any
                                                                >
                                                              ) => (
                                                                <>
                                                                  <b>
                                                                    {`${sauceItem.sauce_category.category_name} : `}
                                                                  </b>
                                                                  {sauceItem.data?.sauce_items?.map(
                                                                    (
                                                                      sItem: Record<
                                                                        string,
                                                                        any
                                                                      >
                                                                    ) =>
                                                                      sItem
                                                                        ?.sauce_item_data
                                                                        ?.name
                                                                  )}
                                                                </>
                                                              )
                                                            )}
                                                          </span>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                          <Divider
                                                            sx={{ my: 1 }}
                                                          />
                                                          <span className="primaryColor">
                                                            <b>Topping Items</b>
                                                          </span>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                          {productItem?.selected_pizza_variants.size?.data?.topping?.map(
                                                            (
                                                              toppingItem: Record<
                                                                string,
                                                                any
                                                              >
                                                            ) => (
                                                              <>
                                                                <span
                                                                  style={{
                                                                    width:
                                                                      "100%",
                                                                  }}
                                                                >
                                                                  <b>
                                                                    {`${toppingItem.topping_category.category_name} : `}
                                                                  </b>
                                                                  {toppingItem.data?.toppings_items?.map(
                                                                    (
                                                                      toppItem: Record<
                                                                        string,
                                                                        any
                                                                      >
                                                                    ) =>
                                                                      " " +
                                                                      toppItem
                                                                        ?.topping_item_data
                                                                        ?.name +
                                                                      ","
                                                                  )}
                                                                </span>
                                                                <br />
                                                              </>
                                                            )
                                                          )}
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                          <Divider
                                                            sx={{ my: 1 }}
                                                          />
                                                          <span className="primaryColor">
                                                            <b>Crust Items</b>
                                                          </span>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                          <span className="selectedPizzaVariants">
                                                            <b>{`
                                                              ${productItem?.selected_pizza_variants.size?.data?.crust?.crust_data.name} : `}</b>
                                                          </span>
                                                          <span>
                                                            {
                                                              productItem
                                                                ?.selected_pizza_variants
                                                                .size?.data
                                                                ?.crust?.data
                                                                .crust_name
                                                            }
                                                          </span>
                                                        </Grid>

                                                        <Grid item xs={12}>
                                                          <Divider
                                                            sx={{ my: 1 }}
                                                          />
                                                          <span className="primaryColor">
                                                            <b>Cheese Items</b>
                                                          </span>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                          {productItem?.selected_pizza_variants.size?.data?.cheese?.map(
                                                            (
                                                              cheeseItem: Record<
                                                                string,
                                                                any
                                                              >
                                                            ) => (
                                                              <>
                                                                <span
                                                                  style={{
                                                                    width:
                                                                      "100%",
                                                                  }}
                                                                >
                                                                  <b>
                                                                    {`${cheeseItem.cheese_category.category_name} : `}
                                                                  </b>
                                                                  {cheeseItem.data?.cheese_items?.map(
                                                                    (
                                                                      cheeItem: Record<
                                                                        string,
                                                                        any
                                                                      >
                                                                    ) =>
                                                                      " " +
                                                                      cheeItem
                                                                        ?.cheese_item_data
                                                                        ?.name +
                                                                      ","
                                                                  )}
                                                                </span>
                                                                <br />
                                                              </>
                                                            )
                                                          )}
                                                          <Divider
                                                            sx={{ my: 1 }}
                                                          />
                                                        </Grid>
                                                      </Grid>
                                                    )}
                                                    {/* //SELECTED VARIANT */}
                                                    {productItem?.selected_variants?.map(
                                                      (
                                                        selectedVar: Record<
                                                          string,
                                                          any
                                                        >,
                                                        indexSelectedVar: number
                                                      ) => (
                                                        <React.Fragment
                                                          key={indexSelectedVar}
                                                        >
                                                          <Grid
                                                            container
                                                            spacing={1}
                                                          >
                                                            <Grid item xs={12}>
                                                              <Typography
                                                                marginBottom={0}
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
                                                            <Grid item xs={12}>
                                                              <Typography
                                                                marginRight={5}
                                                                mt={"-5px"}
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
                                                                    <React.Fragment
                                                                      key={
                                                                        itemIndex
                                                                      }
                                                                    >
                                                                      {" " +
                                                                        item
                                                                          ?.item_data
                                                                          ?.variant_name}
                                                                      ,
                                                                    </React.Fragment>
                                                                  )
                                                                )}
                                                              </Typography>
                                                            </Grid>
                                                          </Grid>
                                                        </React.Fragment>
                                                      )
                                                    )}
                                                  </Grid>
                                                </Grid>
                                              </React.Fragment>
                                            )
                                          )}
                                        </Grid>
                                      </React.Fragment>
                                    )
                                  )}
                              </Grid>
                            </Grid>
                            {newOrdersBtn && (
                              <Button
                                disabled={
                                  ele.track_order[ele.track_order.length - 1]
                                    ?.status == "ready_to_pick_up"
                                    ? true
                                    : false
                                }
                                variant="contained"
                                // className="customBtn"
                                size="large"
                                color="warning"
                                fullWidth
                                onClick={() => handleReadyToPick(ele)}
                              >
                                <b> Ready to pick</b>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </React.Fragment>
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

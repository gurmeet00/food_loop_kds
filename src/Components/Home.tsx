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
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreController } from "./Controllers/store_controller.tsx";
import {
  setStore,
  setStoreDayDetails,
} from "./Redux_Store/Slices/StoreSlice.js";
import PageNotFound from "./PageNotFound.tsx";
import moment from "moment-timezone";
import { SocketController } from "./Controllers/socketController.tsx";
import {
  setAllOrder,
  setAllVoidOrder,
} from "./Redux_Store/Slices/OrderSlice.js";
import { textUpperCase } from "../helper/g_constants.ts";
const gToaster = new GToaster();
const storeController = new StoreController();
const socketController = new SocketController();
function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const GridNumber = useSelector((state: any) => state.orders?.gridNum);
  const ordersSliceData = useSelector((state: any) => state.orders?.allOrder);
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
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [voidOrders, setVoidOrders] = useState([]);
  const [storeDate, setStoreDate] = useState("");
  const [storeTime, setStoreTime] = useState("");

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
        socketController.connect(storeId);
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
    if (ordersSliceData.length > 0) {
      setOrders(ordersSliceData);
    }

    let response = await storeController.getStoreOrders({
      day_id: startDayId,
      store_Id: storeId,
    });
    setLoading(false);

    if (response.status == ApiStatus.STATUS_200) {
      setOrders(response.data.data);
      dispatch(setAllOrder(response.data.data));
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
    if (VoidOrdersSliceData.length > 0) {
      setVoidOrders(VoidOrdersSliceData);
    }

    let response = await storeController.getStoreVoidOrders({
      day_id: startDayId,
      store_Id: storeId,
    });
    setLoading(false);

    if (response.status == ApiStatus.STATUS_200) {
      setVoidOrders(response.data.data);
      dispatch(setAllVoidOrder(response.data.data));
    } else if (response.status == ApiStatus.STATUS_500) {
      gToaster.warning({ title: "500 Server Error" });
    } else {
      gToaster.warning({ title: " Server Error" });
    }
  }
  //==========================================================================================

  // let data = [
  //   {
  //     type: "Dining",
  //     customer: "Walking Customer",
  //     created_at: "2024-03-27 05:24:25",
  //     dining: "Table (10)",
  //     orderid: "# 202403739",
  //     items: [
  //       "1 x Spinach Artichoke Dip",

  //       "1 x Tomato Soup",

  //       "1 x Jalapeno Poppers",

  //       "1 x Chicken Noodle Soup",
  //     ],
  //   },
  //   {
  //     type: "Dining",
  //     customer: "Walking Customer",
  //     created_at: "2024-03-27 05:24:25",
  //     dining: "Table (10)",
  //     orderid: "# 202403739",
  //     items: [
  //       "1 x Spinach Artichoke Dip",

  //       "1 x Tomato Soup",

  //       "1 x Jalapeno Poppers",

  //       "1 x Chicken Noodle Soup",
  //     ],
  //   },
  //   {
  //     type: "Dining",
  //     customer: "Walking Customer",
  //     created_at: "2024-03-27 05:24:25",
  //     dining: "Table (10)",
  //     orderid: "# 202403739",
  //     items: [
  //       "1 x Spinach Artichoke Dip",

  //       "1 x Tomato Soup",

  //       "1 x Jalapeno Poppers",

  //       "1 x Chicken Noodle Soup",
  //     ],
  //   },
  //   {
  //     type: "Dining",
  //     customer: "Walking Customer",
  //     created_at: "2024-03-27 05:24:25",
  //     dining: "Table (10)",
  //     orderid: "# 202403739",
  //     items: [
  //       "1 x Spinach Artichoke Dip",

  //       "1 x Tomato Soup",

  //       "1 x Jalapeno Poppers",

  //       "1 x Chicken Noodle Soup",
  //     ],
  //   },
  //   {
  //     type: "Dining",
  //     customer: "Walking Customer",
  //     created_at: "2024-03-27 05:24:25",
  //     dining: "Table (10)",
  //     orderid: "# 202403739",
  //     items: [
  //       "1 x Spinach Artichoke Dip",

  //       "1 x Tomato Soup",

  //       "1 x Jalapeno Poppers",

  //       "1 x Chicken Noodle Soup",
  //     ],
  //   },
  //   {
  //     type: "Dining",
  //     customer: "Walking Customer",
  //     created_at: "2024-03-27 05:24:25",
  //     dining: "Table (10)",
  //     orderid: "# 202403739",
  //     items: [
  //       "1 x Spinach Artichoke Dip",

  //       "1 x Tomato Soup",

  //       "1 x Jalapeno Poppers",

  //       "1 x Chicken Noodle Soup",
  //     ],
  //   },
  //   {
  //     type: "Dining",
  //     customer: "Walking Customer",
  //     created_at: "2024-03-27 05:24:25",
  //     dining: "Table (10)",
  //     orderid: "# 202403739",
  //     items: [
  //       "1 x Spinach Artichoke Dip",

  //       "1 x Tomato Soup",

  //       "1 x Jalapeno Poppers",

  //       "1 x Chicken Noodle Soup",
  //     ],
  //   },
  //   {
  //     type: "Dining",
  //     customer: "Walking Customer",
  //     created_at: "2024-03-27 05:24:25",
  //     dining: "Table (10)",
  //     orderid: "# 202403739",
  //     items: [
  //       "1 x Spinach Artichoke Dip",

  //       "1 x Tomato Soup",

  //       "1 x Jalapeno Poppers",

  //       "1 x Chicken Noodle Soup",
  //     ],
  //   },
  // ];

  // async function getAllUsers() {
  //   const data = await axios.get("https://dummyjson.com/products");
  //   return data;
  // }

  // const { data: newData, isLoading: productLoader } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: getAllUsers,
  // });
  useEffect(() => {
    if (storeId) {
      getStoreDay();
      // socketController.connect("659e6700e0ec95ac62733139");
      getStoreProfile();
    } else {
      setNotFound(true);
    }

    // return () => {
    //   console.log("print ");
    //   socketController.disConnect();
    // };
  }, []);
  return (
    <>
      {notFound ? (
        <PageNotFound />
      ) : (
        <>
          <Card className="cardDesign">
            <CardContent style={{ paddingBottom: "15px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3.5} md={2.5} lg={2} xl={1.5}>
                  <Button
                    variant={newOrdersBtn ? "contained" : "outlined"}
                    size="small"
                    color="warning"
                    onClick={() => activeNewOldOrders("newOrder")}
                  >
                    New/Upcoming Orders
                  </Button>
                </Grid>
                <Grid item xs={12} sm={3.5} md={6} lg={7} xl={8.7}>
                  <Button
                    variant={cancelOrdersBtn ? "contained" : "outlined"}
                    // className="customBtn"
                    size="small"
                    color="warning"
                    onClick={() => activeNewOldOrders("cancelOrder")}
                  >
                    Cancel/Void Orders
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sm={1.5}
                  md={1}
                  lg={1}
                  xl={0.5}
                  sx={{ textAlign: { xs: "center" } }}
                >
                  <Button
                    variant={all ? "contained" : "outlined"}
                    // className="customBtn"
                    color="warning"
                    size="small"
                    onClick={() => handleActive("all")}
                  >
                    All
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sm={1.5}
                  md={1}
                  lg={1}
                  xl={0.5}
                  sx={{ textAlign: { xs: "center" } }}
                >
                  <Button
                    variant={dining ? "contained" : "outlined"}
                    // className="customBtn"
                    color="warning"
                    size="small"
                    onClick={() => handleActive("dining")}
                  >
                    Dining
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sm={2}
                  md={1.5}
                  lg={1}
                  xl={0.8}
                  sx={{ textAlign: { xs: "center" } }}
                >
                  <Button
                    variant={takeAway ? "contained" : "outlined"}
                    // className="customBtn"
                    color="warning"
                    size="small"
                    onClick={() => handleActive("takeAway")}
                  >
                    Take Away
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Grid container spacing={3.5} sx={{ my: 1, px: 2 }}>
            {loading ? (
              <>
                <Box sx={{ textAlign: "center", py: "50px" }}>
                  <CircularProgress color="warning" />
                </Box>
              </>
            ) : (
              <>
                {(newOrdersBtn
                  ? orders
                  : cancelOrdersBtn
                  ? voidOrders
                  : []
                )?.map((ele: Record<string, any>) => (
                  <>
                    <Grid item xs={12} sm={6} md={4} lg={GridNumber}>
                      <Card
                        sx={{
                          boxShadow: "1px 1px 5px 0px grey",
                          borderRadius: "5px",
                        }}
                      >
                        <CardContent>
                          <Box className="flexCenterBox">
                            <Typography paragraph={true}>
                              <b>#{ele?._id}</b>
                            </Typography>
                            <Typography
                              paragraph={true}
                              sx={{
                                backgroundColor: "#F26720",
                                color: "white",
                                padding: "0px 8px",
                                borderRadius: "10px",
                              }}
                            >
                              {textUpperCase(ele?.order_type)}
                            </Typography>
                          </Box>

                          <Box className="flexCenterBox">
                            <Typography paragraph={true}>Customer :</Typography>
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
                                {ele?.dining ? ele?.dining : "-"}
                              </Typography>

                              <Typography paragraph={true}>
                                {ele?.dining ? ele?.dining : "-"}
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
                            {(ele?.take_away.length > 0
                              ? ele?.take_away
                              : ele?.dine_in.length > 0
                              ? ele?.dine_in
                              : []
                            ).map(
                              (foodItems: Record<string, any>, index: any) => (
                                <>
                                  <Box className="flexCenterBox">
                                    <Typography paragraph={true}>
                                      {foodItems?.order_id}
                                    </Typography>
                                  </Box>
                                  {foodItems?.product.map(
                                    (
                                      productItem: Record<string, any>,
                                      index: number
                                    ) => (
                                      <>
                                        <Box className="flexCenterBox">
                                          <Typography paragraph={true}>
                                            <Checkbox
                                              defaultChecked
                                              size="small"
                                              color="warning"
                                            />
                                            {productItem?.quantity +
                                              " x " +
                                              productItem?.product?.name}
                                          </Typography>
                                          <Typography paragraph={true}>
                                            {currencySymbol}{" "}
                                            {productItem?.price?.price}
                                          </Typography>
                                        </Box>
                                      </>
                                    )
                                  )}

                                  {/*
                                  <Typography
                                    paragraph={true}
                                    sx={{ mb: "4px" }}
                                  >
                                    <Checkbox
                                      defaultChecked
                                      size="small"
                                      color="warning"
                                    />
                                    <br />
                                    {index % 2 != 0 && (
                                      <Box
                                        style={{
                                          fontSize: "10px",
                                          color: "grey",
                                          paddingLeft: "40px",
                                        }}
                                      >
                                        1 x Cap katchuo <br />
                                        1 x Creamer <br />1 x Sugar
                                      </Box>
                                    )}
                                  </Typography> */}
                                </>
                              )
                            )}
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
                    </Grid>
                  </>
                ))}
              </>
            )}
          </Grid>
        </>
      )}
    </>
  );
}

export default Home;

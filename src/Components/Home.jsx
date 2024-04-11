import React, { useEffect, useState } from "react";
import Header from "./Header";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import CachedIcon from "@mui/icons-material/Cached";
function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const GridNumber = useSelector((state) => state.data.gridNum);
  const [all, setAll] = useState(true);
  const [dining, setDining] = useState(false);
  const [takeAway, setTakeAway] = useState(false);

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

  let slug = searchParams.get("slug");
  let storeId = searchParams.get("id");
  let data = [
    {
      type: "Dining",
      customer: "Walking Customer",
      created_at: "2024-03-27 05:24:25",
      dining: "Table (10)",
      orderid: "# 202403739",
      items: [
        "1 x Spinach Artichoke Dip",

        "1 x Tomato Soup",

        "1 x Jalapeno Poppers",

        "1 x Chicken Noodle Soup",
      ],
    },
    {
      type: "Dining",
      customer: "Walking Customer",
      created_at: "2024-03-27 05:24:25",
      dining: "Table (10)",
      orderid: "# 202403739",
      items: [
        "1 x Spinach Artichoke Dip",

        "1 x Tomato Soup",

        "1 x Jalapeno Poppers",

        "1 x Chicken Noodle Soup",
      ],
    },
    {
      type: "Dining",
      customer: "Walking Customer",
      created_at: "2024-03-27 05:24:25",
      dining: "Table (10)",
      orderid: "# 202403739",
      items: [
        "1 x Spinach Artichoke Dip",

        "1 x Tomato Soup",

        "1 x Jalapeno Poppers",

        "1 x Chicken Noodle Soup",
      ],
    },
    {
      type: "Dining",
      customer: "Walking Customer",
      created_at: "2024-03-27 05:24:25",
      dining: "Table (10)",
      orderid: "# 202403739",
      items: [
        "1 x Spinach Artichoke Dip",

        "1 x Tomato Soup",

        "1 x Jalapeno Poppers",

        "1 x Chicken Noodle Soup",
      ],
    },
    {
      type: "Dining",
      customer: "Walking Customer",
      created_at: "2024-03-27 05:24:25",
      dining: "Table (10)",
      orderid: "# 202403739",
      items: [
        "1 x Spinach Artichoke Dip",

        "1 x Tomato Soup",

        "1 x Jalapeno Poppers",

        "1 x Chicken Noodle Soup",
      ],
    },
    {
      type: "Dining",
      customer: "Walking Customer",
      created_at: "2024-03-27 05:24:25",
      dining: "Table (10)",
      orderid: "# 202403739",
      items: [
        "1 x Spinach Artichoke Dip",

        "1 x Tomato Soup",

        "1 x Jalapeno Poppers",

        "1 x Chicken Noodle Soup",
      ],
    },
    {
      type: "Dining",
      customer: "Walking Customer",
      created_at: "2024-03-27 05:24:25",
      dining: "Table (10)",
      orderid: "# 202403739",
      items: [
        "1 x Spinach Artichoke Dip",

        "1 x Tomato Soup",

        "1 x Jalapeno Poppers",

        "1 x Chicken Noodle Soup",
      ],
    },
    {
      type: "Dining",
      customer: "Walking Customer",
      created_at: "2024-03-27 05:24:25",
      dining: "Table (10)",
      orderid: "# 202403739",
      items: [
        "1 x Spinach Artichoke Dip",

        "1 x Tomato Soup",

        "1 x Jalapeno Poppers",

        "1 x Chicken Noodle Soup",
      ],
    },
  ];

  // async function getAllUsers() {
  //   const data = await axios.get("https://dummyjson.com/products");
  //   return data;
  // }

  // const { data: newData, isLoading: productLoader } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: getAllUsers,
  // });
  useEffect(() => {
    console.log(storeId, slug);
  }, []);
  return (
    <>
      <Card className="cardDesign">
        <CardContent style={{ paddingBottom: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3.5} md={2.5} lg={2} xl={1.5}>
              <Button variant="contained" className="customBtn" size="small">
                New/Upcoming Orders
              </Button>
            </Grid>
            <Grid item xs={12} sm={3.5} md={6} lg={7} xl={8.7}>
              <Button variant="contained" className="customBtn" size="small">
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
      <Grid
        container
        spacing={3.5}
        sx={{ justifyContent: "center", my: 1, px: 2 }}
      >
        {data?.map((ele) => (
          <>
            <Grid item xs={12} sm={6} md={4} lg={GridNumber}>
              <Card
                sx={{ boxShadow: "1px 1px 5px 0px grey", borderRadius: "5px" }}
              >
                <CardContent>
                  <Box className="flexCenterBox">
                    <Typography paragraph={true}>
                      <b>{ele.orderid}</b>
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
                      {ele.type}
                    </Typography>
                  </Box>

                  <Box className="flexCenterBox">
                    <Typography paragraph={true}>Customer :</Typography>
                    <Typography paragraph={true}>{ele.customer}</Typography>
                  </Box>
                  <Box className="flexCenterBox">
                    <Typography paragraph={true}>Created At :</Typography>
                    <Typography paragraph={true}>{ele.created_at}</Typography>
                  </Box>
                  <Box className="flexCenterBox">
                    <Typography paragraph={true}>Dining :</Typography>
                    <Typography paragraph={true}>{ele.dining}</Typography>
                  </Box>

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
                    {ele.items.map((foodItems, index) => (
                      <>
                        <Typography paragraph={true} sx={{ mb: "4px" }}>
                          <Checkbox
                            defaultChecked
                            size="small"
                            color="warning"
                          />
                          {foodItems}
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
                        </Typography>
                      </>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    className="customBtn"
                    size="small"
                    fullWidth
                  >
                    Ready to pick
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </>
        ))}
      </Grid>
    </>
  );
}

export default Home;

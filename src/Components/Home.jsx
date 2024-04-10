import React, { useEffect, useState } from "react";
import Header from "./Header";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
function Home() {
  const [mygrid, setmygrid] = useState(3);
  const [searchParams, setSearchParams] = useSearchParams();
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
      <h1>
        {storeId}
        {slug}
      </h1>
      <Card className="cardDesign">
        <CardContent style={{ paddingBottom: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={2} md={0.5}>
              <Fab variant="outlined" className="customBtn" size="small">
                <ReplayIcon />
              </Fab>
            </Grid>
            <Grid item xs={11} md={8.5}>
              <FormControl
                color="error"
                size="small"
                fullWidth
                sx={{
                  fontFamily: "poppins",
                  width: {
                    xs: "100%",
                    md: "30%",
                  },
                }}
              >
                <InputLabel color="error" id="demo-simple-select-label">
                  View Layout
                </InputLabel>
                <Select
                  size="small"
                  color="error"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={mygrid}
                  label="View Layout"
                  onChange={(e) => setmygrid(e.target.value)}
                >
                  <MenuItem value={12}>1</MenuItem>
                  <MenuItem value={6}>2</MenuItem>
                  <MenuItem value={4}>3</MenuItem>
                  <MenuItem value={3}>4</MenuItem>
                </Select>
              </FormControl>
              {/* <TextField
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                color="error"
                label="Search Order"
                placeholder="Enter"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                      <CloseIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: {
                    xs: "100%",
                    md: "30%",
                    fontFamily: "poppins",
                  },
                }}
              /> */}
            </Grid>

            <Grid item xs={4} md={1} sx={{ textAlign: { xs: "center" } }}>
              <Button variant="contained" className="customBtn" size="small">
                All
              </Button>
            </Grid>
            <Grid item xs={4} md={1} sx={{ textAlign: { xs: "center" } }}>
              <Button variant="contained" className="customBtn" size="small">
                Dining
              </Button>
            </Grid>
            <Grid item xs={4} md={1} sx={{ textAlign: { xs: "center" } }}>
              <Button variant="contained" className="customBtn" size="small">
                Take Away
              </Button>
            </Grid>

            {/* <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid> */}
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
            <Grid item xs={12} sm={6} md={4} lg={mygrid}>
              <Card
                sx={{ boxShadow: "1px 1px 5px 0px grey", borderRadius: "5px" }}
              >
                <CardContent>
                  <Box className="flexCenterBox">
                    <Typography paragraph={true}>Type :</Typography>
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
                    <Typography paragraph={true}>
                      <b>Order </b>:
                    </Typography>
                    <Typography paragraph={true}>
                      <b>{ele.orderid}</b>
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

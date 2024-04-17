import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
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
} from "@mui/material";
import { useSelector } from "react-redux";
import CachedIcon from "@mui/icons-material/Cached";
function Header() {
  const dispatch = useDispatch();
  const GridNumber = useSelector((state: any) => state.orders?.gridNum);

  return (
    <>
      <Card className="cardDesign">
        <CardContent style={{ paddingBottom: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8} md={9} lg={10.5}>
              <img src="/logo/loop_logo.gif" alt="logo" width={160} />
            </Grid>
            <Grid
              item
              xs={2}
              sm={1}
              md={1}
              lg={0.5}
              sx={{ textAlign: { xs: "left", md: "center" } }}
            >
              <Fab color="warning" size="small">
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
                  <MenuItem value={5}>5</MenuItem>
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

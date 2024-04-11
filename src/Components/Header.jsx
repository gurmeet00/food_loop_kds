import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setAllOrder, setGridNum } from "./Redux_Store/OrderSlice";
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
  const GridNumber = useSelector((state) => state.data.gridNum);

  useEffect(() => {
    dispatch(setAllOrder(["Gurmeet"]));
  }, []);
  return (
    <>
      <Card className="cardDesign">
        <CardContent style={{ paddingBottom: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={10.5}>
              <img src="/logo/loop_logo.gif" alt="logo" width={160} />
            </Grid>
            <Grid
              item
              xs={1}
              md={0.5}
              sx={{ textAlign: { xs: "left", md: "center" } }}
            >
              <Fab color="warning" size="small">
                <CachedIcon />
              </Fab>
            </Grid>
            <Grid item xs={11} md={1}>
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
                  <MenuItem value={12}>1</MenuItem>
                  <MenuItem value={6}>2</MenuItem>
                  <MenuItem value={4}>3</MenuItem>
                  <MenuItem value={3}>4</MenuItem>
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

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { setAllOrder } from "./Redux_Store/OrderSlice";
import { Card, CardContent, Grid } from "@mui/material";

function Header() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAllOrder(["Gurmeet"]));
  });
  return (
    <>
      <Card className="cardDesign">
        <CardContent style={{ paddingBottom: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <img src="/logo/loop_logo.gif" alt="logo" width={160} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
}

export default Header;

import { Button, Card, CardContent, Grid } from "@mui/material";
import React from "react";

function ButttonBar({
  activeBtn,
  allBtn,
  diningBtn,
  takeAwayBtn,
  activeNewOldBtn,
  newOrdersBtn,
  cancelOrdersBtn,
  completeOrdersBtn,
}) {
  return (
    <>
      <Card className="cardDesign">
        <CardContent style={{ paddingBottom: "15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3.5} md={2.8} lg={2.5} xl={1.4}>
              <Button
                variant={newOrdersBtn ? "contained" : "outlined"}
                size="small"
                color="warning"
                fullWidth
                onClick={() => activeNewOldBtn("newOrder")}
              >
                New/Upcoming Orders
              </Button>
            </Grid>
            <Grid item xs={12} sm={3.5} md={2.6} lg={2} xl={1.3}>
              <Button
                variant={cancelOrdersBtn ? "contained" : "outlined"}
                // className="customBtn"
                size="small"
                color="warning"
                fullWidth
                onClick={() => activeNewOldBtn("cancelOrder")}
              >
                Cancel/Void Orders
              </Button>
            </Grid>
            <Grid item xs={12} sm={3.5} md={3} lg={2} xl={1.5}>
              <Button
                variant={completeOrdersBtn ? "contained" : "outlined"}
                // className="customBtn"
                size="small"
                fullWidth
                color="warning"
                onClick={() => activeNewOldBtn("completeOrder")}
              >
                Completed Orders
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              lg={2}
              xl={5.3}
              sx={{ display: { xs: "none", lg: "block" } }}
            ></Grid>
            <Grid
              item
              xs={4}
              sm={1.5}
              md={1}
              lg={1}
              xl={0.7}
              sx={{ textAlign: { xs: "center" } }}
            >
              <Button
                variant={allBtn ? "contained" : "outlined"}
                // className="customBtn"
                color="warning"
                fullWidth
                size="small"
                onClick={() => activeBtn("all")}
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
              xl={0.7}
              sx={{ textAlign: { xs: "center" } }}
            >
              <Button
                variant={diningBtn ? "contained" : "outlined"}
                // className="customBtn"
                color="warning"
                fullWidth
                size="small"
                onClick={() => activeBtn("dining")}
              >
                Dining
              </Button>
            </Grid>
            <Grid
              item
              xs={4}
              sm={2}
              md={1.5}
              lg={1.5}
              xl={1}
              sx={{ textAlign: { xs: "center" } }}
            >
              <Button
                variant={takeAwayBtn ? "contained" : "outlined"}
                // className="customBtn"
                color="warning"
                fullWidth
                size="small"
                onClick={() => activeBtn("takeAway")}
              >
                Take Away
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default ButttonBar;

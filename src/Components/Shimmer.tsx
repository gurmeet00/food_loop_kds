import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
function Shimmer() {
  const GridNumber = useSelector((state: any) => state.orders?.gridNum);

  return (
    <>
      {[...Array(8)].map((_, index: number) => (
        <React.Fragment key={index}>
          <Grid item md={GridNumber == 2 ? 6 : GridNumber == 3 ? 4 : 3}>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={7}>
                    <Skeleton variant="rounded" height={28} />
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={4}>
                    <Skeleton
                      variant="rounded"
                      height={28}
                      sx={{ borderRadius: "25px " }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Skeleton variant="rounded" height={28} />
                  </Grid>
                  <Grid item xs={5}></Grid>
                  <Grid item xs={3}>
                    <Skeleton variant="rounded" height={28} />
                  </Grid>

                  <Grid item xs={4.5}>
                    <Skeleton variant="rounded" height={28} />
                  </Grid>
                  <Grid item xs={2.5}></Grid>
                  <Grid item xs={5}>
                    <Skeleton variant="rounded" height={28} />
                  </Grid>

                  <Grid
                    item
                    xs={3.6}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Skeleton variant="circular" width={20} />

                    <Skeleton variant="rounded" width={100} height={28} />
                  </Grid>
                  <Grid item xs={4.6}></Grid>
                  <Grid
                    item
                    xs={3.8}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Skeleton variant="circular" width={20} />

                    <Skeleton variant="rounded" width={100} height={28} />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={1}
                  sx={{
                    backgroundColor: "#f2f2f299",
                    borderRadius: "8px",
                    padding: "6px 15px",
                    my: "15px",
                    py: "15px",
                  }}
                  className="cardItems"
                >
                  <Grid item xs={12}>
                    <Skeleton variant="rounded" height={28} />
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid
                    item
                    md={1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Skeleton variant="circular" width={20} />
                  </Grid>

                  <Grid item md={11}>
                    <Grid container spacing={2}>
                      <Grid item md={1}>
                        <Skeleton
                          variant="rectangular"
                          width={20}
                          sx={{ mt: "4px" }}
                        />
                      </Grid>
                      <Grid item md={11}>
                        <Skeleton variant="rounded" height={28} />
                      </Grid>

                      <Grid item md={1}>
                        <Skeleton
                          variant="rectangular"
                          width={20}
                          sx={{ mt: "4px" }}
                        />
                      </Grid>
                      <Grid item md={11}>
                        <Skeleton variant="rounded" height={28} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={12}>
                    <Skeleton variant="rounded" height={250} />
                  </Grid>
                  <Grid item md={12}>
                    <Skeleton variant="rounded" height={40} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </React.Fragment>
      ))}
    </>
  );
}

export default Shimmer;

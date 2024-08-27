import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";
import HeaderAndLayout from '../layouts/HeaderAndLayout';
import PieChart from "./PieChart";
import BarChart from "./UserBarChart";
import IntegerViews from "./integerViews";
import ListingClicksCharts from './ListingClicksChart';



export default function Reports() {

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <HeaderAndLayout activeItem={"reports"} />
      <Grid container spacing={3} justify="center" m={2}>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
        >
          <PieChart />
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
        >
          <BarChart />
        </Grid>
      </Grid>
      <Grid container spacing={3} justify="center" m={2}>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
        >
          <IntegerViews />
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={6}
        >
          <ListingClicksCharts />
        </Grid>
      </Grid>
    </div>
  );
}

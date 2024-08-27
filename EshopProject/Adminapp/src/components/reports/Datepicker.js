import React, { useState } from "react";
import { Grid, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({

  itemdate: {
    marginLeft: "12rem",
    display: "flex",
    justifyContent: "center",
    border: "none",
    marginTop: "1rem",
    marginBottom:"1.5rem"
  },

  dateinput: {
    margin: "0rem",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    alignItems: "center",
    display: "flex",
    border: "none",
    fontSize: "20px"
  },

}));

export default function Datepicker({ setStartDate, startDate }) {

  const classes = useStyles();
  return (
    <div>
      <Grid item xs={12} md={5}>
        <Grid
          item
          xs={12}
          md={12}
          className={classes.itemdate}
        >
          <input className={classes.dateinput} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Grid>
      </Grid>

    </div>
  )
}


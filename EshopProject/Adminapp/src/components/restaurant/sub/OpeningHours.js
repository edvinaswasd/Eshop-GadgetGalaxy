import React  from "react";
import {
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Grid,
} from "@material-ui/core";
import { Field } from "formik";
import { TextField } from "formik-material-ui";

export default function OpeningHours({ values, setFieldValue }) {
  const handleChange = (e, i, type) => {
    if (type === "from") {
      setFieldValue(`openingHours[${i}].from`, e.target.value);
    } else if (type === "to") {
      setFieldValue(`openingHours[${i}].to`, e.target.value);
    } else if(type==="allDayOpen"){
      setFieldValue(
        `openingHours[${i}].isAllDayOpen`,
        !values.openingHours[i].isAllDayOpen
      );
      setFieldValue(
        `openingHours[${i}].isAllDayClosed`,
          false
      );

    }else{
      setFieldValue(
        `openingHours[${i}].isAllDayClosed`,
        !values.openingHours[i].isAllDayClosed
      );
      setFieldValue(
        `openingHours[${i}].isAllDayOpen`,
          false
      );
    }
  };
  return (
    <Grid container>
      <div style={{ width: "100%" }}>
        <Typography component="div" bgcolor="#748ca3">
          <Box
            component="span"
            display="block"
            p={1}
            m={1}
            fontWeight="fontWeightMedium"
            fontFamily="Roboto"
          >
            Opening Hours
          </Box>
        </Typography>
      </div>
      {values.openingHours.map((day, i) => (
        <Grid key={day.day} container item xs={12} sm={6} md={12}>
          <Grid item xs={12} sm={12} md={2}>
            {day.day}
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Field
              name="from"
              label="From"
              component={TextField}
              variant="outlined"
              type="time"
              value={values.openingHours[i].from}
              onChange={(e) => {
                e.persist();
                handleChange(e, i, "from");
              }}
            ></Field>
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            {" "}
            <Field
              name="to"
              label="To"
              component={TextField}
              variant="outlined"
              type="time"
              value={values.openingHours[i].to}
              onChange={(e) => {
                e.persist();
                handleChange(e, i, "to");
              }}
            ></Field>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="tags"
                  value={values.openingHours[i].isAllDayOpen}
                  onChange={(e) => {
                    e.persist();
                    handleChange(e, i, "allDayOpen");
                  }}
                  checked={values.openingHours[i].isAllDayOpen}
                />
              }
              label="Always open"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <FormControlLabel
              control={
                <Checkbox
                  name="tags"
                  value={values.openingHours[i].isAllDayClosed}
                  onChange={(e) => {
                    e.persist();
                    handleChange(e, i, "allDayClosed");
                  }}
                  checked={values.openingHours[i].isAllDayClosed}
                />
              }
              label="Always Closed"
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

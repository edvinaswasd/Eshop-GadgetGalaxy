import React from "react";

import { getIn } from "formik";
// import { TextField } from "formik-material-ui";
import { TextField } from "@material-ui/core";
const ArrayInput = ({ field, form: { errors } }) => {
 
  const errorMessage = getIn(errors, field.name);
  return (
    <>
      <TextField {...field} variant="outlined"/>
      {errorMessage && <div>{errorMessage}</div>}
    </>
  );
};

export default ArrayInput;

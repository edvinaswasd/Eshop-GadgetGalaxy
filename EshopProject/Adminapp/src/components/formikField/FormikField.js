import React from "react";
import { Field,ErrorMessage } from "formik";

import { TextField } from "@material-ui/core";
export default function FormikField({ label = "Email", name = "name" }) {
  return (
    <div>
      <Field
        as={TextField}
        label={label}
        variant="outlined"
        fullWidth
        name={name}
        required
        helperText={<ErrorMessage name={name}></ErrorMessage>}
        margin="dense"

      ></Field>
    </div>
  );
}

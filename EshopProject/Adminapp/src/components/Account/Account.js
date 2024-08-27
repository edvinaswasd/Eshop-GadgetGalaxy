import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";
import green from "@material-ui/core/colors/green";

// validation
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  center: {
    textAlign: "center",
  },
  padding: {
    padding: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: yellow,
  },
});

export default function User(props) {
  const classes = useStyles();

  const componentType ="create";
  const [callingBackend, setCallingBackend] = useState(false);

  const initialValues={ 
    oldPassword: "",
    newPassword:''
  }

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const submit = async (e, { resetForm }) => {
    
      try {
        setCallingBackend(true);
        await axios.put("/user/update-password-admin", {
          oldPassword: e.oldPassword,
          newPassword:e.newPassword
        });
        resetForm();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Password changed successfully!",
        });
      } catch (error) {
        if (error.response.status === 403) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "error!",
          });
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Password change failed!",
          });
        }
      } finally {
        setCallingBackend(false);
      }
    
  };



  // validation schema
  let validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New Password is required!")
      .min(3, "Min length for the Password is 6"),
    oldPassword: Yup.string()
      .required("Old Password is required!")
      .min(3, "Min length for the Password is 6")
     
  });

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item xs={12} sm={12} md={12}>
        <Formik
          initialValues={initialValues}
          onSubmit={submit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ isValid, dirty }) => {
            return (
              <Form>
                <Card>
                  <CardHeader
                    title={
                      componentType === "create"
                        ? "Change Password"
                        : "Update the Dish Category"
                    }
                  />
                  <CardContent>
                    <Grid container item spacing={2} xs={12} sm={12} md={12}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="oldPassword"
                          label="Old Password"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="newPassword"
                          label="New Password"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={2}
                        ></Field>
                      </Grid>
                    </Grid>

                   
                  </CardContent>
                  <CardActions>
                    {callingBackend ? (
                      "Please Wait..."
                    ) : (
                      <ThemeProvider theme={theme}>
                        <Button
                          variant="contained"
                          className={classes.button}
                          color={
                            componentType === "create" ? "primary" : "secondary"
                          }
                          type="submit"
                          disabled={!dirty || !isValid}
                        >
                          {componentType === "create" ? "Change" : "update"}
                        </Button>
                      </ThemeProvider>
                    )}
                  </CardActions>
                </Card>
              </Form>
            );
          }}
        </Formik>
      </Grid>
      {alert.showAlert && (
        <Grid item sm={12} md={12} xs={12}>
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, showAlert: false })}
          >
            {alert.message}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
}

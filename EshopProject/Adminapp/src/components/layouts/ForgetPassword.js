import React, { Fragment, useState } from "react";

import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { resetPass } from "../../store/actions/authActions";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

// validation
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// import FormikField from "../formikField/FormikField";
import { TextField } from "formik-material-ui";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    height: "100%",
  },
  center: {
    textAlign: "center",
  },
  padding: {
    padding: theme.spacing(3),
  },
}));

let emailValidation = Yup.object().shape({
  showEmail: Yup.boolean(),
  email: Yup.string()
    .email()
    .when("showEmail", {
      is: true,
      then: Yup.string().required("Email is required!"),
    }),
  code: Yup.string().when("showEmail", {
    is: false,
    then: Yup.string().required("Please enter valid code"),
  }),
  newPassword: Yup.string().when("showEmail", {
    is: false,
    then: Yup.string()
      .required("Password is required!")
      .min(6, "Min length for the password is 6.")
      .max(15, "Max length for the password is 15."),
  }),
});

function ForgetPassword(props) {
  // const [values, setValues] = React.useState({
  //   amount: "",
  //   password: "",
  //   weight: "",
  //   weightRange: "",
  //   showPassword: false,
  // });

  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [initialValues, setInitialValues] = useState({
    email: "",
    code: "",
    newPassword: "",
    showEmail: true,
    showPassword: false,
  });
  const handleClickShowPassword = (e) => {
    setInitialValues({
      email: e.email,
      code: e.code,
      newPassword: e.newPassword,
      showEmail: e.showEmail,
      showPassword: !e.showPassword,
    });
  };

  const classes = useStyles();

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const submit = async (e) => {
    if (initialValues.showEmail) {
      try {
        await axios.post("/user/reset-request", {
          local: {
            email: e.email,
          },
        });
        setInitialValues({
          ...initialValues,
          showEmail: false,
          email: e.email,
        });
      } catch (error) {
        if (error.response.status === 401) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Unauthorized!",
          });
        } else if (error.response.status === 422) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Email Not found",
          });

          setTimeout(() => {
            setAlert({
              showAlert: false,
              severity: "error",
              message: "",
            });
          }, 3000);
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Server error!",
          });
        }
      }
    } else {
      //reset password

      try {
          await axios.put("/user/reset-password", {
          email: e.email,
          password: e.newPassword,
          token: e.code,
        });
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Password updated successfully!",
        });
        setTimeout(() => {
          setAlert({
            showAlert: false,
            severity: "success",
            message: "",
          });

          const path = "/";
          props.history.push(path);
        }, 3000);
      } catch (error) {
        if (error.response.status === 401) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Incorrect Code!",
          });
          setTimeout(() => {
            setAlert({
              showAlert: false,
              severity: "error",
              message: "",
            });
          }, 3000);
        } else if (error.response.status === 422) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Email Not found",
          });

          setTimeout(() => {
            setAlert({
              showAlert: false,
              severity: "error",
              message: "",
            });
          }, 3000);
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Server error!",
          });
        }
      }
    }
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.root}
      spacing={1}
    >
      <div className="wrapper">
        <div className="right">
          <div className="forgetPass">
            <Grid item md={12}>
              <Card className={classes.padding} variant="outlined">
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  onSubmit={submit}
                  validationSchema={emailValidation}
                >
                  {({ dirty, isValid,values }) => {
                    return (
                      <Form>
                        <CardHeader
                          title={
                            values.showEmail
                              ? "Type you're recovery email here!"
                              : "Enter code"
                          }
                          className={classes.center}
                          //disabled={count >= 1}
                        ></CardHeader>
                        <CardContent>
                         
                          {values.showEmail ? (
                            <Field
                              name="email"
                              label="Email"
                              component={TextField}
                              variant="outlined"
                              fullWidth
                              margin="dense"
                            ></Field>
                          ) : (
                            <Fragment>
                              <Field
                                name="code"
                                label="Code"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                type="number"
                                margin="dense"
                              ></Field>
                              <Field
                                name="newPassword"
                                label="New Password"
                                component={TextField}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                type={values.showPassword ? "text" : "password"}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                          handleClickShowPassword(values)
                                        }
                                        onMouseDown={handleMouseDownPassword}
                                      >
                                        {values.showPassword ? (
                                          <Visibility />
                                        ) : (
                                          <VisibilityOff />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              ></Field>
                            </Fragment>
                          )}
                        </CardContent>
                        <CardActions>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={!dirty || !isValid}
                            type="submit"
                          >
                            Send
                          </Button>
                        </CardActions>
                      </Form>
                    );
                  }}
                </Formik>
              </Card>
            </Grid>

            {alert.showAlert && (
              <Grid item md={12}>
                <Alert
                  severity={alert.severity}
                  onClose={() =>
                    setAlert({
                      ...alert,
                      showAlert: false,
                    })
                  }
                >
                  {alert.message}
                </Alert>
              </Grid>
            )}
          </div>
        </div>
      </div>
    </Grid>
  );
}

export default connect(null, { resetPass })(ForgetPassword);

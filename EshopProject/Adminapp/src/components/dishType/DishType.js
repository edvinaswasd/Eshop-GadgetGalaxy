import React, { useState, useEffect } from "react";
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

  const [componentType, setComponentType] = useState("create");
  const [callingBackend, setCallingBackend] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: "",
    description:''
  });

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const submit = async (e, { resetForm }) => {
    if (componentType === "create") {
      try {
        setCallingBackend(true);
        await axios.post("/dishtype", {
          name: e.name,
          description:e.description
        });
        resetForm();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Dish created successfully!",
        });
      } catch (error) {
        if (error.response.status === 403) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Dish already exists!",
          });
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Dish creation failed!",
          });
        }
      } finally {
        setCallingBackend(false);
      }
    } else {
      try {
        setCallingBackend(true);
        await axios.put(`/dishtype/${props.location.state.id}`, e);
        props.history.push("/dishtype");
      } catch (error) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Dish updating failed!",
        });
      } finally {
        setCallingBackend(false);
      }
    }
  };

  const get = async (id) => {
    try {
      const data = await axios.get(`/dishtype/${id}`);

      setInitialValues({
        name: data.data.name,
        description:data.data.description
      });
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  useEffect(() => {
    if (props.location.state) {
      setComponentType("update");
      get(props.location.state.id);
    }
    /* eslint-disable */
  }, [props.location.state]);

  // validation schema
  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Dish Type is required!")
      .min(3, "Min length for the name is 3"),
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
                        ? "Create a Dish Category"
                        : "Update the Dish Category"
                    }
                  />
                  <CardContent>
                    <Grid container item spacing={2} xs={12} sm={12} md={12}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="name"
                          label="Dish Category"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="description"
                          label="Description"
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
                          {componentType === "create" ? "create" : "update"}
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

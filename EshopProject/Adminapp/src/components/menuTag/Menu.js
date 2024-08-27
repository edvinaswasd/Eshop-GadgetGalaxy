import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  FormControl,
  TextField as TF,
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
import Dialog from "../../components/DialogBox/DialogBox";

import axios from "axios";
import { Autocomplete } from "@material-ui/lab";

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
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [resdata, setResData] = useState(" ");
  //const [menuTags, setMenuTags] = useState([]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    restaurantId: "",
    restaurant: {},
  });

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const loadData = async () => {
    try {
      const restaurants = await axios.get(`/restaurant`);

      setRestaurants(restaurants.data);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  const submit = async (e, { resetForm }) => {
    if (componentType === "create") {
      try {
        setCallingBackend(true);
          await axios.post("/menu", {
          name: e.name,
          restaurantId: e.restaurantId,
        });

       // setMenuTags(...menuData);

        resetForm();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Menu created successfully!",
        });

        setTimeout(() => {
          setAlert({
            showAlert: false,
            severity: "success",
            message: "",
          });
        }, 3000);
      } catch (error) {
        if (error.response.status === 403) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Menu already exists!",
          });
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Menu creation failed!",
          });
        }
      } finally {
        setCallingBackend(false);
      }
    } else {
      try {
        setCallingBackend(true);
        await axios.put(`/menu/${props.location.state.id}`, e);
        props.history.push("/menu");
      } catch (error) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Dish Sub Category updating failed!",
        });
      } finally {
        setCallingBackend(false);
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const get = async (id) => {
    try {
      const data = await axios.get(`/menu/${id}`);

      setInitialValues({
        name: data.data.name,
        restaurantId: data.data.restaurantId._id,
        restaurant: data.data.restaurantId,
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
    loadData();
  }, []);

  useEffect(() => {
    if (props.location.state && props.location.state.id) {
      setComponentType("update");
      get(props.location.state.id);
    }

    if (
      props.location.state &&
      props.location.state.restaurantData &&
      props.location.state.restaurantData._id
    ) {
      setResData(props.location.state.restaurantData);
      setInitialValues({
        ...initialValues,
        restaurantId: props.location.state.restaurantData._id,
        restaurant: props.location.state.restaurantData,
      });
    }
    /* eslint-disable */
  }, [props.location.state]);

  // validation schema
  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Menu name is required!")
      .max(30, "Max length for the name is 30.")
      .min(3, "Min length for the name is 3"),
    restaurantId: Yup.string().required("Restaurant is required!"),
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
          {({ isValid, dirty, handleChange, values, setFieldValue }) => {
            return (
              <Form>
                <Card>
                  <CardHeader
                    title={
                      componentType === "create"
                        ? "Create a Menu Tag"
                        : "Update the Menu Tag"
                    }
                  />
                  <CardContent>
                    <Grid container item spacing={2} xs={12} sm={12} md={12}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="name"
                          label="Menu"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={12}>
                        <FormControl fullWidth variant="outlined">
                          <Autocomplete
                            id="combo-box-demo"
                            options={restaurants}
                            value={values.restaurant}
                            onInputChange={(event, newInputValue) => {}}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                const { _id } = newValue;

                                setFieldValue("restaurantId", _id);
                                setFieldValue("restaurant", newValue);
                              } else {
                                setFieldValue("restaurantId", null);
                              }
                            }}
                            renderInput={(params) => (
                              <TF
                                {...params}
                                placeholder="Restaurant"
                                variant="outlined"
                              />
                            )}
                          />
                        </FormControl>
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
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          {componentType === "create" ? "create" : "update"}
                        </Button>
                        {alert.severity === "success" ? (
                          <Dialog
                            handleClickOpen={handleClickOpen}
                            open={open}
                            handleClose={handleClose}
                            phrase="Digital Menu"
                            path="/dish-create"
                            restaurantData={resdata}
                          />
                        ) : (
                          ""
                        )}
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

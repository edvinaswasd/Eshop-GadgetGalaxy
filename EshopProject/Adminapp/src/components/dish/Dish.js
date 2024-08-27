import React, { useState, useEffect, Fragment } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  FormControl,
  Box,
  Typography,
  TextField as TF,
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import Tags from "../restaurant/sub/Tags";
import SpecificTags from "../restaurant/sub/SpecificTags";

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

import { storage } from "../../firebase/firebase";

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

  const [defaultImageUpload, setDefaultImageUpload] = useState(false);
  const [disable, setDisable] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: "",
    dishName: "",
    price: "",
    description: "",
    calories: "",
    tags: [],
    menuTags: [],
    restaurantId: "",
    image:
      "https://firebasestorage.googleapis.com/v0/b/retirement-cal.appspot.com/o/dish%2FGottaMenu-dishes-thumbnail.jpgTue%20Jun%2001%202021%2010%3A51%3A56%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=6e31bfa0-e72c-4597-9d28-7482b06f6d86",
    dish: {},
    restaurant: {},
    order: "",
  });

  const [tags, setTags] = useState([]);
  const [specificTag, setSpecificTag] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [open, setOpen] = React.useState(false);

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const submit = async (e, { resetForm }) => {
    if (componentType === "create") {
      try {
        let price = Number(e.price);

        let calories = Number(e.calories);

        calories = Math.abs(calories);

        price = Math.abs(price);

        price = price.toFixed(2);

        setCallingBackend(true);
        await axios.post("/dish", {
          name: e.name,
          dishName: e.dishName,
          price: price,
          description: e.description,
          calories: calories,
          tags: e.tags,
          restaurantId: e.restaurantId,
          image: e.image,
          menuTags: e.menuTags,
          order: e.order,
        });
        resetForm();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Dish created successfully!",
        });

        setTimeout(() => {
          setAlert({
            showAlert: false,
            severity: "success",
            message: "",
          });
        }, 6000);
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
        let price = Number(e.price);

        price = Math.abs(price);

        let calories = Number(e.calories);

        calories = Math.abs(calories);

        e.calories = Math.trunc(calories);

        e.price = price.toFixed(2);
        setCallingBackend(true);
        await axios.put(`/dish/${props.location.state.id}`, e);
        props.history.push("/dish");
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
      const data = await axios.get(`/dish/${id}`);
      setInitialValues({
        name: data.data.name,
        dishName: data.data.dishName._id,
        price: data.data.price,
        description: data.data.description,
        calories: data.data.calories,
        tags: data.data.tags,
        restaurantId: data.data.restaurantId._id,
        image: data.data.image,
        menuTags: data.data.menuTags,
        dish: data.data.dishName,
        restaurant: data.data.restaurantId,
        order: data.data.order,
      });

      const menu = await axios.get("/menu");

      const checkedTags = menu.data.filter(
        (tag) => tag.restaurantId._id === data.data.restaurantId._id
      );

      setSpecificTag(checkedTags);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

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
      setInitialValues({
        ...initialValues,
        restaurantId: props.location.state.restaurantData._id,
        restaurant: props.location.state.restaurantData,
      });

      specifcTagsFlow(props.location.state.restaurantData._id);
    }
    /* eslint-disable */
  }, [props.location.state]);

  useEffect(() => {
    loadData();

    /* eslint-disable */
  }, []);

  const specifcTagsFlow = async (id) => {
    try {
      const menu = await axios.get("/menu");

      const checkedTags = menu.data.filter(
        (tag) => tag.restaurantId._id === id
      );

      setSpecificTag(checkedTags);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data Load failed!",
      });
    }
  };

  const loadData = async () => {
    try {
      const tags = await axios.get(`/tag`);

      const checkTags = tags.data.filter(
        (tag) =>
          tag.tagMaster.tagType === "all" || tag.tagMaster.tagType === "dish"
      );

      const restaurants = await axios.get(`/restaurant`);
      const dishes = await axios.get(`/dishtype`);

      const checkedDish = dishes.data.filter(
        (dish) => dish.dishTypeId && dish.status
      );

      checkedDish.forEach(dish => {
        dish.name = `${dish.name} (${dish.dishTypeId.name})`
      });

      setTags(checkTags);
      setDishes(checkedDish);
      setRestaurants(restaurants.data);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  const handleImageAsFile = async (e, setFieldValue, type, values) => {
    try {
      setDefaultImageUpload(true);
      const image = e.target.files[0];
      const storageRef = storage.ref();
      const fileRef = storageRef.child(
        `dish/${image.name}${image.lastModifiedDate}`
      );
      const uploadTaskSnapshot = await fileRef.put(image);
      const imageUrl = await uploadTaskSnapshot.ref.getDownloadURL();

      setFieldValue("image", imageUrl);

      // setArtWorkUpload(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setDefaultImageUpload(false);
    }
    // setImageAsFile(imageFile => (image))
  };

  const removeImage = (setFieldValue) => {
    setFieldValue(
      "image",
      "https://firebasestorage.googleapis.com/v0/b/retirement-cal.appspot.com/o/dish%2FGottaMenu-dishes-thumbnail.jpgTue%20Jun%2001%202021%2010%3A51%3A56%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=6e31bfa0-e72c-4597-9d28-7482b06f6d86"
    );
  };

  const handleRestaurantChange = async (id, setFieldValue) => {
    //set the restaurant

    setFieldValue("restaurantId", id);

    setFieldValue("menuTags", []);

    try {
      const physicalMenu = await axios.get(`/searchMenu`);

      const menuFilter = physicalMenu.data.find(
        (menu) => menu.restaurantId._id === id
      );

      if (menuFilter) {
        setOpen(false);
        setDisable(false);
      } else {
        setOpen(true);
        setDisable(true);
      }

      const menu = await axios.get("/menu");

      const checkedTags = menu.data.filter(
        (tag) => tag.restaurantId._id === id
      );

      setSpecificTag(checkedTags);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data Load failed!",
      });
    }
  };

  // validation schema
  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Dish name is required!")
      .max(30, "Max length for the name is 30.")
      .min(3, "Min length for the name is 3"),
    dishName: Yup.string()
      .required("Dish Sub Category is required!")
      .max(30, "Max length for the name is 30.")
      .min(3, "Min length for the name is 3"),
    // price: Yup.string()
    //   .required("Price is required!")
    //   .max(10, "Max length for the address is 10."),
    // description: Yup.string()
    //   .required("Description is required!")
    //   .max(150, "Max length for the name is 150."),
    // calories: Yup.string().required("Calories is required!"),
    //tags: Yup.array().min(1).required(),
    // image:Yup.string()
    // .required("")
  });

  return (
    <Grid container className={classes.root} spacing={1}>
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
      {open && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            Restaurant should have at-least one menu to create a dish
          </Alert>
        </Snackbar>
      )}
      <Grid item xs={12} sm={12} md={12}>
        <Formik
          initialValues={initialValues}
          onSubmit={submit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({
            isValid,
            dirty,
            handleChange,
            handleBlur,
            values,
            setFieldValue,
          }) => {
            return (
              <Form>
                <Card>
                  <CardHeader
                    title={
                      componentType === "create"
                        ? "Create a Dish"
                        : "Update the Dish"
                    }
                  />
                  <CardContent>
                    <Grid container item spacing={2}>
                      <Grid item xs={12} sm={12} md={4}>
                        <Field
                          name="name"
                          label="Name"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          multiline
                        ></Field>
                      </Grid>

                      <Grid item xs={12} sm={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                          <Autocomplete
                            id="combo-box-demo"
                            options={dishes}
                            value={values.dish}
                            onInputChange={(event, newInputValue) => {}}
                            // name="restaurantId"
                            getOptionLabel={(option) =>option.name}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                const { _id } = newValue;
                                setFieldValue("dishName", _id);
                                setFieldValue("dish", newValue);
                              } else {
                                setFieldValue("dishName", null);
                              }
                            }}
                            renderInput={(params) => (
                              <TF
                                {...params}
                                placeholder=" Dish Sub Category"
                                variant="outlined"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                          <Autocomplete
                            id="combo-box-demo"
                            options={restaurants}
                            value={values.restaurant}
                            onInputChange={(event, newInputValue) => {
                              // setInputValue(newInputValue);
                            }}
                            // name="restaurantId"
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                const { _id } = newValue;
                                handleRestaurantChange(_id, setFieldValue);
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
                      <Grid item xs={12} sm={12} md={4}>
                        <Field
                          name="price"
                          label="Price"
                          component={TextField}
                          s
                          variant="outlined"
                          fullWidth
                          type="number"
                          onChange={(e) => {
                            e.preventDefault();
                            const { value } = e.target;
                            const regex =
                              /^(0*[0-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                            if (regex.test(value.toString())) {
                              setFieldValue("price", value);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4}>
                        <Field
                          name="calories"
                          label="Calories"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          type="number"
                          onChange={(e) => {
                            e.preventDefault();
                            const { value } = e.target;
                            const regex =
                              /^(0*[0-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                            if (regex.test(value.toString())) {
                              setFieldValue("calories", value);
                            }
                          }}
                        ></Field>
                      </Grid>

                      <Grid item xs={12} sm={12} md={4}>
                        <Field
                          name="order"
                          label="Order"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          type="number"
                          onChange={(e) => {
                            e.preventDefault();
                            const { value } = e.target;
                            const regex =
                              /^(0*[0-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                            if (regex.test(value.toString())) {
                              setFieldValue("order", value);
                            }
                          }}
                        ></Field>
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

                      <Grid item xs={12} sm={6} md={6}>
                        {defaultImageUpload ? (
                          "Uploading..."
                        ) : (
                          <Fragment>
                            <div className={classes.viewButton}>
                              <label htmlFor="upload-photo">
                                <input
                                  style={{ display: "none" }}
                                  id="upload-photo"
                                  name="upload-photo"
                                  type="file"
                                  accept="image/jpeg,image/png"
                                  onChange={(e) => {
                                    e.persist();
                                    handleImageAsFile(
                                      e,
                                      setFieldValue,
                                      "image",
                                      values
                                    );
                                  }}
                                />

                                <Button
                                  color="secondary"
                                  variant="contained"
                                  component="span"
                                  size="small"
                                >
                                  Image
                                </Button>
                              </label>

                              {componentType === "update" ||
                              values.image !==
                                "https://firebasestorage.googleapis.com/v0/b/retirement-cal.appspot.com/o/dish%2FGottaMenu-dishes-thumbnail.jpgTue%20Jun%2001%202021%2010%3A51%3A56%20GMT%2B0530%20(India%20Standard%20Time)?alt=media&token=6e31bfa0-e72c-4597-9d28-7482b06f6d86" ? (
                                <Box ml={2} display="inline">
                                  <Button
                                    color="inherit"
                                    variant="contained"
                                    component="span"
                                    size="small"
                                    onClick={(e) => removeImage(setFieldValue)}
                                  >
                                    Remove image
                                  </Button>
                                </Box>
                              ) : (
                                ""
                              )}

                              <div>
                                {values.image && (
                                  <img
                                    src={values.image}
                                    style={{
                                      maxHeight: "200px",
                                      marginTop: "1rem",
                                    }}
                                  ></img>
                                )}
                              </div>
                            </div>
                          </Fragment>
                        )}
                      </Grid>

                      {/* {tags are common restaurant tags are specific to restaurant} */}

                      <div style={{ width: "100%" }}>
                        <Typography component="div">
                          <Box
                            component="span"
                            display="block"
                            p={1}
                            m={1}
                            fontWeight="fontWeightMedium"
                            fontFamily="Roboto"
                            color="info.contrastText"
                            bgcolor="#748ca3"
                          >
                            Tags
                          </Box>
                        </Typography>
                      </div>

                      {specificTag ? (
                        <SpecificTags
                          values={values}
                          setFieldValue={setFieldValue}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          tags={specificTag}
                        />
                      ) : (
                        ""
                      )}

                      <Tags
                        values={values}
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        tags={tags}
                      />
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
                          disabled={
                            !dirty || !isValid || disable || !values.image
                          }
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
    </Grid>
  );
}

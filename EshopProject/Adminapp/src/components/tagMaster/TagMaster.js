import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import axios from "axios";

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

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const [initialValues, setInitialValues] = useState({
    tagname: "",
    tagtype: "dish",
  });

  const [componentType, setComponentType] = useState("create");

  const [callingBackend, setCallingBackend] = useState(false);

  const tags = [
    {
      text: "Dish",
      value: "dish",
    },
    {
      text: "Restaurant",
      value: "restaurant",
    },
    {
      text: "All",
      value: "all",
    },
  ];

  //get tagMaster
  const get = async (id) => {
    try {
      const data = await axios.get(`/tagmaster/${id}`);
     
      setInitialValues({
        tagname: data.data.name,
        tagtype: data.data.tagType,
      });
    } catch (error) {
     
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  const submit = async (e) => {
    
    if (componentType === "create") {
      try {
        setCallingBackend(true);
       
        await axios.post("/tagmaster", {
          name: e.tagname,
          tagType: e.tagtype,
        });

        setAlert({
          showAlert: true,
          severity: "success",
          message: "Tag Master created successfully!",
        });
        setTimeout(() => {
          setAlert({
            showAlert: false,
            severity: "success",
            message: "",
          });

          // const path = "/";
          // props.history.push(path);
        }, 3000);
      } catch (error) {
        if (error.response.status === 403) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Tag Name Exists!",
          });
          setTimeout(() => {
            setAlert({
              showAlert: false,
              severity: "failed",
              message: "",
            });
          }, 3000);
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: " server Error!",
          });
          setTimeout(() => {
            setAlert({
              showAlert: false,
              severity: "failed",
              message: "",
            });
          }, 3000);
        }
      } finally {
        setCallingBackend(false);
      }
    } else {
      try {
        await axios.put(`/tagmaster/${props.location.state.id}`, e);
        props.history.push("/tagmaster");
      } catch (error) {
        if (error.response.status === 403) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Tag Name Exists!",
          });
          setTimeout(() => {
            setAlert({
              showAlert: false,
              severity: "failed",
              message: "",
            });
          }, 3000);
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: " Update Failed!",
          });
          setTimeout(() => {
            setAlert({
              showAlert: false,
              severity: "failed",
              message: "",
            });
          }, 3000);
        }
      }
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
    tagname: Yup.string()
      .required("Name is required!")
      //.matches(/^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/, 'Please enter valid name')
      .max(15, "Max length for the name is 15.")
      .min(3, "Min length for the name is 3"),
    tagtype: Yup.string().required(),
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
          {({
            isValid,
            dirty,
            values,
            setFieldValue,
            handleChange,
            handleBlur,
          }) => {
            return (
              <Form>
                <Card>
                  <CardHeader
                    title={
                      componentType === "create"
                        ? "Create a Tag Master"
                        : "Update the Tag Master"
                    }
                  />

                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="tagname"
                          label="Tag Name"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={12}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="tagtype"
                            name="tagtype"
                            row
                            value={values.tagtype}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                          >
                            {tags.map((tag) => {
                              return (
                                <FormControlLabel
                                  value={tag.value}
                                  control={<Radio />}
                                  label={tag.text}
                                />
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    {callingBackend ? (
                      "Please wait..."
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
        <Grid item md={12} sm={12} xs={12}>
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

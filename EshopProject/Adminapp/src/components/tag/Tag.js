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

 

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const [initialValues, setInitialValues] = useState({
    TagMasterId: "",
    name: "",
   TagMaster:{}
  });

  const [componentType, setComponentType] = useState("create");

  const [callingBackend, setCallingBackend] = useState(false);

  const [tagMaster,setTagMaster] = useState([]);

  

  

  //get tagMaster
  const get = async (id) => {
    try {
      const data = await axios.get(`/tag/${id}`);
     
      setInitialValues({
        name: data.data.name,
        TagMasterId:data.data.tagMaster._id,
        TagMasterName:data.data.tagMaster.name,
        TagMaster:data.data.tagMaster
      });
    } catch (error) {
    
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  //Load Tags
  const loadTagMaster = async () => {
    try {
      let tagmaster = await axios.get("/tagmaster");
    
      setTagMaster(tagmaster.data)
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Tag Master loading failed!",
      })
    }
  };

  const submit = async (e ,{ resetForm }) => {
    
    if (componentType ==="create") {
      try {
        setCallingBackend(true);
       
        await axios.post("/tag", {
          name: e.name,
          tagMaster: e.TagMasterId,
        });
        resetForm();

        setAlert({
          showAlert: true,
          severity: "success",
          message: "Tag  created successfully!",
        });
        setTimeout(() => {
          setAlert({
            ...alert,showAlert: false,
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
        await axios.put(`/tag/${props.location.state.id}`, e);
        props.history.push("/tag");
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
   

        loadTagMaster()
        
      if (props.location.state) {
        setComponentType("update")
        get(props.location.state.id)
        // componentType("update");
      }
    /* eslint-disable */
  }, [props.location.state]);

  // validation schema

  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required!")
      .max(15, "Max length for the name is 15.")
      .min(3, "Min length for the name is 3"),
    TagMasterId:Yup.string()
      .required()
   
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
                        ? "Create a Tag"
                        : "Update the Tag"
                    }
                  />

                  <CardContent>
                    <Grid item container spacing={1}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="name"
                          label="Name"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                        ></Field>
                      </Grid>
                      
                      {!values.forAllTagMasters && (
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          className={classes.flex}
                        >
                        

                          <FormControl fullWidth variant="outlined">
                          <Autocomplete
                            id="combo-box-demo"
                            options={tagMaster}
                            value={values.TagMaster}
                            onInputChange={(event, newInputValue) => {
                             
                            }}
                    
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                              if (newValue) {
                      
                                const { _id } = newValue;

                                setFieldValue("TagMasterId", _id);
                                setFieldValue("TagMaster", newValue);
                              } else {
                                setFieldValue("TagMasterId", null);
                              }
                            }}
                            // onChange={(e) => {
                            //   e.persist();
                            //   onChangeRestaurant(e, setFieldValue);
                            // }}
                            renderInput={(params) => (
                              <TF
                                {...params}
                                placeholder="Tag Master"
                                variant="outlined"
                              />
                            )}
                          />
                            {/* <InputLabel id="demo-simple-select-label">
                              Tag Master
                            </InputLabel>
                            <Select
                              onChange={handleChange}
                              onBlur={handleChange}
                              value={values.TagMasterId}
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              label="Customer"
                              name="TagMasterId"
                              
                            >
                              {tagMaster.map((e, i) => (
                                <MenuItem value={e._id} key={i}>
                                  {e.name}
                              
                                </MenuItem>
                              ))}
                            </Select> */}
                          </FormControl>
                        </Grid>
                      )}
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

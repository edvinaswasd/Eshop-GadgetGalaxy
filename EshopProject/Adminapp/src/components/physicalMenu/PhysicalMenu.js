import React, { useState, useEffect} from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  FormControl,
  InputLabel,
  TextField as TF,
  CardMedia,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";
import green from "@material-ui/core/colors/green";

import { TextField } from "formik-material-ui";

// validation
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import axios from "axios";
import ReactS3Client from "../../utils/s3";
import { Autocomplete } from "@material-ui/lab";
import Dialog from '../../components/DialogBox/DialogBox';

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
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    backgroundSize: "contain",
  },
}));

export default function PhysicalMenu(props) {
  const classes = useStyles();

  const [componentType, setComponentType] = useState("create");
  const [callingBackend, setCallingBackend] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [menuImages, setMenuImages] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [resdata,setResData] = useState(" ");

  const [initialValues, setInitialValues] = useState({
    restaurantId: "",
    name: "",
    images: [],
    restaurant: {},
  });

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const theme = createMuiTheme({
    palette: {
      primary: green,
      secondary: yellow,
    },
  });

  const loadData = async () => {
    try {
      const restaurants = await axios.get(`/restaurant`);

      setRestaurants(restaurants.data);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Loading restaurants failed!",
      });
    }
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageAsFile = async (e, values,setFieldValue) => {
    try {
      let images =[...menuImages]
      setCallingBackend(true);
      const res = await ReactS3Client.uploadFile(
        e.target.files[0],
        e.target.files[0].name
      );
      setFieldValue(`images[${values.images.length}]`
      ,res.location);
      images.push(res.location)
      setMenuImages(images);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Physical menu uploading failed!",
      });
    } finally {
      setCallingBackend(false);
    }
  };

  const get = async (id) => {
    try {
      setMenuImages([]);
      const  {data}  = await axios.get(`/searchMenu/${id}`);
      setMenuImages(data.images);
      setInitialValues({
        name: data.name,
        restaurantId: data.restaurantId._id,
        images: data.images,
        restaurant:data.restaurantId
       
      });
       
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Loading physical menus failed!",
      });
    }
  };

  const submit = async (e, { resetForm }) => {
    if (componentType === "create"){
      try {
        setCallingBackend(true);
        await axios.post("/searchMenu", {
          name: e.name,
          restaurantId: e.restaurantId,
          images: e.images,
        });
        resetForm();
        setMenuImages([]);
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
    }else{
      try{
        await axios.put(`/searchMenu/${props.location.state.id}`, e);
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Menu Update success!",
        });
        props.history.push("/physicalMenu");
        
      }catch(error){
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Menu update failed!",
        });
      }
    }
  };

  const removeImage = async (idx,setFieldValue,values) => {
    try {
      menuImages.splice(idx,1);
    setFieldValue(`images`
     ,menuImages);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Removing a menu failed!",
      });
    }
  };


  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (props.location.state && props.location.state.id ) {
      setComponentType("update");
      get(props.location.state.id);
    }
    if(props.location.state && props.location.state.restaurantData && props.location.state.restaurantData._id){
      setResData(props.location.state.restaurantData);
      setInitialValues({...initialValues,
        restaurantId:props.location.state.restaurantData._id,
        restaurant:props.location.state.restaurantData
      })
    }
    /* eslint-disable */
  }, [props.location.state]);

  // useEffect(() => {
  //   if (menuImages.length) {
  //     setComponentType("update");
  //     //get(props.location.state.id);
  //   }
  //   /* eslint-disable */
  // }, [menuImages.length]);



  // const onDownload = () => {
  //   const url = window.URL.createObjectURL(new Blob([buffer]));
  //   const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", "image.jpg"); //or any other extension
  //         document.body.appendChild(link);
  //         link.click();
  // };
  // validation schema
  let validationSchema = Yup.object().shape({
    name: Yup.string().required("Menu name required!"),
    //.matches(/^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/, 'Please enter valid name'),
    images: Yup.array().min(1).required(),
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
          {({ values, setFieldValue, dirty, isValid }) => {
            return (
              <Form>
                <Card>
                  <CardHeader
                    title={
                      componentType === "create"
                        ? "Upload physical menu"
                        : "Update physical menu"
                    }
                  />
                  <CardContent>
                    <Grid container item spacing={2} xs={12} sm={12} md={12}>
                      <Grid item xs={12} sm={12} md={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="demo-simple-select-label"></InputLabel>
                          <Autocomplete
                            id="combo-box-demo"
                            options={restaurants}
                            value={values.restaurant}
                            onInputChange={(event, newInputValue) => {
                          
                            }}
                          
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

                        
                      <Grid item xs={12} sm={12} md={12}>
                            <Field
                              name="name"
                              label="Menu Name"
                              component={TextField}
                              variant="outlined"
                              fullWidth
                             
                            />
                          </Grid>
                       

                      <Grid item xs={12} sm={12} md={12}>
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
                                values,
                                setFieldValue
                              );
                            }}
                          />
                          {callingBackend ? (
                            <p>Uploading...</p>
                          ) : (
                            <Button
                              color="secondary"
                              variant="contained"
                              component="span"
                              size="small"
                              fullWidth
                              disabled={!values.restaurantId}
                            >
                              upload
                            </Button>
                            
                          )}
                        </label>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} container spacing={2}>
                      {menuImages.map((item,idx) => (
                        <Grid item key={item.imageURL} xs={12} sm={12} md={3}>
                          <Card>
                            <CardMedia
                              className={classes.media}
                              image={item}
                              title="Paella dish"
                            />
                            <CardActions>
                              <Button
                                color="secondary"
                                variant="contained"
                                onClick={() =>
                                  removeImage(
                                    idx ,
                                    setFieldValue,
                                    values
                                  )
                                }
                              >
                                Remove
                              </Button>
                              <Button
                                color="secondary"
                                variant="contained"
                                onClick={() =>window.open(item, '_blank', 'noopener,noreferrer')
                                }
                              >
                                Show Image
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
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
                          disabled={!values.name || !values.restaurantId || !values.images.length}
                          onClick={()=>{setOpen(true)}}
                        >
                          {componentType === "create" ? "create" : "update"}
                        </Button>
                        {/* <Button
                              onClick={onDownload}
                              className={classes.button}
                              variant="contained"
                              component="span"
                              disabled={!values.name || !values.restaurantId || !values.images.length}
                              color="secondary">
                              Download
                        </Button> */}
                        {alert.severity==='success'? <Dialog handleClickOpen={handleClickOpen} open={open} handleClose={handleClose} phrase="Physical Menu" path='/dish-menu' restaurantData={resdata}/>:""}
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

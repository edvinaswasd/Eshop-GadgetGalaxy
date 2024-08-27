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
  TextField as TF
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

// sub components
import OpeningHours from "./sub/OpeningHours";
import Tags from "./sub/Tags";

import { storage } from "../../firebase/firebase";
import Dialog from '../../components/DialogBox/DialogBox';
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
  const [resdata,setResData] = useState(" ");
  const [initialValues, setInitialValues] = useState({
    name: "",
    address: "",
    description: "",
    logo:'https://via.placeholder.com/150/#C0C0C0/000000?Text=WebsiteBuilders.com%20C/O%20https://placeholder.com/',  
    website: "",
    tags: [],
    openingHours: [
      {
        day: "Sunday",
        from: "07:30",
        to: "20:30",
        isAllDayOpen: false,
        isAllDayClosed:false
      },
      {
        day: "Monday",
        from: "07:30",
        to: "20:30",
        isAllDayOpen: false,
        isAllDayClosed:false
      },
      {
        day: "Tuesday",
        from: "07:30",
        to: "20:30",
        isAllDayOpen: false,
        isAllDayClosed:false
      },
      {
        day: "Wednesday",
        from: "07:30",
        to: "20:30",
        isAllDayOpen: false,
        isAllDayClosed:false
      },
      {
        day: "Thursday",
        from: "07:30",
        to: "20:30",
        isAllDayOpen: false,
        isAllDayClosed:false
      },
      {
        day: "Friday",
        from: "07:30",
        to: "20:30",
        isAllDayOpen: false,
        isAllDayClosed:false
      },
      {
        day: "Saturday",
        from: "07:30",
        to: "20:30",
        isAllDayOpen: false,
        isAllDayClosed:false
      },
    ],
    images:[],
    latitude:"",
    longitude:"",
    phoneNumbers:"",
    restaurantOwner:"",
    owner:{}
  });

  const [tags, setTags] = useState([]);
  const [owners, setOwners] = useState([]);
  const [defaultImageUpload, setDefaultImageUpload] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [qrLogo,setQrLogo]=useState("");

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

 const addDefaultSrc =(ev)=>{
    ev.target.src = 'some default image url'
  }



  const submit = async (e, { resetForm }) => {
    if (componentType === "create") {
      try {
        setCallingBackend(true);

        const location ={type:"Point",coordinates:[e.longitude,e.latitude]}


      /*const url = 'https://qrcode-monkey.p.rapidapi.com/qr/uploadImage';
      const formData = new FormData();
      formData.append('file',e.logo)

      

      const config = {
          headers: {
            "content-type": "multipart/form-data",
            "x-rapidapi-key":
              "7ce91bfe43msh9dd6398f3319988p1a0265jsn5e2a34a4d02f",
            "x-rapidapi-host": "qrcode-monkey.p.rapidapi.com",
          }
      }*/
     // const qr = await post(url, formData,config)


        
      const data =  await axios.post("/restaurant", {
          name: e.name,
          address: e.address,
          openingHours: e.openingHours,
          description: e.description,
          logo: e.logo,
          website: e.website,
          tags: e.tags,
          images:e.images,
          location:location,
          phoneNumbers:e.phoneNumbers,
          restaurantOwner:e.restaurantOwner,
          qrLogo:qrLogo
        });



        setResData(data.data.data);
      
        resetForm();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Restaurant created successfully!",
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
            message: "Restaurant already exists!",
          });
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Restaurant creation failed!",
          });
        }
      } finally {
        setCallingBackend(false);
      }
    } else {
      try {
        setCallingBackend(true);
        
        const location ={type:"Point",coordinates:[e.longitude,e.latitude]};

        const data =  {
          name: e.name,
          address: e.address,
          openingHours: e.openingHours,
          description: e.description,
          logo: e.logo,
          website: e.website,
          tags: e.tags,
          images:e.images,
          location:location,
          phoneNumbers:e.phoneNumbers,
          restaurantOwner:e.restaurantOwner,
          qrLogo:qrLogo
        }

        await axios.put(`/restaurant/${props.location.state.id}`, data);
        props.history.push("/restaurants");
      } catch (error) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Restaurant updating failed!",
        });
      } finally {
        setCallingBackend(false);
      }
    }
  };

  const get = async (id) => {
    try {
      const data = await axios.get(`/restaurant/${id}`);

      let ownerId;

      if(data.data.ownerId===null){
        ownerId=''
      }else{
        ownerId=data.data.ownerId
      }

    
      setInitialValues({
        name: data.data.name,
        address: data.data.address,
        openingHours: data.data.openingHours,
        description: data.data.description,
        logo: data.data.logo,
        website: data.data.website,
        tags: data.data.tags,
        latitude:data.data.location.coordinates[1],
        longitude:data.data.location.coordinates[0],
        phoneNumbers:data.data.phoneNumbers,
        restaurantOwner:ownerId._id,
        owner:ownerId

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

  useEffect(() => {
    loadData();

    /* eslint-disable */
  }, []);

  const isalldayopen = [
    {
      text: "Yes",
      value: "yes",
    },
    {
      text: "No",
      value: "no",
    },
  ];

  const loadData = async () => {
    try {

      const tags = await axios.get(`/tag`);
      const users = await axios.get(`/user`);


       const checkTags = tags.data.filter((tag)=> tag.tagMaster.tagType==='all' || tag.tagMaster.tagType==='restaurant')

    
     
      setTags(checkTags);
   

      function check(user) {
        return user.local.role === "restaurantOwner" && user.status === true;
      }

      const checkedusers = users.data.filter(check);
   

      setOwners(checkedusers);
    
    
    } catch (error) {
     
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeImage = (setFieldValue) => {
    setFieldValue("logo",'https://via.placeholder.com/150/#C0C0C0/000000?Text=WebsiteBuilders.com%20C/O%20https://placeholder.com/')
  };

  const handleImageAsFile = async (e, setFieldValue, type,values) => {
    try {
      setDefaultImageUpload(true);
      const image = e.target.files[0];
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`restaurant/${image.name}${image.lastModifiedDate}`);
      const uploadTaskSnapshot = await fileRef.put(image);
      const imageUrl = await uploadTaskSnapshot.ref.getDownloadURL();

      if (type === "logo") {
        setFieldValue("logo", imageUrl);
      } else {
        setFieldValue(`images[${values.images.length}]`,imageUrl)
      }

      
      const formData = new FormData();
      formData.append('file',image)

      const config = {
          headers: {
            "content-type": "multipart/form-data",
            "x-rapidapi-key":
              "7ce91bfe43msh9dd6398f3319988p1a0265jsn5e2a34a4d02f",
            "x-rapidapi-host": "qrcode-monkey.p.rapidapi.com",
          }
      }
      const qr = await axios.post('https://qrcode-monkey.p.rapidapi.com/qr/uploadImage', formData,config);
      setQrLogo(qr.data.file)
    } catch (error) {
      console.error(error);
    } finally {
      setDefaultImageUpload(false);
    }
    // setImageAsFile(imageFile => (image))
  };

  // validation schema
  let validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Restaurant name is required!")
      .max(50, "Max length for the name is 50.")
      .min(3, "Min length for the name is 3"),
    address: Yup.string()
      .required("Address is required!")
      .max(60, "Max length for the address is 60."),
    // description: Yup.string()
    //   .required("Description is required!")
    //   .max(500, "Max length for the name is 500."),
    website: Yup.string()
      .matches(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Enter correct url!"
      )
      .required("Please enter website"),
    latitude:  Yup.string()
    .required("Latitude is required!")
    .max(20, "Max length for the Latitude is 20."),
    longitude:  Yup.string()
    .required("Longitude is required!")
    .max(20, "Max length for the Longitude is 20."),
  
  });

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid container item xs={12} sm={12} md={12}>
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
                        ? "Create a Restaurant"
                        : "Update the Restaurant"
                    }
                  />
                  <CardContent>
                    <Grid container item spacing={2}>
                      <Grid item xs={12} sm={12} md={6}>
                        <Field
                          name="name"
                          label="Restaurant Name"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={6}>
                        <Field
                          name="address"
                          label="Address"
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
                          rows={3}
                        ></Field>
                      </Grid>

                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="website"
                          label="Website"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={12}>
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
                                    handleImageAsFile(e, setFieldValue,"logo",values);
                                  }}
                                />

                                <Button
                                  color="secondary"
                                  variant="contained"
                                  component="span"
                                  size="small"
                                >
                                  Logo
                                </Button>
                              </label>
                              {componentType==='update'||values.logo !==
                                "https://via.placeholder.com/150/#C0C0C0/000000?Text=WebsiteBuilders.com%20C/O%20https://placeholder.com/" ? (
                                  <Box  ml={2} display='inline'>
                                    <Button
                                      color="inherit"
                                      variant="contained"
                                      component="span"
                                      size="small"
                                      onClick={(e)=>removeImage(setFieldValue)}
                                    >
                                      Remove Logo
                                    </Button>
                                  </Box>
                                ) : (
                                  ""
                                )}
                              <div>
                               {values.logo && (
                                 <img src={values.logo} style={{maxHeight:'200px',marginTop:'1rem'}} onError={addDefaultSrc} ></img>
                               )}
                              </div>
                            </div>
                          </Fragment>
                        )}
                      </Grid>

                      <OpeningHours
                        values={values}
                        setFieldValue={setFieldValue}
                      />

                      <Tags
                        values={values}
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        tags={tags}
                      />

                      <Grid item xs={12} sm={12} md={4}>
                        <Field
                          name="latitude"
                          label="Latitude"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          type="number"
                          required
                        
                        ></Field>
                      </Grid>

                      <Grid item xs={12} sm={12} md={4}>
                        <Field
                          name="longitude"
                          label="Longitude"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                          type="number"
                        ></Field>
                      </Grid>

                      <Grid item xs={12} sm={12} md={4}>
                        <Field
                          name="phoneNumbers"
                          label="Phone Number"
                          component={TextField}
                          variant="outlined"
                          fullWidth
                          required
                        
                        ></Field>
                      </Grid>

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
                            Restaurant Owner
                          </Box>
                        </Typography>
                      </div>

                      <Grid item xs={12} sm={12} md={12}>
                       
                        <FormControl fullWidth variant="outlined">
                         <Autocomplete
                            id="combo-box-demo"
                            options={owners}
                            value={values.owner}
                            onInputChange={(event, newInputValue) => {
                            
                            }}
                        
                            getOptionLabel={(option) => {
                              if(option.fullName){
                                return  option.fullName
                              }else {
                                return ""
                              }
                             }}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                const { _id } = newValue;

                                setFieldValue("restaurantOwner", _id);
                                setFieldValue("owner", newValue);
                              } else {
                                setFieldValue("restaurantOwner", null);
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
                          disabled={!dirty || !isValid || !values.logo}
                          onClick={()=>{setOpen(true)}}
                        >
                          {componentType === "create" ? "create" : "update"}
                        </Button>
                        {alert.severity==='success'?  <Dialog handleClickOpen={handleClickOpen} open={open} handleClose={handleClose} phrase="Restaurant" path='/physical-menu'  restaurantData = {resdata} />:"" }
                       
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

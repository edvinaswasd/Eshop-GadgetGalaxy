import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  FormControl,
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
  const [category, setCategory] = useState([]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    dishTypeId:"",
    category:{}
  });


  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const loadData = async () => {
    try {
      const dishType = await axios.get(`/dishtype/dishcategory`);

  

      // function check(dish) {
      //   return dish.dishTypeId === null ;
      // }

      // const checkedish = dishType.data.filter(check);
     
      setCategory(dishType.data);

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
        await axios.post("/dishtype", {
            name: e.name,
            dishTypeId:e.dishTypeId
        });
        resetForm();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Dish Sub Category created successfully!",
        });
      } catch (error) {
        if (error.response.status === 403) {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Dish Sub Category already exists!",
          });
        } else {
          setAlert({
            showAlert: true,
            severity: "error",
            message: "Dish Sub Category creation failed!",
          });
        }
      } finally {
        setCallingBackend(false);
      }
    } else {
      try {
        setCallingBackend(true);
        await axios.put(`/dishtype/${props.location.state.id}`, e);
        props.history.push("/dishsub");
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

  const get = async (id) => {
    try {
      const data = await axios.get(`/dishtype/${id}`);
      setInitialValues({
        name: data.data.name,
        dishTypeId:data.data.dishTypeId._id,
         category:data.data.dishTypeId
      });
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  useEffect(()=>{
    loadData()
  },[])

 

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
      .required("Dish Sub Type is required!")
      .min(3, "Min length for the name is 3"),
    dishTypeId: Yup.string().required("")
  });

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid  item xs={12} sm={12} md={12}>
        <Formik
          initialValues={initialValues}
          onSubmit={submit}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ isValid, dirty,handleChange,values,setFieldValue}) => {
            return (
              <Form>
                <Card>
                  <CardHeader
                    title={
                      componentType === "create"
                        ? "Create a Dish Sub Category"
                        : "Update the Dish Sub Category"
                    }
                  />
                  <CardContent>
                    <Grid container item spacing={2} xs={12} sm={12} md={12}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Field
                          name="name"
                          label="Dish Sub Category"
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
                            options={category}
                            value={values.category}
                            onInputChange={(event, newInputValue) => {
                           
                            }}
                        
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                const { _id } = newValue;

                                setFieldValue("dishTypeId", _id);
                                setFieldValue("category", newValue);
                              } else {
                                setFieldValue("restaurantId", null);
                              }
                            }}
                            // onChange={(e) => {
                            //   e.persist();
                            //   onChangeRestaurant(e, setFieldValue);
                            // }}
                            renderInput={(params) => (
                              <TF
                                {...params}
                                placeholder="Category"
                                variant="outlined"
                              />
                            )}
                          />
                          {/* <InputLabel id="demo-simple-select-label">
                            Categories
                          </InputLabel>
                          <Select
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={values.dishTypeId}
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label="Categories"
                            name="dishTypeId"
                          >
                            {category.map((e, i) => (
                              <MenuItem value={e._id} key={i}>
                                {e.name}
                                                         
                              </MenuItem>
                            ))}
                          </Select> */}
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

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import { register } from "../../store/actions/authActions";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";
//import photo from "../../assets/GottaMenu-Web-Logo-New.png";
import "../../styles/login.css";
//import "../../styles/register.css";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions/authActions";

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
    fontSize:"80px",
    color: '#C7335A',
    height: 48,
    fontFamily: "Ubuntu",
    fontStyle: "normal",
    fontWeight: "normal",
  },
  padding: {
    padding: theme.spacing(6),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: '5px',
    marginRight: "30px",
    width: "500px",
    height: "500px",
    marginTop: "50px",
   
  },
  button: {
    alignItems:"center",
    display: "flex",
    justifyContent: "center",
    marginTop:'30px',
    //borderRadius:"30px",
    // //color: "#ffffff",
     //backgroundColor: "#C7335A",
     cursor:"pointer",
    padding:"15px 32px",
    // border:"none",
     textDecoration:"none",
    // display:"inline-block",
    // margin:"4px 2px",
    // border:"none"
  },
  login:{
    textDecoration: "none",
    float: "right",
    marginRight:'23px',
    color:'#C7335A',
    marginTop: '-10px'
    
  }
}));

let initialValues = {
  email: "",
  password: "",
  name:"",
  passwordretry:""
};

let SignUpSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required!"),
  schoolName: Yup.string().required("School Name is required!"),
  password: Yup.string()
    .required("Password is required!")
    .min(6, "Min length for the password is 6.")
    .max(15, "Max length for the password is 15."),
    passwordRetry: Yup.string()
    .required("Password is required!")
    .min(6, "Min length for the password is 6.")
    .max(15, "Max length for the password is 15."),
});

function Register(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  let token = useSelector((state) => state.auth.token);
  let dispatch = useDispatch();

  const [values, setValues] = React.useState({
    passwordretry: "",
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  useEffect(() => {
    if (token) {
      dispatch(logout());
    }
    // eslint-disable-next-line
  }, []);

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });
  const [redirect, setRedirect] = useState(false);

  const submit = async (e) => {
    try {
      const data = await axios.post("/user", {
        email: e.email,
        name: e.name,
        password: e.password,
        passwordRetry: e.passwordretry
      });
      setRedirect(true);
      const { name, role, token, permissions, id } = data.data;

      props.register(name, role, token, permissions, id);
      const path = permissions.find((item) => !item.includes("update"));
      props.history.push(path);
    } catch (error) {
      if (error.response.status === 401) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Unauthorized!",
        });
      } else {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Server error!",
        });
      }
    }
  };
  if(redirect){
    return navigate("/user/login")
}

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.root}
      spacing={1}
    >
      <div className="wrapper">
        <div className="left">
          <div id="img-pane">
            {/* <img className="logo" src={photo} alt="Login" style={{marginRight:'20px'}} /> */}
          </div>
        </div>
        <div className="right">
          <div className="login">
            <Grid item md={12}>
              <Card className={classes.padding} variant="outlined">
                <CardHeader
                  className={classes.center}
                  title="Sign up"
                ></CardHeader>

                <Formik
                  initialValues={initialValues}
                  onSubmit={submit}
                  validationSchema={SignUpSchema}
                >
                  {({ dirty, isValid }) => {
                    return (
                      <Form>
                        <CardContent>
                          <Field
                            name="email"
                            label="Email"
                            component={TextField}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                          ></Field>

                          <Field
                            name="name"
                            label="School Name"
                            component={TextField}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                          ></Field>

                          <Field
                            name="password"
                            label="Password"
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

                          <Field
                            name="passwordRetry"
                            label="Password Retry"
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
                        </CardContent>
                        <Grid >
                          <Grid item>
                            <Link className={classes.login} to="/">Login</Link>
                          </Grid>
                        </Grid>
                        <div className="button">
                        <CardActions className={classes.button}>
                          <Button
                           variant="contained"
                            //color="primary"
                            fullWidth
                            disabled={!dirty || !isValid}
                            type="submit"
                          >
                            Sign up
                          </Button>
                        </CardActions>
                        </div>
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

export default connect(null, {})(Register);

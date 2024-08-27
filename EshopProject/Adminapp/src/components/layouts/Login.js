import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
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
import { login } from "../../store/actions/authActions";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import "../../styles/login.css";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/actions/authActions";
import { useNavigate } from "react-router-dom";

// validation
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField } from "formik-material-ui";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    height: "100%",

  },
  center: {
    color: '#C7335A',
    height: 48,
    textAlign: "center",
    fontFamily: "Ubuntu",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: '50px'

  },
  padding: {
    padding: theme.spacing(3),
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: '5px',

  },
  signup: {
    textDecoration: 'none',
    float: 'right',
    marginLeft: '297px',
    color: '#C7335A',
    marginTop: '-10px'

  },
  button: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
    marginTop: '30px',
    color: 'white',
    backgroundColor: '#0066B2',
    "&:hover": {
      backgroundColor: "#808080",
      color: "white",
    },
  },

}));

let initialValues = {
  email: "",
  password: "",
};

let SignUpSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required!"),
  password: Yup.string()
    .required("Password is required!")
    .min(6, "Min length for the password is 6.")
    .max(15, "Max length for the password is 15."),
});

function Login(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  //let token = useSelector((state) => state.auth.token);
  //let dispatch = useDispatch();

  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const [login, setLogin] = React.useState(false);

  /* useEffect(() => {
    if (token) {
      dispatch(logout());
    }
  }, []); */

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
      if (e.email === 'admin@eshop.com' && e.password === 'admin123') {
        navigate('/users')
      }


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
          message: "Invalid credentials!",
        });
      }
      setLogin(false);
    }
  };
  if (redirect) {
    navigate("/dashboard")
    window.location.reload()
  }


  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.root}
      spacing={1}
      style={{
        position: 'absolute',
        Shadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        left: '45%',
        left: '45%',
        left: '45%',
        top: '48%',
        bottom: '70%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="wrapper">
        <div className="left">
          <div id="img-pane">
          </div>
        </div>
        <div className="right">
          <div className="login">
            <Grid>
              <Card className={classes.padding} variant="outlined">
                <CardHeader
                  title="Log in"
                  className={classes.center}
                ></CardHeader>
                <Formik
                  initialValues={initialValues}
                  onSubmit={submit}
                  validationSchema={SignUpSchema}
                >
                  {({ dirty, isValid }) => {
                    return (
                      <Form className="form">
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
                        </CardContent>
                        <CardActions>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={!dirty || !isValid || login}
                            type="submit"
                            className={classes.button}
                          >
                            login
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

export default connect(null, { login })(Login);

import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    Typography,
  } from "@material-ui/core";
  import React, { useEffect, useState } from "react";
  import { useStyles } from "./classes";
  import axios from "axios";
  import styles from "./ViewRestaurant.module.css";
  import PhoneIcon from "@material-ui/icons/Phone";
  import FeedbackIcon from "@material-ui/icons/Feedback";
  import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
  import formatOpeningHours from "../../utils/formatOpeningHours";
  import GoogleMap from "../../utils/GoogleMaps";
  
  export default function ViewRestaurant(props) {
    const classes = useStyles();
  
    const [details, setDetails] = useState({});
    const [openingHours, setOpeningHours] = useState([]);
    const [alert, setAlert] = useState({
      showAlert: false,
      severity: "success",
      message: "",
    });
  
    const get = async (id) => {
      try {
        const data = await axios.get(`restaurant/${id}`);
  
        const formatData = formatOpeningHours(data.data.openingHours);
        setDetails(data.data);
        setOpeningHours(formatData);
      } catch (error) {
        //setAlert
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Data Load failed!",
        });
      }
    };
  
    useEffect(() => {
      if (props.location.state) {
        get(props.location.state.id);
      }
      /* eslint-disable */
    }, [props.location.state]);
  
    return (
      <div>
        <Card style={{ borderRadius: "15px" }}>
          <CardContent>
            <Grid
              container
              xs={12}
              sm={12}
              md={12}
              //justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid
                container
                item
                xs={12}
                sm={12}
                md={12}
                justify="center"
                alignItems="center"
              >
                <img src={details.logo} className={classes.logo}></img>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} >
                <Typography className={classes.description}>
                  {details.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} justify="center">
                <Paper variant="outlined" className={styles.map} id="googleMap">
                  {details.location && details.location.coordinates && (
                    <GoogleMap location={details.location} />
                  )}
                </Paper>
                {/**Map */}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography display="block" className={classes.description}>
                  {details.address}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                
                //justify="flex-start"
              >
                <Typography variant="h6" className={classes.description}>
                  {" "}
                  <Box fontWeight="fontWeightBold">Opening Hours</Box>
                </Typography>
              </Grid>
  
              <Grid  item xs={12} sm={12} md={12} lg={12} >
                <Grid item xs={12} sm={6} md={12} lg={12} className={classes.description}>
                  {openingHours.map((open) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                      >
                        <Typography className={classes.description} >
                          {`${open.day} :`}
                        </Typography>
  
                        <Typography
                          className={classes.description}
                          style={{ marginLeft: "5px" }}
                        >
                          {`${open.from} - ${open.to}`}
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    container
                    justify="flex-start"
                    alignItems="center"
                    className={classes.phone}
                  >
                   
                    <Button startIcon={<PhoneIcon />} className={classes.phoneBtn} disableRipple>  {details.phoneNumbers}</Button>
                  </Grid>
  
                  <Grid
                    container
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                    
                       <Button startIcon={ <FeedbackIcon />} className={classes.linkButton} disableRipple> View FeedBack</Button>
                    </Grid>
  
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                     
                        <Button startIcon={ <FavoriteBorderIcon />} className={classes.linkButton} disableRipple>Add to favourite</Button>
                    </Grid>
                  </Grid>
  
                  <Grid xs={12} sm={12} md={12} lg={12}>
                    {/* <Button className={classes.dwnButton}>
                      <Box display="inline">
                        <GetAppIcon />
                      </Box>
                      {/* <Box display="inline"> Download Menu </Box> }
                    </Button> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
      </div>
    );
  }
  
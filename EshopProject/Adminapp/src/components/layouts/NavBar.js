import React, { Fragment } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Chip,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import FaceIcon from "@material-ui/icons/Face";
import { makeStyles } from "@material-ui/core/styles";
import { logout, toggleDrawer } from "../../store/actions/authActions";

import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  self: {
    backgroundColor: "blue",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  flexGrow: {
    marginLeft: "auto",
  },
  chipStyles: {
    marginLeft: "30rem",
    marginRight: "1rem",

    backgroundColor: "white",
  },
}));

function NavBar(props) {
  const classes = useStyles();

  let history = useHistory();

  let dispatch = useDispatch();

  let token = useSelector((state) => state.auth.token);

  let name = useSelector((state) => state.auth.name);

  const onLogout = () => {
    dispatch(logout());
    history.push("/");
  };

  const toggle = () => {
    dispatch(toggleDrawer());
  };

  const navigator = () => {
    if(!token){
      history.push("/");
    }
  }

  // check ci cd

  return (
    <div>
      <AppBar
        position="fixed">
        <Toolbar>
          {token && (
            <IconButton
              onClick={toggle}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="" onClick={navigator} style={{cursor:" pointer "}}></Typography>

          {token && (
            <Fragment>
              <Chip
                icon={<FaceIcon />}
                label={name}
                variant="outlined"
                className={classes.chipStyles}
              />
              <Button
                color="inherit"
                variant="outlined"
                onClick={onLogout}
                className={classes.flexGrow}
              >
                logout
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;

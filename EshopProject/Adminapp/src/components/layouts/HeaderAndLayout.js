import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Typography,
  Grid
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import DropDownImage from "../../assets/Dropdown.png"
import { IoIosHome } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { BsFillBagDashFill } from "react-icons/bs";
import { FaBoxOpen } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { AiFillUnlock } from "react-icons/ai";
import { GiFiles } from "react-icons/gi";

import SearchBar from "material-ui-search-bar";
import Dialog from "../ResetPassword/ResetDialogBox";
import { ToastContainer, toast } from 'react-toastify';

const drawerWidth = 175;

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#FFFFFF',
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },

  appBarShift: {
    backgroundColor: "#0066B2",
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  image: {
    marginTop: "1rem",
    marginLeft: "2rem",
  },
  icon: {
    fontSize: "2rem",
    marginRight: "1rem",
    marginTop: "0.5rem",
    // color: "#5B6871"
    color: "white"
  },
  iconNav: {
    fontSize: "1.5rem",
    marginRight: "1rem",
    marginLeft: "1rem",
    color: "#5B6871"
  },
  iconNav1: {
    fontSize: "1.5rem",
    marginLeft: "1rem",
    color: "#ffff"
  },

  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    fontFamily: "Ubuntu ,sans-serif",
    color: "#5B6871"
  },
  listCSS: {
    width: drawerWidth,
    marginTop: "0.6rem",

  },
  drawer: {
    backgroundColor: "#F6F8F9",
  },
  content: {
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },

  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  },
  SearchBarCSS: {
    width: "65rem",
  },

  paper: {
    background: "#0066B2"
  }

}));



const HeaderAndLayout = (props) => {
  const navigate = useNavigate();
  function logOut() {
    localStorage.clear();
    navigate("/")
  }
  const classes = useStyles();
  const [opens, setOpens] = useState(false);
  const [open, setOpen] = useState(true);
  const [succesMessage, setSuccesMessage] = useState(false);
  const [failMessage, setFailMessage] = useState(false);
  const [failPasswordMatch, setFailPasswordMatch] = useState(false);

  const notify = () => succesMessage ? toast.success('Action successful!', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }) : failMessage ? toast.error('Action failed!', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }) : failPasswordMatch ? toast.error('Passwords do not match!', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }) : null

  const handleClickOpen = (row) => {
    setOpens(true);
  };

  const handleClose = () => {
    setOpens(false);
  };

  useEffect(() => {
    if (succesMessage) {
      notify();
      setSuccesMessage(false);
    } else {
      if (failMessage) {
        notify();
        setFailMessage(false);
      } else {
        if (failPasswordMatch) {
          notify();
          setFailPasswordMatch(false);
        }
      }
    }
  }, [succesMessage, failMessage, failPasswordMatch]);






  return (
    <div>
      <CssBaseline />
      <Drawer
        open={open} onClose={() => setOpen(false)} variant="persistent"
        classes={{ paper: classes.paper, }}
      >

        <List disablePadding className={classes.listCSS} style={{ marginTop: '50px' }}>
          {/* <ListItem disabled={props.activeItem === "dashboard"} button onClick={() => { navigate("/dashboard") }}>
            <IoIosHome className={classes.icon} />
            <ListItemText style={{ color: "#ffff", fontFamily: 'Ubuntu ,sans-serif', marginTop: '1rem' }} primary="Dashboard" />
          </ListItem> */}
          <ListItem disabled={props.activeItem === "users"} button onClick={() => { navigate("/users") }}>
            <BsPersonCircle className={classes.icon} />
            <ListItemText style={{ color: "#ffff", fontFamily: 'Ubuntu ,sans-serif', marginTop: '1rem' }} primary="Users" />
          </ListItem>
          <ListItem disabled={props.activeItem === "jobs"} button onClick={() => { navigate("/jobs") }}>
            <BsFillBagDashFill className={classes.icon} />
            <ListItemText style={{ color: "#ffff", fontFamily: 'Ubuntu ,sans-serif', marginTop: '1rem' }} primary="Cart Items" />
          </ListItem>
          <ListItem disabled={props.activeItem === "projects"} button onClick={() => { navigate("/projects") }}>
            <FaBoxOpen className={classes.icon} />
            <ListItemText style={{ color: "#ffff", fontFamily: 'Ubuntu ,sans-serif', marginTop: '1rem' }} primary="Products" />
          </ListItem>
          <ListItem disabled={props.activeItem === "xml"} button onClick={() => { navigate("/xml") }}>
            <AiFillUnlock className={classes.icon} />
            <ListItemText style={{ color: "#ffff", fontFamily: 'Ubuntu ,sans-serif', marginTop: '1rem' }} primary="Generate XML" />
          </ListItem>
          <ListItem disabled={props.activeItem === "pdf"} button onClick={() => { navigate("/pdf") }}>
            <GiFiles className={classes.icon} />
            <ListItemText style={{ color: "#ffff", fontFamily: 'Ubuntu ,sans-serif', marginTop: '1rem' }} primary="Generate PDF" />
          </ListItem>

        </List>
      </Drawer>
      <AppBar
        className={classNames(classes.appBar, { [classes.appBarShift]: open })}
      >
        <div style={{ flexgrow: 1 }}>
          <Toolbar>
            <Typography
              variant="h4"
              style={{
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
                color: "white",
                fontWeight: "800"
              }}
            >
              E-shop
            </Typography>
            <div>
              {/* <GiHouseKeys className={classes.iconNav1} onClick={() => handleClickOpen()} /> */}
              <FiLogOut className={classes.iconNav1} onClick={logOut} />
            </div>
          </Toolbar>
        </div>
        <Dialog
          handleClickOpen={handleClickOpen}
          open={opens}
          handleClose={handleClose}
          setSuccesMessage={setSuccesMessage}
          setFailPasswordMatch={setFailPasswordMatch}
          setFailMessage={setFailMessage}
        />
        <ToastContainer position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHove />
      </AppBar>
    </div>
  )

};
export default HeaderAndLayout;
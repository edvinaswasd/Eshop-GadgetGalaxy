import React, { Fragment, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { List, Collapse } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import { toggleDrawer } from "../../store/actions/authActions";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import photo from "../../assets/GottaMenu-Web-Logo-New.png";

import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";

import { withRouter } from "react-router";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

function TemporaryDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  
  const [openIndex, setOpenIndex] = useState(0);

  let history = useHistory();

  const handleDrawerClose = () => {
    props.toggleDrawer();
  };

  const handleClick = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const onToggle = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    props.toggleDrawer();
  };

  const onRoute = (path) => {
    // props.history.push(path);
    history.push(path);

    props.toggleDrawer();
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>

      <div style={{backgroundColor:'white'}}>
            <img className="logo" src={photo} alt="Login"  style={{width:'250px'}}/>
      </div>  


      <Divider />

      <List>
        {props.permissions.map((route, index) => (
          <Fragment key={index}>
            <ListItem button onClick={(e) => handleClick(index)}>
              <ListItemText primary={route.name} />
              {index === openIndex ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {route.children.length && (
              <Collapse
                in={openIndex === index ? true : false}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {route.children.map((child, idx) => (
                    <ListItem
                      button
                      className={classes.nested}
                      key={idx}
                      onClick={() => onRoute(child.path)}
                    >
                      <ListItemText primary={child.name} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </Collapse>
            )}
          </Fragment>
        ))}
        <Link to='/account' style={{textDecoration:'none', color:'white'}}>
        <ListItem button >
            <ListItemText primary="Account" />
            </ListItem>
        </Link>
       
      </List>
      {/* <Divider /> */}
    </div>
  );

  return (
    <div>
      {props.token && (
        <Drawer
          anchor="left"
          open={props.isDrawerOpen}
          onClose={onToggle("left", false)}
          variant="persistent"
        >
          {list("left")}
        </Drawer>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerOpen: state.auth.isDrawerOpen,
    token: state.auth.token,
    permissions: state.auth.routes,
  };
};

export default withRouter(
  connect(mapStateToProps, { toggleDrawer })(TemporaryDrawer)
);

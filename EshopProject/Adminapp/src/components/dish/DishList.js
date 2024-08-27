import React, { Fragment,useState } from "react";
import { TableCell, Button, Snackbar } from "@material-ui/core";

import ReusableTable from "../layouts/ReusableTable";
import axios from 'axios';
import { Alert } from "@material-ui/lab";

const headers = [
  {
    text: "Dish Sub Category",
    value: "dishName",
  },
  {
    text: "Dish Name",
    value: "name",
  },
  {
    text: "Image",
    value: "image",
  },
  {
    text: "Restaurant",
    value: "restaurantId",
  },
  {
    text: "Price",
    value: "price",
  },
  {
    text: "Description",
    value: "description",
  },
  {
    text: "Calories",
    value: "calories",
  },
 
  {
    text: "Change Status",
    value: "status",
  },
  {
    text: "Update",
    value: "update",
  },
  {
    text: " Get Duplicate ",
    value: "Duplicate",
  },
];
export default function TagMasterList(props) {


  const TableB = ({ item, changeStatus, classes, onUpdate,loadData }) => {

    const [alert, setAlert] = useState({
      showAlert: false,
      severity: "success",
      message: "",
    });
    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpen(false);
    };

    const copy = async (id) =>{
      try{
        await axios.post('/dish/copy',{id:id});
        loadData();
        setAlert({
          showAlert: true,
          severity: "success",
          message: "Dish Copied!",
        });
        setOpen(true)
  
      }catch(error){
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Dish Copy Failed!",
        });
      }
    }
  
    return (
      <Fragment>
        <TableCell key="dishName">{item.dishName.name}</TableCell>
        <TableCell key="name">{item.name}</TableCell>
        <TableCell key="image"><img src={item.image} style={{maxHeight:'100px'}} alt=" "></img></TableCell>
        <TableCell key="restaurantId">{item.restaurantId.name}</TableCell>
        <TableCell key="price">{item.price}</TableCell>
        <TableCell key="description">{item.description}</TableCell>
        <TableCell key="calories">{item.calories}</TableCell>
        <TableCell key="status">
          {item.status ? (
            <Button
              variant="contained"
              className={classes.red}
              onClick={() => changeStatus(item._id, item.status)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="contained"
              className={classes.green}
              onClick={() => changeStatus(item._id, item.status)}
            >
              Activate
            </Button>
          )}
        </TableCell>
        <TableCell key="update">
          <Button
            variant="contained"
            className={classes.yellow}
            onClick={() => onUpdate(item._id)}
          >
            update
          </Button>
        </TableCell>
        <TableCell key="pdf">
        <Button
          variant="contained"
          className={classes.yellow}
          onClick={() => copy(item._id)}
          >
          Duplicate
        </Button>
      </TableCell>
      {open && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
           {alert.showAlert && (
        
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, showAlert: false })}
          >
            {alert.message}
          </Alert>
       
      )}
        </Snackbar>
      )}
      </Fragment>
    );
  };
  return (
    <ReusableTable
      title="View  Dish"
      headers={headers}
      items={[]}
      TableB={TableB}
      fetchDataUrl="/dish"
      statusChangeUrl="/dish/status"
      updatePath="/update-dish"
      {...props}
    />
  );
}

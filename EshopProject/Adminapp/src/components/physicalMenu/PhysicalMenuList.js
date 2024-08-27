import React, { Fragment } from "react";
import { TableCell, Button } from "@material-ui/core";
// import Moment from 'react-moment';
// import 'moment-timezone';
import moment from 'moment'


import ReusableTable from "../layouts/ReusableTable";

const headers = [
  {
    text: "Restaurant Name",
    value: "restaurantName",
  },
  {
    text: "Menu Name",
    value: "name",
  },
  {
    text: "Change Status",
    value: "status",
  },
  
  {
    text: "Last Updated At",
    value: "update",
  },
  
  {
    text: "Update",
    value: "update",
  },

];
export default function PhysicalMenuList(props) {
  const TableB = ({ item, changeStatus, classes, onUpdate }) => {
    return (
      <Fragment>
        <TableCell key="dishName">{item.restaurantId &&item.restaurantId.name}</TableCell>
        <TableCell key="name">{item.name}</TableCell>
        
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
        <TableCell key="update">{moment(item.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
        <TableCell key="update">
          <Button
            variant="contained"
            className={classes.yellow}
            onClick={() => onUpdate(item._id)}
          >
            update
          </Button>
        </TableCell>
      </Fragment>
    );
  };
  return (
    <ReusableTable
      title="View Physical Menu"
      headers={headers}
      items={[]}
      TableB={TableB}
      fetchDataUrl="/searchMenu"
      statusChangeUrl="/searchMenu/status"
      updatePath="/update-physicalmenu"
      {...props}
    />
  );
}

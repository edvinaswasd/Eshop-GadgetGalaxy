import React, { Fragment } from "react";
import { TableCell, Button } from "@material-ui/core";

import ReusableTable from "../layouts/ReusableTable";

const headers = [
  {
    text: "Sub Name",
    value: "name",
  },
  {
    text: "Dish Category",
    value: "category",
  },
  {
    text: "Change Status",
    value: "status",
  },
  {
    text: "Update",
    value: "update",
  },
];
export default function TagMasterList(props) {
  const TableB = ({ item, changeStatus, classes, onUpdate }) => {
    return (
      <Fragment>
        <TableCell key="name">{item.name}</TableCell>
        <TableCell key="category">{item.dishTypeId.name}</TableCell>
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
      </Fragment>
    );
  };
  return (
    <ReusableTable
      title="View Dish Sub Category"
      headers={headers}
      items={[]}
      TableB={TableB}
      fetchDataUrl="/dishtype/dishsubcategory"//change
      statusChangeUrl="/dishtype/status"
      updatePath="/update-dishsub"
      {...props}
    />
  );
}

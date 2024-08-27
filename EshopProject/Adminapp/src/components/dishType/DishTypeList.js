import React, { Fragment } from "react";
import { TableCell, Button } from "@material-ui/core";

import ReusableTable from "../layouts/ReusableTable";

const headers = [
  {
    text: "Dish Category",
    value: "name",
  },
  {
    text: "Description",
    value: "description",
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
        <TableCell key="type">{item.name}</TableCell>
        <TableCell key="type">{item.description}</TableCell>
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
      title="View Dish Category"
      headers={headers}
      items={[]}
      TableB={TableB}
      fetchDataUrl="/dishtype/dishcategory" //change
      statusChangeUrl="/dishtype/status"
      updatePath="/update-dishtype"
      {...props}
    />
  );
}

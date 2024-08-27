import React, { Fragment } from "react";
import { TableCell, Button } from "@material-ui/core";

import ReusableTable from "../layouts/ReusableTable";

const headers = [
  {
    text: "Tag ",
    value: "name",
  },
  {
    text: "Tag Master",
    value: "tagMaster",
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
        <TableCell key="tagMaster">{item.tagMaster.name}</TableCell>
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
      title="View Master Tags"
      headers={headers}
      items={[]}
      TableB={TableB}
      fetchDataUrl="/tag"
      statusChangeUrl="/tag/status"
      updatePath="/update-tag"
      {...props}
    />
  );
}

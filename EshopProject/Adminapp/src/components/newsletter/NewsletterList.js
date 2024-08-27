import React, { Fragment } from "react";
import { TableCell } from "@material-ui/core";

import ReusableTable from "../layouts/ReusableTable";

const headers = [
  {
    text: "Email",
    value: "email",
  },

  {
    text: "Subscribed date",
    value: "joined",
  },
];
export default function NewsletterList(props) {
  const TableB = ({ item, changeStatus, classes, onUpdate }) => {
    return (
      <Fragment>
        <TableCell key="dishName">{item.email}</TableCell>

        <TableCell key="restaurantId">{item.joined}</TableCell>
      </Fragment>
    );
  };
  return (
    <ReusableTable
      title="Newsletter emails"
      headers={headers}
      items={[]}
      TableB={TableB}
      fetchDataUrl="/newsletter"
      statusChangeUrl="/dish/status"
      updatePath="/update-dish"
      {...props}
    />
  );
}

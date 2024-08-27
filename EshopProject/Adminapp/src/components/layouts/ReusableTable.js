import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  TablePagination,
  CardHeader,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";
export default function ReusableTable({
  headers,
  TableB,
  fetchDataUrl,
  statusChangeUrl,
  updatePath,
  title,
  view,
  ...props
}) {
  const [valueToOrderBy, setValueToOrderBy] = useState("name");
  const [orderDirection, setOrderDirection] = useState("asc");

  const [filteredItems, setFilteredItems] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }

    if (b[orderBy] > a[orderBy]) {
      return 1;
    }

    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (event, property) => {
    // const isAscending = valueToOrderBy === property && orderDirection === 'asc';
    const isAscending = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? "desc" : "asc");
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const sortedRowInformation = (rowArray, comparator) => {
    const stabilizedRowArray = rowArray.map((el, index) => [el, index]);
    stabilizedRowArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedRowArray.map((el) => el[0]);
  };

  //alerting
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const [items, setData] = useState([]);

  //use effect
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load data to the table
  const loadData = async () => {
    try {
      const { data } = await axios.get(fetchDataUrl);
      setFilteredItems(data);

      setData(data);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading failed!",
      });
    }
  };

  // activate and deactivate status
  const changeStatus = async (id, status) => {
    try {
      await axios.put(statusChangeUrl, {
        id,
        status: !status,
      });
      loadData();
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Status changing failed!",
      });
    }
  };

  //update
  const onUpdate = (id) => {
    props.history.push(updatePath, { update: true, id });
  };

  const onView = (id) => {
    props.history.push(view, { id });
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    marginBottom: {
      marginBottom: theme.spacing(2),
    },
    green: {
      backgroundColor: "green",
      color: "white",
    },
    red: {
      backgroundColor: "red",
      color: "white",
    },
    yellow: {
      backgroundColor: "orange",
      color: "white",
    },
    textCenter: {
      textAlign: "center",
    },
  }));

  const classes = useStyles();

  const [searchText, setSearchText] = useState("");

  //search
  const onSearch = (e) => {
    const text = String(e.target.value).toLowerCase();
    setSearchText(text);
    if (text) {
      // eslint-disable-next-line
      const result = items.filter((item) => {
        const str = JSON.stringify(item).toLowerCase();

        if (str.search(text) >= 0) return item;
      });
      setPage(0);
      setFilteredItems(result);
    } else {
      setFilteredItems(items);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/purchaseOrder/${id}`, {
        status,
      });
      loadData();
     
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Status changing failed!",
      });
    }
  };

  return (
    <Grid container>
      <Grid item className={classes.root}>
        <Card>
          <CardHeader title={title} />
          <CardContent>
            <TextField
              label="Search"
              fullWidth
              variant="outlined"
              className={classes.marginBottom}
              onChange={onSearch}
              value={searchText}
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header, i) => (
                      <TableCell key={i} sortDirection={orderDirection}>
                        <TableSortLabel
                          active={header.value === valueToOrderBy}
                          onClick={createSortHandler(header.value)}
                          direction={orderDirection}
                        >
                          {header.text.toUpperCase()}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? sortedRowInformation(
                        filteredItems,
                        getComparator(orderDirection, valueToOrderBy)
                      ).slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : sortedRowInformation(
                        filteredItems,
                        getComparator(orderDirection, valueToOrderBy)
                      )
                  ).map((item, i) => (
                    <TableRow key={i}>
                      <TableB
                        item={item}
                        changeStatus={changeStatus}
                        classes={classes}
                        onUpdate={onUpdate}
                        onView={onView}
                        loadData={loadData}
                        updateStatus={updateStatus}
                      />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      </Grid>
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
    </Grid>
  );
}

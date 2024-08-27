import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import Moment from "react-moment";
import axios from "axios";

import { useStyles } from "./classes";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const [feed, setFeed] = useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });
  const [openSnack, setOpenSnack] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const fetchResults = async (id) => {
    try {
      setOpen(!open);
      if (!open) {
        const { data } = await axios.post("/feedback/replyFeed", {
          feedId: id,
        });

        setFeed(data);
      }
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data load Failed!",
      });
      setOpenSnack(true)
    }
  };
  const changeStatus = async (id, status) => {
    try {
      await axios.put("/feedback/status", {
        id: id,
        status: status,
      });
      props.fetchResults();

    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Status change Failed!",
      });
      setOpenSnack(true)
    }
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row" className={classes.cellText}>
          <Moment format="YYYY/MM/DD">{row.view}</Moment>
        </TableCell>
        <TableCell className={classes.cellText}>
          {row.userId?.local.firstName}
        </TableCell>
        <TableCell className={classes.cellText}>{row.resName}</TableCell>
        <TableCell className={classes.cellText}>{row.feed}</TableCell>
        <TableCell className={classes.cellText}>
          {row.status ? (
            <Button
              variant="contained"
              style={{ backgroundColor: "red" }}
              onClick={() => changeStatus(row._id, false)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{ backgroundColor: "green" }}
              onClick={() => changeStatus(row._id, true)}
            >
              Activate
            </Button>
          )}
        </TableCell>
        <TableCell>
          View thread
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => fetchResults(row._id)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <div style={{ maxHeight: 180, overflow: "auto" }}>
                <Typography className={classes.heading}>
                  &nbsp;&nbsp;&nbsp;{row.feed}
                </Typography>
                {feed.map((feed) =>
                  feed.restaurantId ? (
                    <div>
                      <Typography className={classes.message}>
                        &nbsp;&nbsp;&nbsp;{feed.replyFeed}
                      </Typography>
                      <Typography className={classes.resName}>
                        By {feed.resName}&nbsp;&nbsp;&nbsp;
                      </Typography>
                    </div>
                  ) : (
                    <Typography className={classes.heading}>
                      &nbsp;&nbsp;&nbsp;{feed.replyFeed}
                    </Typography>
                  )
                )}
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {openSnack && (
        <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleClose}>
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
    </React.Fragment>
  );
}

export default function AdminFeedBack(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const user = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const fetchResults = async () => {
    try {
      const { data } = await axios.get("/feedback/");

      setRows(data);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data loading Failed!",
      });
      setOpenSnack(true)
    }
  };

  useEffect(() => {
    fetchResults();

    // setRows(dish);
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Paper className={classes.account}>
        <Typography className={classes.editInfo}>View Feedback</Typography>
        <div style={{ backgroundColor: "#FFFAF7" }}>
          <Paper className={classes.paper}>
            <TableContainer
              component={Paper}
              style={{ maxHeight: 490, overflow: "auto" }}
            >
              <Table stickyHeader aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.cell}>DATE</TableCell>
                    <TableCell className={classes.cell}>USER NAME</TableCell>
                    <TableCell className={classes.cell}>
                      RESTAURANT NAME
                    </TableCell>
                    <TableCell className={classes.cell}>
                      YOUR FEEDBACK
                    </TableCell>
                    <TableCell className={classes.cell}>STATUS</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <Row
                        key={row.name}
                        row={row}
                        fetchResults={fetchResults}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </Paper>
      {openSnack && (
        <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleClose}>
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
    </>
  );
}

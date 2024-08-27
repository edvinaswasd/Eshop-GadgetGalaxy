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
import { Formik, Form, Field } from "formik";
import Alert from "@material-ui/lab/Alert";
import * as Yup from "yup";
import axios from "axios";
//import { useSelector } from "react-redux";

import { useStyles, CssTextField } from "./classes";
import { Grid } from "@material-ui/core";

let initialValues = {
  message: "",
};

let replySchema = Yup.object().shape({
  message: Yup.string()
    .required("Reply is required!")
    .max(150, "Max length for the message is 150."),
});

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isServerError, setIsServerError] = useState(false);

  const [feed, setFeed] = useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

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
        message: "Data Load failed!",
      });
    }
  };

  const submit = async (e, { resetForm }) => {
    try {
      var current = new Date();
      const formData = {
        feedId: row._id,
        replyFeed: e.message,
        view: current.toLocaleDateString(),
        restaurantId: row.restaurantId,
        resName: row.resName,
      };
      await axios.post("/feedback/addReplyFeed", formData);
      setIsSuccess(true);

      setTimeout(async () => {
        const { data } = await axios.post("/feedback/replyFeed", {
          feedId: row._id,
        });
        setFeed(data);
        setIsSuccess(false);
        resetForm();
      }, 3000);
    } catch (error) {
      setIsServerError(true);
      setTimeout(() => {
        setIsServerError(false);
      }, 3000);
    }
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row" className={classes.cellText}>
          <Moment format="YYYY/MM/DD">{row.view}</Moment>
        </TableCell>
        <TableCell className={classes.cellText}>
          {row.userId.local.firstName}
        </TableCell>
        <TableCell className={classes.cellText}>{row.resName}</TableCell>
        <TableCell className={classes.cellText}>{row.feed}</TableCell>
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
              <div className={classes.reply}>
                <Button color="secondary" className={classes.replyButton}>
                  Reply
                </Button>
              </div>
              <div>
                <Formik
                  initialValues={initialValues}
                  onSubmit={submit}
                  validationSchema={replySchema}
                >
                  {({ dirty, isValid }) => {
                    return (
                      <Form>
                        <Field
                          name="message"
                          placeholder="  Reply here.."
                          multiline
                          rows={3}
                          component={CssTextField}
                          className={classes.field}
                          variant="outlined"
                          fullWidth
                        ></Field>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alginItem: "center",
                            alginSelf: "center",
                          }}
                        >
                          {isSuccess && (
                            <>
                              <Alert icon={false} severity="success">
                                Reply Feedback added successfully!
                              </Alert>
                            </>
                          )}
                          {isServerError && (
                            <>
                              <Alert icon={false} severity="error">
                                GottaMenu is currently busy Preparing your
                                menus..!
                              </Alert>
                            </>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            variant="contained"
                            className={classes.button}
                            disabled={!dirty || !isValid}
                            type="submit"
                          >
                            Send
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
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
    </React.Fragment>
  );
}

// Row.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired,
//       }),
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//   }).isRequired,
// };

// const rows = [
//   createData("25/03/2021", "Burger King", "your feed text", "Pending"),
//   createData("25/03/2021", "Burger King", "your feed text", "Approved"),
//   createData("25/03/2021", "Burger King", "your feed text", "Approved"),
//   createData("25/03/2021", "Burger King", "your feed text", "Pending"),
//   createData("25/03/2021", "Burger King", "your feed text", "Pending"),
//   createData("25/03/2021", "Burger King", "your feed text", "Approved"),
//   createData("25/03/2021", "Burger King", "your feed text", "Approved"),
//   createData("25/03/2021", "Burger King", "your feed text", "Pending"),
//   createData("25/03/2021", "Burger King", "your feed text", "Approved"),
//   createData("25/03/2021", "Burger King", "your feed text", "Approved"),
//   createData("25/03/2021", "Burger King", "your feed text", "Pending"),
//   createData("25/03/2021", "Burger King", "your feed text", "Pending"),
//   createData("25/03/2021", "Burger King", "your feed text", "Approved"),
//   createData("25/03/2021", "Burger King", "your feed text", "Approved"),
// ];
export default function RestaurantFeedback(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const user = localStorage.getItem("token");

  const [rows, setRows] = useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });

  const fetchResults = async () => {
    try {
      const { data } = await axios.get("/feedback/lists");
      setRows(data);
    } catch (error) {
      setAlert({
        showAlert: true,
        severity: "error",
        message: "Data Load failed!",
      });
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
    </>
  );
}
